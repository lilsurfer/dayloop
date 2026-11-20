# Dayloop

A sleek dark-mode, Neal.fun-inspired hub for daily browser games and their **Unlimited** (play-forever) counterparts.

## Features
- **39+ Curated Daily & Unlimited Games** ranked by relevance, with custom per-game SVG/CSS mini-poster artwork.
- **Hover / Tap Dual Launcher** for switching instantly between **Daily** and **Unlimited** modes.
- **Hybrid Smart-Launch** backed by header verification (`scripts/verify-games.mjs`) — embeddable games open inside the full-screen **Game Theater**, while frame-restricted publishers open cleanly in a new tab.
- **Local-Only Player QoL** via `localStorage`: daily played checklist (auto-resets at local midnight), pinned favorites, category & niche filtering, instant search (`/`), and **Surprise Me**.

## Local Development

```bash
npm install
npm run verify:games
npm run dev
```

## Verify Game URLs & Embed Flags

```bash
npm run verify:games:write
```

## Cloudflare Pages Deployment (`github.com/lilsurfer/dayloop`)

Dayloop builds to a zero-server static export (`out/`).

- **Framework preset:** `Next.js (Static HTML Export)`
- **Build command:** `npm run build`
- **Build output directory:** `out`
- **Environment variables:** `NODE_VERSION=20`
