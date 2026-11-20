"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Infinity as InfinityIcon,
  Info,
  Loader2,
  Sun,
  X,
} from "lucide-react";
import type { DailyGame } from "@/data/games";

interface GameTheaterProps {
  game: DailyGame;
  mode: "daily" | "unlimited";
  isPlayed: boolean;
  onClose: () => void;
  onSwitchMode: (mode: "daily" | "unlimited") => void;
  onTogglePlayed: (id: string) => void;
  onOpenExternal: (url: string) => void;
}

export function GameTheater({
  game,
  mode,
  isPlayed,
  onClose,
  onSwitchMode,
  onTogglePlayed,
  onOpenExternal,
}: GameTheaterProps) {
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(true);

  const activeUrl =
    mode === "unlimited" && game.unlimitedUrl
      ? game.unlimitedUrl
      : game.dailyUrl;

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 4000);
    return () => window.clearTimeout(timer);
  }, [activeUrl]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleModeClick = (nextMode: "daily" | "unlimited") => {
    if (nextMode === mode) return;
    if (nextMode === "unlimited") {
      if (!game.unlimitedUrl) return;
      if (!game.unlimitedCanEmbed) {
        onOpenExternal(game.unlimitedUrl);
        return;
      }
    } else if (!game.dailyCanEmbed) {
      onOpenExternal(game.dailyUrl);
      return;
    }
    onSwitchMode(nextMode);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${game.name} Game Theater`}
      className="fixed inset-0 z-[100] flex flex-col bg-[#090B10]"
    >
      {/* Slim 48px Dark HUD Bar */}
      <div className="relative z-20 flex h-12 shrink-0 items-center justify-between gap-2 border-b border-white/[0.08] bg-[#0D1018] px-3 sm:px-4">
        {/* Left: Back to Dayloop */}
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-white/85 hover:bg-white/[0.1] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Back to Dayloop</span>
          <span className="sm:hidden">Back</span>
        </button>

        {/* Center: Game Title + Daily / Unlimited Switcher */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-display text-sm font-bold text-white truncate max-w-[110px] sm:max-w-[200px]">
            {game.name}
          </span>

          <div className="inline-flex items-center rounded-lg border border-white/10 bg-[#090B10] p-0.5">
            <button
              type="button"
              onClick={() => handleModeClick("daily")}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors ${
                mode === "daily"
                  ? "bg-white/15 text-white"
                  : "text-white/55 hover:text-white"
              }`}
            >
              <Sun className="w-3 h-3 text-amber-300" />
              <span>Daily</span>
              {!game.dailyCanEmbed && <ExternalLink className="w-2.5 h-2.5" />}
            </button>

            <button
              type="button"
              disabled={!game.unlimitedUrl}
              onClick={() => handleModeClick("unlimited")}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors ${
                !game.unlimitedUrl
                  ? "text-white/25 cursor-not-allowed"
                  : mode === "unlimited"
                  ? "bg-white/15 text-white"
                  : "text-white/55 hover:text-white"
              }`}
            >
              <InfinityIcon className="w-3 h-3 text-sky-400" />
              <span>Unlimited</span>
              {game.unlimitedUrl && !game.unlimitedCanEmbed && (
                <ExternalLink className="w-2.5 h-2.5" />
              )}
            </button>
          </div>
        </div>

        {/* Right: Mark Played Today + Open in New Tab fallback */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            aria-pressed={isPlayed}
            onClick={() => onTogglePlayed(game.id)}
            className={`relative z-30 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              isPlayed
                ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-300"
                : "border-white/10 bg-white/[0.04] text-white/75 hover:border-emerald-400/40 hover:text-emerald-200"
            }`}
          >
            <Check className="pointer-events-none w-3.5 h-3.5" />
            <span className="pointer-events-none hidden md:inline">
              {isPlayed ? "Played Today" : "Mark Played Today"}
            </span>
          </button>

          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-white/80 hover:bg-white/[0.1] hover:text-white transition-colors"
          >
            <span className="hidden sm:inline">Open in New Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Gentle dismissible framing/cookie fallback hint */}
      {showHint && (
        <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] bg-[#121622] px-4 py-1.5 text-[11px] text-white/60">
          <div className="flex items-center gap-2 min-w-0">
            <Info className="w-3.5 h-3.5 shrink-0 text-sky-400" />
            <span className="truncate">
              Playing inside Dayloop Theater. If a site blocks third-party cookies or framing, use{" "}
              <a
                href={activeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-sky-300 hover:text-sky-200"
              >
                Open in New Tab ↗
              </a>
              .
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowHint(false)}
            aria-label="Dismiss hint"
            className="rounded p-0.5 text-white/45 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Iframe Container */}
      <div className="relative flex-1 bg-[#090B10]">
        {loading && (
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 bg-[#090B10]">
            <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
            <span className="font-mono text-xs text-white/55">
              Loading {game.name}...
            </span>
          </div>
        )}
        <iframe
          key={activeUrl}
          src={activeUrl}
          title={`${game.name} (${mode})`}
          onLoad={() => setLoading(false)}
          className="h-full w-full border-0 bg-white"
          allow="clipboard-write; fullscreen; autoplay"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
