import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GAMES_FILE = path.resolve(__dirname, "../src/data/games.ts");

const SHOULD_WRITE = process.argv.includes("--write");
const VERBOSE = process.argv.includes("--verbose");
const CONCURRENCY = 8;
const TIMEOUT_MS = 12000;

/**
 * Hosts confirmed during browser testing to block or break inside iframes at runtime
 * (e.g., JS frame-busters, Turnstile challenges, or strict third-party cookie walls)
 * even when HTTP headers omit X-Frame-Options / frame-ancestors.
 */
const KNOWN_RUNTIME_BLOCKED_HOSTS = new Set([
  // Populated during live browser verification if needed
]);

const SOFT_404_PATTERNS = [
  /domain.*for sale/i,
  /buy this domain/i,
  /parked free/i,
  /godaddy/i,
  /sedoparking/i,
  /dan\.com/i,
  /hugedomains/i,
  /404\s*[-–|:]?\s*not found/i,
  /page not found/i,
  /this site can['’]t be reached/i,
];

function extractGamesFromSource(source) {
  const games = [];
  const blockRegex = /\{\s*\r?\n\s*id:\s*"([^"]+)"[\s\S]*?\r?\n\s*\},/g;
  let match;
  while ((match = blockRegex.exec(source)) !== null) {
    const block = match[0];
    const id = match[1];
    const nameMatch = block.match(/name:\s*"([^"]+)"/);
    const dailyMatch = block.match(/dailyUrl:\s*"([^"]+)"/);
    const unlimitedMatch = block.match(/unlimitedUrl:\s*(null|"([^"]+)")/);
    if (dailyMatch) {
      games.push({
        id,
        name: nameMatch ? nameMatch[1] : id,
        dailyUrl: dailyMatch[1],
        unlimitedUrl:
          unlimitedMatch && unlimitedMatch[1] !== "null"
            ? unlimitedMatch[2]
            : null,
      });
    }
  }
  return games;
}

function evaluateEmbedPolicy(headers, finalUrl, status) {
  let hostname = "";
  try {
    hostname = new URL(finalUrl).hostname.toLowerCase();
  } catch {
    return { canEmbed: false, reason: "invalid-url" };
  }

  if (KNOWN_RUNTIME_BLOCKED_HOSTS.has(hostname)) {
    return { canEmbed: false, reason: "runtime-blocked-host" };
  }

  if (status === 403) {
    return { canEmbed: false, reason: "http-403-challenge" };
  }
  if (status >= 400 || status === 0) {
    return { canEmbed: false, reason: `http-${status}` };
  }

  const xfo = (headers.get("x-frame-options") || "").toLowerCase();
  if (xfo) {
    if (
      xfo.includes("deny") ||
      xfo.includes("sameorigin") ||
      xfo.includes("allow-from")
    ) {
      return { canEmbed: false, reason: `xfo:${xfo.trim()}` };
    }
  }

  const csp = headers.get("content-security-policy") || "";
  if (csp) {
    const directives = csp
      .split(";")
      .map((part) => part.trim())
      .filter((part) => /^frame-ancestors\b/i.test(part));

    if (directives.length > 0) {
      for (const directive of directives) {
        const tokens = directive
          .replace(/^frame-ancestors\s+/i, "")
          .trim()
          .split(/\s+/)
          .filter(Boolean);
        const allowsAnyOrigin = tokens.some(
          (tok) => tok === "*" || tok === "https:" || tok === "http:"
        );
        if (!allowsAnyOrigin) {
          return {
            canEmbed: false,
            reason: `csp:frame-ancestors(${tokens.join(" ")})`,
          };
        }
      }
    }
  }

  return { canEmbed: true, reason: "headers-allow" };
}

async function readSnippet(response, limitBytes = 12288) {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: false });
  let text = "";
  let total = 0;
  try {
    while (total < limitBytes) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.byteLength;
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } catch {
    // Ignore stream cancellation / partial read errors
  } finally {
    try {
      await reader.cancel();
    } catch {
      // Ignore cancel errors
    }
  }
  return text;
}

async function checkUrl(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const snippet = await readSnippet(response);
    const titleMatch = snippet.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch
      ? titleMatch[1].replace(/\s+/g, " ").trim().slice(0, 70)
      : "";

    const isSoft404 = SOFT_404_PATTERNS.some((rx) => rx.test(snippet));
    const cfChallenge =
      response.status === 403 &&
      (snippet.includes("Just a moment") ||
        snippet.includes("cf-browser-verification") ||
        response.headers.get("cf-mitigated") === "challenge");

    const { canEmbed, reason } = evaluateEmbedPolicy(
      response.headers,
      response.url,
      response.status
    );

    return {
      url,
      finalUrl: response.url,
      status: response.status,
      ok: response.status >= 200 && response.status < 400 && !isSoft404,
      cfChallenge,
      isSoft404,
      canEmbed: isSoft404 ? false : canEmbed,
      reason: isSoft404 ? "soft-404-or-parked" : reason,
      title,
      error: null,
    };
  } catch (err) {
    return {
      url,
      finalUrl: url,
      status: 0,
      ok: false,
      cfChallenge: false,
      isSoft404: false,
      canEmbed: false,
      reason: "network-error",
      title: "",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await fn(items[idx], idx);
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    () => worker()
  );
  await Promise.all(workers);
  return results;
}

