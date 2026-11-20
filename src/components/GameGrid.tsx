"use client";

import React, { useState } from "react";
import { RotateCcw, SearchX } from "lucide-react";
import type { DailyGame } from "@/data/games";
import type { LaunchMode } from "@/hooks/useDayloopState";
import { GameCard } from "./GameCard";

interface GameGridProps {
  games: DailyGame[];
  playedIds: string[];
  pinnedIds: string[];
  launchMode: LaunchMode;
  highlightedId: string | null;
  onLaunch: (game: DailyGame, mode: "daily" | "unlimited") => void;
  onTogglePlayed: (id: string) => void;
  onTogglePinned: (id: string) => void;
  onResetFilters: () => void;
}

export function GameGrid({
  games,
  playedIds,
  pinnedIds,
  launchMode,
  highlightedId,
  onLaunch,
  onTogglePlayed,
  onTogglePinned,
  onResetFilters,
}: GameGridProps) {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  if (games.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-[#121620]/60 py-16 px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/50">
            <SearchX className="w-6 h-6" />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold text-white">
            No matching games found
          </h2>
          <p className="mt-1.5 max-w-sm text-sm text-white/55">
            Try clearing your search, switching categories, or showing played games.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-sky-500/15 px-4 py-2 text-xs font-semibold text-sky-200 hover:bg-sky-500/25 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            isPlayed={playedIds.includes(game.id)}
            isPinned={pinnedIds.includes(game.id)}
            launchMode={launchMode}
            isExpanded={expandedCardId === game.id}
            isHighlighted={highlightedId === game.id}
            onExpandToggle={setExpandedCardId}
            onLaunch={onLaunch}
            onTogglePlayed={onTogglePlayed}
            onTogglePinned={onTogglePinned}
          />
        ))}
      </div>
    </section>
  );
}
