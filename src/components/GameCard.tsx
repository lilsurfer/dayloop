"use client";

import React from "react";
import {
  Sun,
  Infinity as InfinityIcon,
  ExternalLink,
  Check,
  Star,
  X,
  Lock,
} from "lucide-react";
import type { DailyGame } from "@/data/games";
import type { LaunchMode } from "@/hooks/useDayloopState";
import { GameArtwork } from "./GameArtwork";

interface GameCardProps {
  game: DailyGame;
  isPlayed: boolean;
  isPinned: boolean;
  launchMode: LaunchMode;
  isExpanded: boolean;
  isHighlighted: boolean;
  onExpandToggle: (id: string | null) => void;
  onLaunch: (game: DailyGame, mode: "daily" | "unlimited") => void;
  onTogglePlayed: (id: string) => void;
  onTogglePinned: (id: string) => void;
}

export function GameCard({
  game,
  isPlayed,
  isPinned,
  launchMode,
  isExpanded,
  isHighlighted,
  onExpandToggle,
  onLaunch,
  onTogglePlayed,
  onTogglePinned,
}: GameCardProps) {
  const [c1, c2] = game.accentColors;

  const dailyOpensExternal =
    launchMode === "new-tab" || !game.dailyCanEmbed;
  const unlimitedOpensExternal =
    game.unlimitedUrl !== null &&
    (launchMode === "new-tab" || !game.unlimitedCanEmbed);

  const unlimitedSublabel =
    game.unlimitedModeType === "built-in"
      ? "In-Game"
      : game.unlimitedModeType === "archive"
      ? "Archive"
      : null;

  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button, a")) return;
    onExpandToggle(isExpanded ? null : game.id);
  };

  return (
    <article
      id={`game-card-${game.id}`}
      onClick={handleCardClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target === e.currentTarget) {
          onExpandToggle(isExpanded ? null : game.id);
        }
      }}
      style={
        {
          "--accent-1": c1,
          "--accent-2": c2,
        } as React.CSSProperties
      }
      className={`group relative aspect-[16/10] w-full overflow-hidden rounded-2xl border bg-[#121620] transition-all duration-300 ease-out select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80 ${
        isHighlighted
          ? "animate-dayloop-spotlight border-sky-400/80 z-20"
          : isExpanded
          ? "border-white/25 shadow-2xl shadow-black/60 -translate-y-0.5"
          : "border-white/[0.08] hover:border-white/[0.22] hover:-translate-y-1 hover:shadow-[0_14px_40px_-14px_rgba(0,0,0,0.85)]"
      }`}
    >
      {/* Bespoke Per-Game Artwork */}
      <GameArtwork type={game.artworkType} accentColors={game.accentColors} />

      {/* Subtle accent top highlight bar on hover */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }}
      />

      {/* Idle Top Badges */}
      <div className="pointer-events-none absolute inset-x-3.5 top-3 z-20 flex items-center justify-between">
        <div>
          {game.isNiche && (
            <span className="inline-flex items-center rounded-full border border-amber-400/35 bg-amber-400/15 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-amber-200 backdrop-blur-sm">
              NICHE
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {isPinned && (
            <span
              title="Pinned favorite"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-amber-400/35 bg-[#090B10]/75 text-amber-400 backdrop-blur-sm"
            >
              <Star className="w-3 h-3 fill-amber-400" />
            </span>
          )}
          {isPlayed && (
            <span
              title="Played today"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400/45 bg-emerald-500/20 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.4)] backdrop-blur-sm"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
          )}
        </div>
      </div>

      {/* Idle Bottom Title & Tagline */}
      <div
        className={`pointer-events-none absolute inset-x-4 bottom-3.5 z-20 transition-opacity duration-200 ${
          isExpanded ? "opacity-0" : "group-hover:opacity-0 group-focus-within:opacity-0"
        }`}
      >
        <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-sm">
          {game.name}
        </h2>
        <p className="mt-0.5 text-xs font-medium text-white/70 line-clamp-1">
          {game.tagline}
        </p>
      </div>

      {/* Hover / Tap Glassmorphic Split Launcher Overlay */}
      <div
        className={`absolute inset-0 z-30 flex flex-col justify-between bg-[#090C14]/85 p-3.5 sm:p-4 backdrop-blur-md transition-all duration-200 ${
          isExpanded
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto"
        }`}
      >
        {/* Top micro-bar: Name + Pin + Played + Mobile Close */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-display text-base sm:text-lg font-bold text-white truncate">
                {game.name}
              </h3>
              {game.isNiche && (
                <span className="rounded border border-amber-400/30 bg-amber-400/15 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-amber-200">
                  NICHE
                </span>
              )}
            </div>
            <p className="text-[11px] text-white/55 truncate">
              {game.category}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePinned(game.id);
              }}
              title={isPinned ? "Unpin favorite" : "Pin to favorites"}
              aria-label={isPinned ? `Unpin ${game.name}` : `Pin ${game.name}`}
              className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                isPinned
                  ? "border-amber-400/45 bg-amber-400/20 text-amber-300"
                  : "border-white/10 bg-white/[0.05] text-white/60 hover:border-white/25 hover:text-amber-300"
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isPinned ? "fill-amber-300" : ""}`} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePlayed(game.id);
              }}
              title={isPlayed ? "Unmark played today" : "Mark played today"}
              aria-label={
                isPlayed
                  ? `Unmark ${game.name} played today`
                  : `Mark ${game.name} played today`
              }
              className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                isPlayed
                  ? "border-emerald-400/50 bg-emerald-500/25 text-emerald-300"
                  : "border-white/10 bg-white/[0.05] text-white/60 hover:border-emerald-400/40 hover:text-emerald-300"
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[2.4]" />
            </button>

            {isExpanded && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onExpandToggle(null);
                }}
                aria-label="Close card options"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-white/70 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom 2 Tactile Split Launch Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Daily Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLaunch(game, "daily");
            }}
            style={{
              backgroundImage: `linear-gradient(135deg, ${c1}38, ${c1}18)`,
              borderColor: `${c1}66`,
            }}
            className="group/btn relative flex flex-col items-center justify-center gap-1 rounded-xl border px-3 py-3 text-white shadow-sm transition-all duration-200 hover:brightness-125 active:scale-[0.97]"
          >
            <div className="flex items-center gap-1.5">
              <Sun className="w-4 h-4" style={{ color: c1 }} />
              <span className="font-display text-sm font-bold tracking-tight">
                Daily
              </span>
              {dailyOpensExternal && (
                <ExternalLink
                  className="w-3 h-3 text-white/65"
                  aria-label="Opens in new tab"
                />
              )}
            </div>
            <span className="text-[10px] font-medium text-white/60">
              {dailyOpensExternal ? "New tab" : "Play here"}
            </span>
          </button>

          {/* Unlimited Button (or Daily Only disabled state) */}
          {game.unlimitedUrl ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLaunch(game, "unlimited");
              }}
              style={{
                backgroundImage: `linear-gradient(135deg, ${c2}34, ${c2}14)`,
                borderColor: `${c2}60`,
              }}
              className="group/btn relative flex flex-col items-center justify-center gap-1 rounded-xl border px-3 py-3 text-white shadow-sm transition-all duration-200 hover:brightness-125 active:scale-[0.97]"
            >
              <div className="flex items-center gap-1.5">
                <InfinityIcon className="w-4 h-4" style={{ color: c2 }} />
                <span className="font-display text-sm font-bold tracking-tight">
                  Unlimited
                </span>
                {unlimitedOpensExternal && (
                  <ExternalLink
                    className="w-3 h-3 text-white/65"
                    aria-label="Opens in new tab"
                  />
                )}
              </div>
              <span className="text-[10px] font-medium text-white/60">
                {unlimitedSublabel
                  ? `${unlimitedSublabel}${unlimitedOpensExternal ? " · Tab" : ""}`
                  : unlimitedOpensExternal
                  ? "New tab"
                  : "Play here"}
              </span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="flex flex-col items-center justify-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-3 text-white/40 cursor-not-allowed"
            >
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-white/35" />
                <span className="font-display text-sm font-semibold tracking-tight">
                  Daily Only
                </span>
              </div>
              <span className="text-[10px] text-white/35">
                1 puzzle / day
              </span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