function updateGamesSource(source, games, resultMap) {
  let updated = source;
  for (const game of games) {
    const dailyRes = resultMap.get(game.dailyUrl);
    const unlimRes = game.unlimitedUrl
      ? resultMap.get(game.unlimitedUrl)
      : null;

    const dailyFlag = dailyRes ? dailyRes.canEmbed : false;
    const unlimFlag = unlimRes ? unlimRes.canEmbed : false;

    const blockRegex = new RegExp(
      `(\\{\\s*\\r?\\n\\s*id:\\s*"${game.id}"[\\s\\S]*?\\r?\\n\\s*\\},)`
    );
    updated = updated.replace(blockRegex, (block) => {
      return block
        .replace(
          /dailyCanEmbed:\s*(true|false)/,
          `dailyCanEmbed: ${dailyFlag}`
        )
        .replace(
          /unlimitedCanEmbed:\s*(true|false)/,
          `unlimitedCanEmbed: ${unlimFlag}`
        );
    });
  }
  return updated;
}

async function main() {
  const source = await fs.readFile(GAMES_FILE, "utf8");
  const games = extractGamesFromSource(source);

  const uniqueUrls = Array.from(
    new Set(
      games
        .flatMap((g) => [g.dailyUrl, g.unlimitedUrl])
        .filter((u) => typeof u === "string")
    )
  );

  console.log(
    `Checking ${uniqueUrls.length} unique URLs across ${games.length} games...`
  );

  const results = await mapWithConcurrency(uniqueUrls, CONCURRENCY, checkUrl);
  const resultMap = new Map(results.map((r) => [r.url, r]));

  const broken = [];
  let embeddableCount = 0;
  let blockedCount = 0;

  console.log("\n=== DAILY & UNLIMITED VERIFICATION REPORT ===");
  for (const game of games) {
    const d = resultMap.get(game.dailyUrl);
    const u = game.unlimitedUrl ? resultMap.get(game.unlimitedUrl) : null;

    if (d.canEmbed) embeddableCount++;
    else blockedCount++;

    const dTag = d.ok
      ? `${d.status}`
      : d.cfChallenge
      ? "403(CF)"
      : `${d.status || "ERR"}`;
    const dEmbed = d.canEmbed ? "EMBED" : "EXT  ";
    const uTag = !u
      ? "DAILY-ONLY"
      : u.ok
      ? `${u.status}`
      : u.cfChallenge
      ? "403(CF)"
      : `${u.status || "ERR"}`;
    const uEmbed = !u ? "  -  " : u.canEmbed ? "EMBED" : "EXT  ";

    console.log(
      `[${String(games.indexOf(game) + 1).padStart(2, "0")}] ${game.name.padEnd(
        18
      )} | D: ${dTag.padEnd(7)} ${dEmbed} (${d.reason}) | U: ${uTag.padEnd(
        10
      )} ${uEmbed}${u ? ` (${u.reason})` : ""}`
    );
    if (VERBOSE) {
      console.log(`     D -> ${d.finalUrl} | "${d.title}"`);
      if (u) {
        console.log(`     U -> ${u.finalUrl} | "${u.title}"`);
      }
    }

    if (!d.ok && !d.cfChallenge) {
      broken.push({
        game: game.id,
        kind: "daily",
        url: game.dailyUrl,
        status: d.status,
        reason: d.reason,
        error: d.error,
        title: d.title,
      });
    }
    if (u && !u.ok && !u.cfChallenge) {
      broken.push({
        game: game.id,
        kind: "unlimited",
        url: game.unlimitedUrl,
        status: u.status,
        reason: u.reason,
        error: u.error,
        title: u.title,
      });
    }
  }

  console.log("\n=== SUMMARY ===");
  console.log(`Total games: ${games.length}`);
  console.log(`Daily URLs embeddable: ${embeddableCount}`);
  console.log(`Daily URLs external-only: ${blockedCount}`);
  console.log(`Broken / soft-404 / error URLs: ${broken.length}`);

  if (broken.length > 0) {
    console.log("\n=== ISSUES TO FIX ===");
    for (const item of broken) {
      console.log(
        `- [${item.game}] (${item.kind}) ${item.url} -> status=${item.status}, reason=${item.reason}${item.error ? `, err=${item.error}` : ""}${item.title ? `, title="${item.title}"` : ""}`
      );
    }
  }

  if (SHOULD_WRITE) {
    const nextSource = updateGamesSource(source, games, resultMap);
    await fs.writeFile(GAMES_FILE, nextSource, "utf8");
    console.log("\nUpdated dailyCanEmbed & unlimitedCanEmbed in src/data/games.ts");
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
