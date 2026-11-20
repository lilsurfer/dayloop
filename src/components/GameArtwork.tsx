"use client";

import React from "react";
import type { ArtworkType } from "@/data/games";

interface GameArtworkProps {
  type: ArtworkType;
  accentColors: [string, string];
}

function GlowBackdrop({
  c1,
  c2,
  variant = 0,
}: {
  c1: string;
  c2: string;
  variant?: number;
}) {
  const pos1 =
    variant % 3 === 0
      ? "radial-gradient(circle at 22% 25%, " + c1 + "38 0%, transparent 58%)"
      : variant % 3 === 1
      ? "radial-gradient(circle at 78% 22%, " + c1 + "36 0%, transparent 58%)"
      : "radial-gradient(circle at 50% 20%, " + c1 + "34 0%, transparent 62%)";
  const pos2 =
    variant % 2 === 0
      ? "radial-gradient(circle at 82% 78%, " + c2 + "28 0%, transparent 55%)"
      : "radial-gradient(circle at 18% 80%, " + c2 + "28 0%, transparent 55%)";

  return (
    <>
      <div
        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `${pos1}, ${pos2}` }}
      />
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />
    </>
  );
}

export function GameArtwork({ type, accentColors }: GameArtworkProps) {
  const [c1, c2] = accentColors;

  const renderMotif = () => {
    switch (type) {
      case "wordle": {
        const rows = [
          ["S", "T", "A", "R", "E"],
          ["L", "O", "O", "P", "S"],
          ["D", "A", "I", "L", "Y"],
        ];
        const states = [
          [0, 1, 0, 2, 0],
          [0, 1, 1, 0, 0],
          [2, 2, 2, 2, 2],
        ];
        return (
          <div className="flex flex-col gap-1.5 -rotate-2">
            {rows.map((row, ri) => (
              <div key={ri} className="flex gap-1.5">
                {row.map((ch, ci) => {
                  const st = states[ri][ci];
                  const bg =
                    st === 2
                      ? c1
                      : st === 1
                      ? c2
                      : "rgba(255,255,255,0.08)";
                  return (
                    <div
                      key={ci}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center font-mono text-xs font-bold border border-white/15 shadow-sm"
                      style={{
                        backgroundColor: bg,
                        color: st === 0 ? "rgba(255,255,255,0.7)" : "#071018",
                        boxShadow:
                          st === 2 ? `0 0 14px ${c1}55` : undefined,
                      }}
                    >
                      {ch}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        );
      }

      case "connections": {
        const bands = [
          { color: "#FACC15", words: ["SUN", "DAY", "RAY", "ARC"] },
          { color: "#4ADE80", words: ["DOT", "BOX", "HEX", "KEY"] },
          { color: "#60A5FA", words: ["MAP", "PIN", "WAY", "SEA"] },
          { color: "#C084FC", words: ["MIX", "TAG", "CUE", "SET"] },
        ];
        return (
          <div className="w-44 flex flex-col gap-1.5 rotate-1">
            {bands.map((b, i) => (
              <div
                key={i}
                className="grid grid-cols-4 gap-1 px-1.5 py-1 rounded-md border border-white/10"
                style={{ backgroundColor: `${b.color}22` }}
              >
                {b.words.map((w) => (
                  <span
                    key={w}
                    className="text-[9px] font-mono font-bold text-center tracking-tight py-0.5 rounded bg-black/25"
                    style={{ color: b.color }}
                  >
                    {w}
                  </span>
                ))}
              </div>
            ))}
          </div>
        );
      }

      case "worldle":
        return (
          <svg viewBox="0 0 220 120" className="w-48 h-28 overflow-visible">
            <circle
              cx="105"
              cy="60"
              r="42"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeDasharray="3 4"
            />
            <ellipse
              cx="105"
              cy="60"
              rx="42"
              ry="16"
              fill="none"
              stroke="rgba(255,255,255,0.09)"
            />
            <path
              d="M78 46 L94 34 L112 38 L128 30 L138 44 L125 60 L132 76 L114 84 L96 78 L84 65 Z"
              fill={`${c1}35`}
              stroke={c1}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <g transform="translate(154, 34)">
              <circle cx="0" cy="0" r="14" fill="#121620" stroke={c2} strokeWidth="1.8" />
              <path d="M-4 4 L5 -5 M5 -5 L-1 -5 M5 -5 L5 1" stroke={c2} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text x="154" y="64" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="9" fontFamily="monospace" fontWeight="700">
              420 KM
            </text>
          </svg>
        );

      case "krillion":
        return (
          <svg viewBox="0 0 240 120" className="w-52 h-28">
            <defs>
              <linearGradient id="krill-depth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c1} stopOpacity="0.25" />
                <stop offset="100%" stopColor="#050816" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <rect x="24" y="14" width="140" height="92" rx="12" fill="url(#krill-depth)" stroke="rgba(255,255,255,0.12)" />
            {[28, 46, 64, 82, 98].map((y, idx) => (
              <g key={y}>
                <line x1="34" y1={y} x2="52" y2={y} stroke={idx === 4 ? c1 : "rgba(255,255,255,0.22)"} strokeWidth={idx === 4 ? "2" : "1"} />
                <text x="58" y={y + 3} fill={idx === 4 ? c1 : "rgba(255,255,255,0.4)"} fontSize="7.5" fontFamily="monospace">
                  {idx * 1750}m
                </text>
              </g>
            ))}
            <g transform="translate(120, 74)">
              <ellipse cx="0" cy="0" rx="18" ry="8" fill={c1} opacity="0.9" />
              <path d="M16 -2 L28 -8 L24 0 L28 8 L16 2 Z" fill={c2} />
              <path d="M-16 -2 C-26 -10 -32 -8 -36 -4 M-16 2 C-25 8 -31 8 -34 5" stroke={c1} strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <circle cx="-9" cy="-2" r="2" fill="#090B10" />
              <circle cx="0" cy="0" r="26" fill="none" stroke={c1} strokeOpacity="0.25" strokeDasharray="3 3" />
            </g>
            <text x="188" y="42" fill={c1} fontSize="12" fontFamily="monospace" fontWeight="700">
              7000m
            </text>
            <text x="188" y="55" fill="rgba(255,255,255,0.5)" fontSize="7.5" fontFamily="monospace">
              TRENCH
            </text>
          </svg>
        );

      case "strands":
        return (
          <svg viewBox="0 0 220 120" className="w-48 h-28">
            <path
              d="M42 30 L85 30 L125 60 L85 90 L135 90 L175 55"
              fill="none"
              stroke={c2}
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.35"
            />
            <path
              d="M42 30 L85 30 L125 60 L85 90 L135 90 L175 55"
              fill="none"
              stroke={c1}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {[
              [42, 30, "S"],
              [85, 30, "P"],
              [125, 60, "A"],
              [85, 90, "N"],
              [135, 90, "G"],
              [175, 55, "R"],
            ].map(([cx, cy, ch], i) => (
              <g key={i}>
                <circle
                  cx={Number(cx)}
                  cy={Number(cy)}
                  r="13"
                  fill={i === 2 ? c2 : "#141B29"}
                  stroke={i === 2 ? c2 : c1}
                  strokeWidth="2"
                />
                <text
                  x={Number(cx)}
                  y={Number(cy) + 4}
                  textAnchor="middle"
                  fill={i === 2 ? "#090B10" : "#F8FAFC"}
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="700"
                >
                  {ch}
                </text>
              </g>
            ))}
          </svg>
        );

      case "travle":
        return (
          <svg viewBox="0 0 230 120" className="w-48 h-28">
            <path d="M35 80 Q80 30 115 62 T195 38" fill="none" stroke={c1} strokeWidth="3" strokeDasharray="6 4" />
            {[
              { x: 35, y: 80, label: "FRA", fill: c1 },
              { x: 84, y: 50, label: "CHE", fill: "#1F2937" },
              { x: 132, y: 65, label: "AUT", fill: "#1F2937" },
              { x: 195, y: 38, label: "HUN", fill: c2 },
            ].map((node, i) => (
              <g key={i}>
                <polygon
                  points={`${node.x},${node.y - 16} ${node.x + 15},${node.y - 5} ${node.x + 10},${node.y + 14} ${node.x - 10},${node.y + 14} ${node.x - 15},${node.y - 5}`}
                  fill={node.fill}
                  stroke={i === 0 ? c1 : i === 3 ? c2 : "rgba(255,255,255,0.35)"}
                  strokeWidth="2"
                />
                <text x={node.x} y={node.y + 3} textAnchor="middle" fill="#F8FAFC" fontSize="8" fontFamily="monospace" fontWeight="700">
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        );

      case "globle":
        return (
          <svg viewBox="0 0 220 120" className="w-44 h-28">
            <circle cx="110" cy="60" r="44" fill="#131926" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
            <ellipse cx="110" cy="60" rx="22" ry="44" fill="none" stroke="rgba(255,255,255,0.08)" />
            <line x1="66" y1="60" x2="154" y2="60" stroke="rgba(255,255,255,0.08)" />
            <path d="M88 38 Q106 30 116 44 Q108 58 92 54 Z" fill={c2} opacity="0.85" />
            <path d="M114 58 Q132 52 138 68 Q126 82 110 74 Z" fill={c1} />
            <circle cx="124" cy="67" r="14" fill="none" stroke={c1} strokeOpacity="0.4" strokeWidth="2" />
            <rect x="164" y="26" width="10" height="68" rx="5" fill="url(#globle-heat)" stroke="rgba(255,255,255,0.15)" />
            <defs>
              <linearGradient id="globle-heat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c1} />
                <stop offset="50%" stopColor={c2} />
                <stop offset="100%" stopColor="#FDE047" />
              </linearGradient>
            </defs>
          </svg>
        );

      case "timeguessr":
        return (
          <div className="flex items-center gap-3 -rotate-2">
            <div className="w-24 h-20 rounded-lg bg-[#1A202E] border border-white/15 p-1.5 flex flex-col justify-between shadow-lg">
              <div className="h-12 rounded bg-gradient-to-br from-amber-500/30 via-stone-700/40 to-rose-500/30 flex items-center justify-center">
                <span className="font-mono text-xs font-bold text-amber-300">1969</span>
              </div>
              <div className="flex justify-between items-center text-[8px] font-mono text-white/50">
                <span>ARCHIVE</span>
                <span>IMG_04</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="px-2.5 py-1 rounded-md border border-white/15 bg-black/40 font-mono text-[10px]" style={{ color: c1 }}>
                51.5°N 0.1°W
              </div>
              <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="w-4/5 h-full rounded-full" style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }} />
              </div>
            </div>
          </div>
        );

      case "contexto": {
        const bars = [
          { word: "OCEAN", rank: "#1", w: "96%", color: c1 },
          { word: "WAVE", rank: "#14", w: "74%", color: c1 },
          { word: "CORAL", rank: "#88", w: "52%", color: c2 },
          { word: "CLOUD", rank: "#942", w: "24%", color: "#EF4444" },
        ];
        return (
          <div className="w-48 flex flex-col gap-1.5">
            {bars.map((b) => (
              <div key={b.word} className="relative h-6 rounded-md bg-white/[0.06] border border-white/10 overflow-hidden flex items-center justify-between px-2">
                <div className="absolute inset-y-0 left-0 opacity-30" style={{ width: b.w, backgroundColor: b.color }} />
                <span className="relative z-10 font-mono text-[10px] font-semibold text-white/90">{b.word}</span>
                <span className="relative z-10 font-mono text-[10px] font-bold" style={{ color: b.color }}>{b.rank}</span>
              </div>
            ))}
          </div>
        );
      }

      case "quordle":
        return (
          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((q) => (
              <div key={q} className="p-1.5 rounded-md bg-white/[0.05] border border-white/10 grid grid-cols-5 gap-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-[2px]"
                    style={{
                      backgroundColor:
                        i >= 5 && q < 2
                          ? c2
                          : i % 3 === 0
                          ? c1
                          : "rgba(255,255,255,0.12)",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        );

      case "framed":
        return (
          <div className="w-48 rounded-lg bg-[#111520] border border-white/15 p-2 flex flex-col gap-2 shadow-xl">
            <div className="flex justify-between px-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-2.5 h-1.5 rounded-[1px] bg-white/25" />
              ))}
            </div>
            <div
              className="h-14 rounded bg-gradient-to-tr flex items-center justify-center relative overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(135deg, ${c1}33, #0B0F19, ${c2}33)`,
              }}
            >
              <div className="w-8 h-8 rounded-full border-2 border-white/60 flex items-center justify-center">
                <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[9px] border-l-white ml-0.5" />
              </div>
            </div>
            <div className="flex justify-center gap-1.5">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-5 h-1.5 rounded-full"
                  style={{
                    backgroundColor:
                      i < 2 ? "#EF4444" : i === 2 ? c2 : "rgba(255,255,255,0.16)",
                  }}
                />
              ))}
            </div>
          </div>
        );

      case "bandle": {
        const heights = [28, 52, 76, 40, 88, 62, 34, 70, 48, 82, 42, 30];
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-end gap-1.5 h-16">
              {heights.map((h, i) => (
                <div
                  key={i}
                  className="w-2 rounded-full"
                  style={{
                    height: `${h}%`,
                    background: `linear-gradient(to top, ${c1}, ${c2})`,
                    opacity: i % 2 === 0 ? 0.95 : 0.65,
                  }}
                />
              ))}
            </div>
            <div className="flex gap-1.5">
              {["DRUMS", "BASS", "SYNTH", "VOX"].map((stem, i) => (
                <span
                  key={stem}
                  className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold border"
                  style={{
                    borderColor: i < 2 ? `${c1}80` : "rgba(255,255,255,0.12)",
                    color: i < 2 ? "#F8FAFC" : "rgba(255,255,255,0.4)",
                    backgroundColor: i < 2 ? `${c1}26` : "transparent",
                  }}
                >
                  {stem}
                </span>
              ))}
            </div>
          </div>
        );
      }

      case "waffle": {
        const grid = [
          ["W", "A", "F", "F", "L"],
          ["O", null, "R", null, "E"],
          ["R", "E", "A", "D", "S"],
          ["D", null, "M", null, "S"],
          ["S", "W", "A", "P", "S"],
        ];
        return (
          <div className="grid grid-cols-5 gap-1">
            {grid.flat().map((ch, idx) =>
              ch ? (
                <div
                  key={idx}
                  className="w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] font-bold border border-white/10"
                  style={{
                    backgroundColor:
                      idx % 4 === 0 ? c2 : idx % 3 === 0 ? c1 : "rgba(255,255,255,0.12)",
                    color: idx % 4 === 0 || idx % 3 === 0 ? "#090B10" : "#F8FAFC",
                  }}
                >
                  {ch}
                </div>
              ) : (
                <div key={idx} className="w-5 h-5" />
              )
            )}
          </div>
        );
      }

      case "nerdle": {
        const eq = ["1", "2", "+", "3", "4", "=", "4", "6"];
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
              {eq.map((ch, i) => (
                <div
                  key={i}
                  className="w-6 h-7 rounded flex items-center justify-center font-mono text-xs font-bold border border-white/15"
                  style={{
                    backgroundColor:
                      ch === "=" || ch === "+" ? c1 : i > 5 ? c2 : "rgba(255,255,255,0.08)",
                    color: ch === "=" || ch === "+" || i > 5 ? "#090B10" : "#F8FAFC",
                  }}
                >
                  {ch}
                </div>
              ))}
            </div>
            <div className="flex gap-1.5 font-mono text-[10px] text-white/50">
              <span>+</span>
              <span>−</span>
              <span>×</span>
              <span>÷</span>
              <span>=</span>
            </div>
          </div>
        );
      }

      case "geogrid":
        return (
          <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-white/[0.04] border border-white/10">
            {["BR", "JP", "NO", "CA", "EG", "NZ", "PE", "KR", "IS"].map((code, i) => (
              <div
                key={code}
                className="w-8 h-7 rounded-md flex items-center justify-center font-mono text-[10px] font-bold border"
                style={{
                  backgroundColor: i % 2 === 0 ? `${c1}26` : `${c2}22`,
                  borderColor: i % 2 === 0 ? `${c1}60` : `${c2}60`,
                  color: "#F8FAFC",
                }}
              >
                {code}
              </div>
            ))}
          </div>
        );

      case "pokedoku":
        return (
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 80 80" className="w-16 h-16">
              <circle cx="40" cy="40" r="32" fill="#181E2E" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <path d="M8 40 A32 32 0 0 1 72 40 Z" fill={c1} opacity="0.85" />
              <line x1="8" y1="40" x2="72" y2="40" stroke="#090B10" strokeWidth="5" />
              <circle cx="40" cy="40" r="10" fill="#F8FAFC" stroke="#090B10" strokeWidth="4" />
            </svg>
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-sm border border-white/15"
                  style={{ backgroundColor: i % 3 === 0 ? c2 : `${c1}40` }}
                />
              ))}
            </div>
          </div>
        );

      case "spelling-bee": {
        const hexes = [
          { x: 50, y: 18, ch: "A" },
          { x: 24, y: 33, ch: "R" },
          { x: 76, y: 33, ch: "T" },
          { x: 50, y: 48, ch: "E", center: true },
          { x: 24, y: 63, ch: "L" },
          { x: 76, y: 63, ch: "S" },
          { x: 50, y: 78, ch: "N" },
        ];
        return (
          <svg viewBox="0 0 100 96" className="w-28 h-24">
            {hexes.map((h, i) => (
              <g key={i} transform={`translate(${h.x}, ${h.y})`}>
                <polygon
                  points="0,-13 11,-6.5 11,6.5 0,13 -11,6.5 -11,-6.5"
                  fill={h.center ? c1 : "rgba(255,255,255,0.12)"}
                  stroke={h.center ? c1 : "rgba(255,255,255,0.22)"}
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill={h.center ? "#090B10" : "#F8FAFC"}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="700"
                >
                  {h.ch}
                </text>
              </g>
            ))}
          </svg>
        );
      }

      case "spotle":
        return (
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#111622] border-2 flex items-center justify-center relative" style={{ borderColor: c1 }}>
              <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c1 }} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 font-mono text-[9px] font-bold">POP</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/25 text-amber-300 font-mono text-[9px] font-bold">2018</span>
              </div>
              <div className="flex gap-1">
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/75 font-mono text-[9px]">SOLO</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 font-mono text-[9px] font-bold">US</span>
              </div>
            </div>
          </div>
        );

      case "semantle":
        return (
          <svg viewBox="0 0 220 110" className="w-48 h-24">
            <line x1="25" y1="88" x2="195" y2="88" stroke="rgba(255,255,255,0.18)" />
            <path d="M30 80 L70 64 L110 68 L145 40 L185 22" fill="none" stroke={c1} strokeWidth="2.5" />
            {[
              [30, 80, "14.2"],
              [70, 64, "31.8"],
              [110, 68, "28.5"],
              [145, 40, "64.1"],
              [185, 22, "99.9"],
            ].map(([x, y, val], i) => (
              <g key={i}>
                <circle cx={Number(x)} cy={Number(y)} r="5" fill={i === 4 ? c2 : c1} />
                <text x={Number(x)} y={Number(y) - 9} textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="8" fontFamily="monospace">
                  {val}
                </text>
              </g>
            ))}
          </svg>
        );

      case "cinematrix":
        return (
          <div className="flex flex-col items-center gap-1.5">
            <div className="grid grid-cols-3 gap-1.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-6 rounded border flex items-center justify-center font-mono text-[9px] font-bold"
                  style={{
                    borderColor: i % 2 === 0 ? `${c1}80` : `${c2}66`,
                    backgroundColor: i === 4 ? `${c1}40` : "rgba(255,255,255,0.06)",
                    color: i === 4 ? "#FFF" : "rgba(255,255,255,0.65)",
                  }}
                >
                  {i === 4 ? "★" : "94%"}
                </div>
              ))}
            </div>
          </div>
        );

      case "murdle":
        return (
          <div className="flex items-center gap-3">
            <div className="grid grid-cols-3 gap-1 p-1.5 rounded-lg bg-black/35 border border-white/15">
              {["✓", "×", "×", "×", "✓", "×", "×", "×", "✓"].map((sym, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-sm flex items-center justify-center font-mono text-xs font-bold"
                  style={{
                    backgroundColor: sym === "✓" ? `${c1}35` : "rgba(255,255,255,0.06)",
                    color: sym === "✓" ? "#FCA5A5" : "rgba(255,255,255,0.35)",
                  }}
                >
                  {sym}
                </div>
              ))}
            </div>
            <svg viewBox="0 0 50 50" className="w-12 h-12">
              <circle cx="21" cy="21" r="12" fill="none" stroke={c2} strokeWidth="2.5" />
              <line x1="30" y1="30" x2="43" y2="43" stroke={c2} strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </div>
        );

      case "redactle":
        return (
          <div className="w-48 p-2.5 rounded-lg bg-[#111520] border border-white/10 flex flex-col gap-1.5 font-mono text-[9px]">
            <div className="flex gap-1.5 items-center">
              <span className="px-1.5 py-0.5 rounded bg-white text-[#090B10] font-bold">EARTH</span>
              <span className="h-3 w-12 rounded-sm bg-white/25" />
              <span className="text-white/70">is the</span>
              <span className="h-3 w-10 rounded-sm bg-white/25" />
            </div>
            <div className="flex gap-1.5 items-center">
              <span className="h-3 w-16 rounded-sm bg-white/25" />
              <span className="text-white/70">of the</span>
              <span className="px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: `${c2}35`, color: c2 }}>SOLAR</span>
              <span className="h-3 w-8 rounded-sm bg-white/25" />
            </div>
            <div className="flex gap-1.5 items-center">
              <span className="h-3 w-10 rounded-sm bg-white/25" />
              <span className="h-3 w-20 rounded-sm bg-white/25" />
              <span className="h-3 w-9 rounded-sm bg-white/25" />
            </div>
          </div>
        );

      case "octordle":
        return (
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="p-1 rounded bg-white/[0.06] border border-white/10 grid grid-cols-5 gap-[2px]">
                {Array.from({ length: 10 }).map((_, j) => (
                  <div
                    key={j}
                    className="w-1.5 h-1.5 rounded-[1px]"
                    style={{
                      backgroundColor:
                        j >= 5 ? (idx % 2 === 0 ? c1 : c2) : "rgba(255,255,255,0.16)",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        );

      case "guessthegame":
        return (
          <div className="flex items-center gap-3">
            <div className="w-24 h-16 rounded-lg border border-white/15 bg-gradient-to-br from-violet-500/30 to-cyan-500/20 flex items-center justify-center relative">
              <svg viewBox="0 0 64 44" className="w-12 h-8">
                <rect x="6" y="10" width="52" height="24" rx="12" fill="#151B28" stroke={c2} strokeWidth="2" />
                <path d="M18 18 V26 M14 22 H22" stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="44" cy="19" r="2.2" fill={c1} />
                <circle cx="49" cy="24" r="2.2" fill={c2} />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="w-10 h-2 rounded-full" style={{ backgroundColor: n === 3 ? c2 : "rgba(255,255,255,0.14)" }} />
              ))}
            </div>
          </div>
        );

      case "flagdle":
        return (
          <div className="w-36 h-[88px] rounded-lg overflow-hidden border border-white/20 grid grid-cols-3 grid-rows-2 gap-0.5 bg-[#090B10] p-0.5">
            <div className="bg-blue-500/80 rounded-tl" />
            <div className="bg-white/10" />
            <div className="bg-red-500/80 rounded-tr" />
            <div className="bg-white/10 rounded-bl" />
            <div className="bg-amber-400/85" />
            <div className="bg-white/10 rounded-br" />
          </div>
        );

      case "tradle": {
        const blocks = [
          { w: "58%", h: "44px", color: c1, label: "CHIPS" },
          { w: "40%", h: "44px", color: c2, label: "CARS" },
          { w: "48%", h: "30px", color: "#F59E0B", label: "OIL" },
          { w: "50%", h: "30px", color: "#8B5CF6", label: "MED" },
        ];
        return (
          <div className="w-44 flex flex-wrap gap-1 p-1.5 rounded-lg bg-black/30 border border-white/10">
            {blocks.map((b) => (
              <div
                key={b.label}
                className="rounded flex items-center justify-center font-mono text-[9px] font-bold text-[#090B10]"
                style={{ width: b.w, height: b.h, backgroundColor: b.color }}
              >
                {b.label}
              </div>
            ))}
          </div>
        );
      }

      case "box-office-game":
        return (
          <div className="w-44 flex flex-col gap-1.5 p-2 rounded-lg bg-[#141824] border border-white/15">
            {[
              { rank: "#1", rev: "$84.2M", w: "92%" },
              { rank: "#2", rev: "$41.0M", w: "64%" },
              { rank: "#3", rev: "$22.8M", w: "44%" },
            ].map((item, i) => (
              <div key={item.rank} className="flex items-center gap-2 font-mono text-[9px]">
                <span style={{ color: i === 0 ? c1 : "rgba(255,255,255,0.55)" }} className="font-bold">
                  {item.rank}
                </span>
                <div className="flex-1 h-3 rounded bg-white/10 overflow-hidden">
                  <div className="h-full rounded" style={{ width: item.w, backgroundColor: i === 0 ? c1 : c2 }} />
                </div>
                <span className="text-white/80">{item.rev}</span>
              </div>
            ))}
          </div>
        );

      case "chronophoto":
        return (
          <div className="flex flex-col items-center gap-2.5">
            <div className="px-3 py-1 rounded-full bg-white/10 border border-white/15 font-mono text-xs font-bold tracking-wider" style={{ color: c1 }}>
              1900 ───●─── 2026
            </div>
            <div className="flex gap-1.5">
              {["1924", "1958", "1991"].map((yr, i) => (
                <span
                  key={yr}
                  className="px-2 py-0.5 rounded font-mono text-[10px] border"
                  style={{
                    borderColor: i === 1 ? c2 : "rgba(255,255,255,0.14)",
                    color: i === 1 ? c2 : "rgba(255,255,255,0.55)",
                  }}
                >
                  {yr}
                </span>
              ))}
            </div>
          </div>
        );

      case "wheretaken":
        return (
          <svg viewBox="0 0 220 110" className="w-44 h-24">
            <rect x="28" y="14" width="164" height="82" rx="10" fill="#131926" stroke="rgba(255,255,255,0.14)" />
            <path d="M40 82 L76 46 L104 68 L138 38 L178 82 Z" fill={`${c1}35`} stroke={c1} strokeWidth="2" />
            <circle cx="138" cy="38" r="10" fill={c2} opacity="0.25" />
            <path d="M138 22 C132 22 128 26 128 32 C128 40 138 50 138 50 C138 50 148 40 148 32 C148 26 144 22 138 22 Z" fill={c2} />
            <circle cx="138" cy="32" r="3" fill="#090B10" />
          </svg>
        );

      case "catfishing":
        return (
          <div className="w-48 flex flex-wrap justify-center gap-1.5">
            {["1990s films", "Time travel", "Cult classics", "Soundtracks", "█████"].map((tag, i) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-full font-mono text-[9px] border"
                style={{
                  borderColor: i % 2 === 0 ? `${c1}70` : `${c2}70`,
                  backgroundColor: i % 2 === 0 ? `${c1}20` : `${c2}20`,
                  color: "#F8FAFC",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        );

      case "costcodle":
        return (
          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded-lg bg-[#141824] border-2 border-dashed flex flex-col items-center" style={{ borderColor: c1 }}>
              <span className="font-mono text-[8px] text-white/50">BULK ITEM #42</span>
              <span className="font-mono text-lg font-bold text-white">$19.99</span>
            </div>
            <div className="flex flex-col gap-1 font-mono text-[10px]">
              <span className="text-emerald-400">▲ HIGHER</span>
              <span className="text-rose-400">▼ LOWER</span>
            </div>
          </div>
        );

      case "squaredle": {
        const letters = ["S", "Q", "U", "A", "R", "E", "D", "L", "E", "G", "R", "I", "D", "W", "O", "R"];
        return (
          <div className="relative grid grid-cols-4 gap-1 p-1.5 rounded-lg bg-white/[0.04] border border-white/10">
            {letters.map((ch, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded flex items-center justify-center font-mono text-[9px] font-bold"
                style={{
                  backgroundColor: i < 6 ? `${c1}40` : "rgba(255,255,255,0.08)",
                  color: i < 6 ? c2 : "rgba(255,255,255,0.7)",
                }}
              >
                {ch}
              </div>
            ))}
          </div>
        );
      }

      case "clues-by-sam":
        return (
          <div className="grid grid-cols-4 gap-1.5">
            {["AL", "BO", "CY", "DI", "ED", "FA", "GU", "HA"].map((n, i) => (
              <div
                key={n}
                className="w-8 h-9 rounded-md border flex flex-col items-center justify-center font-mono text-[8px]"
                style={{
                  borderColor: i % 3 === 0 ? c1 : "rgba(255,255,255,0.16)",
                  backgroundColor: i % 3 === 0 ? `${c1}24` : "rgba(255,255,255,0.06)",
                }}
              >
                <span className="font-bold text-white/90">{n}</span>
                <span style={{ color: i % 3 === 0 ? c1 : c2 }}>{i % 3 === 0 ? "INNO" : "SUS"}</span>
              </div>
            ))}
          </div>
        );

      case "metazooa":
        return (
          <svg viewBox="0 0 220 110" className="w-48 h-24">
            <path d="M110 20 V44 M110 44 L65 62 M110 44 L155 62 M65 62 L45 86 M65 62 L85 86 M155 62 L135 86 M155 62 L175 86" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
            {[
              [110, 20, "CHORDATA", c1],
              [65, 62, "MAMMAL", c1],
              [155, 62, "AVES", "rgba(255,255,255,0.2)"],
              [85, 86, "FELID", c2],
            ].map(([x, y, label, col], i) => (
              <g key={i}>
                <rect x={Number(x) - 24} y={Number(y) - 9} width="48" height="18" rx="9" fill="#131926" stroke={String(col)} strokeWidth="1.8" />
                <text x={Number(x)} y={Number(y) + 3} textAnchor="middle" fill="#F8FAFC" fontSize="6.5" fontFamily="monospace" fontWeight="700">
                  {label}
                </text>
              </g>
            ))}
          </svg>
        );

      case "actorle":
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1.5">
              {["2008", "2014", "2019"].map((yr, i) => (
                <div key={yr} className="px-2 py-1 rounded bg-white/[0.08] border border-white/15 font-mono text-[10px]">
                  <span style={{ color: i === 1 ? c1 : c2 }}>{yr}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="w-4 h-1 rounded-full" style={{ backgroundColor: i < 4 ? c1 : "rgba(255,255,255,0.2)" }} />
              ))}
            </div>
          </div>
        );

      case "betweenle":
        return (
          <div className="w-48 flex flex-col items-center gap-2">
            <div className="w-full flex justify-between font-mono text-xs font-bold">
              <span style={{ color: c1 }}>DREAM</span>
              <span className="text-white/40">⇄</span>
              <span style={{ color: c2 }}>FLAME</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/10 p-0.5">
              <div className="h-full w-1/3 mx-auto rounded-full" style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }} />
            </div>
            <span className="font-mono text-[9px] text-white/60">EXACTLY IN BETWEEN</span>
          </div>
        );

      case "colorfle":
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl border-2 border-white/30 shadow-lg" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }} />
            <div className="flex flex-col gap-1.5 w-24">
              {[
                { col: c1, w: "62%" },
                { col: "#FACC15", w: "25%" },
                { col: c2, w: "45%" },
              ].map((bar, i) => (
                <div key={i} className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: bar.w, backgroundColor: bar.col }} />
                </div>
              ))}
            </div>
          </div>
        );

      case "hexcodle": {
        const chars = ["#", "F", "4", "7", "2", "B", "6"];
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
              {chars.map((ch, i) => (
                <div
                  key={i}
                  className="w-6 h-7 rounded flex items-center justify-center font-mono text-xs font-bold border border-white/15"
                  style={{
                    backgroundColor: i === 0 ? "transparent" : i % 2 === 1 ? `${c1}40` : `${c2}35`,
                    color: "#F8FAFC",
                  }}
                >
                  {ch}
                </div>
              ))}
            </div>
            <div className="w-36 h-2 rounded-full" style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }} />
          </div>
        );
      }

      case "minute-cryptic":
        return (
          <div className="w-48 p-2.5 rounded-lg bg-[#141824] border border-white/15 flex flex-col gap-1.5">
            <div className="font-mono text-[9px] text-white/75 leading-relaxed">
              Mix <span style={{ color: c1 }} className="underline">daily</span> loop (5)
            </div>
            <div className="flex gap-1">
              {["?", "?", "?", "?", "?"].map((ch, i) => (
                <div key={i} className="w-6 h-6 rounded bg-white/[0.08] border border-white/15 flex items-center justify-center font-mono text-[10px] font-bold" style={{ color: i === 0 ? c2 : "#F8FAFC" }}>
                  {ch}
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#10141E]">
      <GlowBackdrop c1={c1} c2={c2} variant={type.length} />
      <div className="relative z-10 h-full w-full flex items-center justify-center pb-8 pt-4 px-4 transition-transform duration-500 ease-out group-hover:scale-[1.03]">
        {renderMotif()}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#090B10] via-[#090B10]/85 to-transparent z-10" />
    </div>
  );
}
