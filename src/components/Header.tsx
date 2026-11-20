"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  LayoutGrid,
  Search,
  X,
  Star,
  Dices,
  MonitorPlay,
  ExternalLink,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import type { CategoryFilter, DailyGame } from "@/data/games";
import type { LaunchMode } from "@/hooks/useDayloopState";
import { CategoryMenu } from "./CategoryMenu";

interface HeaderProps {
  games: DailyGame[];
  visibleCount: number;
  activeCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  categoryMenuOpen: boolean;
  setCategoryMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchOpen: boolean;
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  pinnedOnly: boolean;
  onTogglePinnedOnly: () => void;
  pinnedCount: number;
  playedCount: number;
  timeUntilMidnight: string;
  onResetToday: () => void;
  launchMode: LaunchMode;
  onChangeLaunchMode: (mode: LaunchMode) => void;
  floatPinned: boolean;
  onToggleFloatPinned: (v: boolean) => void;
  hidePlayed: boolean;
  onToggleHidePlayed: (v: boolean) => void;
  onSurpriseMe: () => void;
  onResetAllFilters: () => void;
}

export function DayloopLogoMark({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dayloop-logo-grad" x1="10" y1="18" x2="54" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="16"
        fill="#111622"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="2"
      />
      <path
        d="M22.5 42C16.7 42 12 37.5 12 32C12 26.5 16.7 22 22.5 22C28.8 22 33.2 28 35.5 32C37.8 36 42.2 42 48.5 42C51.2 42 52 39.8 52 32C52 24.2 47.3 22 41.5 22C37.2 22 34.4 24.5 32.5 27.5"
        stroke="url(#dayloop-logo-grad)"
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22.5" cy="32" r="4.5" fill="#FACC15" />
      <circle cx="43.5" cy="32" r="3" fill="#22C55E" />
    </svg>
  );
}

export function Header({
  games,
  visibleCount,
  activeCategory,
  onSelectCategory,
  categoryMenuOpen,
  setCategoryMenuOpen,
  searchQuery,
  onSearchChange,
  searchOpen,
  setSearchOpen,
  searchInputRef,
  pinnedOnly,
  onTogglePinnedOnly,
  pinnedCount,
  playedCount,
  timeUntilMidnight,
  onResetToday,
  launchMode,
  onChangeLaunchMode,
  floatPinned,
  onToggleFloatPinned,
  hidePlayed,
  onToggleHidePlayed,
  onSurpriseMe,
  onResetAllFilters,
}: HeaderProps) {
  const categoryBtnRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [progressOpen, setProgressOpen] = useState(false);

  useEffect(() => {
    if (!progressOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (progressRef.current && !progressRef.current.contains(e.target as Node)) {
        setProgressOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [progressOpen]);

  const hasActiveFilters =
    activeCategory !== "All" ||
    searchQuery.trim().length > 0 ||
    pinnedOnly ||
    hidePlayed;

  const progressPct = games.length > 0 ? Math.round((playedCount / games.length) * 100) : 0;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#090B10]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
          {/* Brand compact mark */}
          <button
            type="button"
            onClick={() => {
              onResetAllFilters();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="Dayloop Home"
          >
            <DayloopLogoMark className="w-7 h-7 transition-transform duration-300 group-hover:scale-105" />
            <span className="font-display text-sm font-bold tracking-[0.16em] text-white/90 group-hover:text-white transition-colors hidden sm:inline">
              DAYLOOP
            </span>
          </button>

          {/* Right compact icon-first utility cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Expandable Search */}
            <div className="relative flex items-center">
              {searchOpen ? (
                <div className="flex items-center rounded-xl border border-white/15 bg-[#121620] px-2.5 py-1.5 focus-within:border-sky-400/60 transition-all">
                  <Search className="w-3.5 h-3.5 text-white/45 mr-2 shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={`Search ${games.length} games...`}
                    aria-label="Search daily games"
                    className="w-32 sm:w-44 bg-transparent text-xs text-white placeholder:text-white/40 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onSearchChange("");
                      setSearchOpen(false);
                    }}
                    aria-label="Close search"
                    className="ml-1 rounded-md p-0.5 text-white/45 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(true);
                    setTimeout(() => searchInputRef.current?.focus(), 20);
                  }}
                  title="Search games (/)"
                  aria-label="Search games"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#121620]/80 text-white/70 hover:border-white/20 hover:text-white transition-all"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Icon + Popover */}
            <div className="relative">
              <button
                ref={categoryBtnRef}
                type="button"
                onClick={() => setCategoryMenuOpen((v) => !v)}
                title="Filter by category"
                aria-label="Filter by category"
                aria-expanded={categoryMenuOpen}
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                  categoryMenuOpen || activeCategory !== "All"
                    ? "border-sky-400/50 bg-sky-500/15 text-sky-200"
                    : "border-white/[0.08] bg-[#121620]/80 text-white/70 hover:border-white/20 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                {(activeCategory !== "All" || hidePlayed) && (
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-sky-400" />
                )}
              </button>

              <CategoryMenu
                open={categoryMenuOpen}
                onClose={() => setCategoryMenuOpen(false)}
                activeCategory={activeCategory}
                onSelectCategory={onSelectCategory}
                games={games}
                floatPinned={floatPinned}
                onToggleFloatPinned={onToggleFloatPinned}
                hidePlayed={hidePlayed}
                onToggleHidePlayed={onToggleHidePlayed}
                anchorRef={categoryBtnRef}
              />
            </div>

            {/* Pinned Favorites Toggle */}
            <button
              type="button"
              onClick={onTogglePinnedOnly}
              title={pinnedOnly ? "Showing pinned favorites" : "Filter to pinned favorites"}
              aria-label="Filter pinned favorites"
              aria-pressed={pinnedOnly}
              className={`relative flex h-9 items-center justify-center gap-1 rounded-xl border px-2.5 transition-all ${
                pinnedOnly
                  ? "border-amber-400/50 bg-amber-400/15 text-amber-200"
                  : "border-white/[0.08] bg-[#121620]/80 text-white/70 hover:border-white/20 hover:text-white"
              }`}
            >
              <Star className={`w-4 h-4 ${pinnedOnly || pinnedCount > 0 ? "text-amber-400" : ""} ${pinnedOnly ? "fill-amber-400" : ""}`} />
              {pinnedCount > 0 && (
                <span className="font-mono text-[11px] font-semibold">
                  {pinnedCount}
                </span>
              )}
            </button>

            {/* Surprise Me */}
            <button
              type="button"
              onClick={onSurpriseMe}
              title="Surprise Me — pick a random unplayed game"
              aria-label="Surprise Me"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#121620]/80 text-white/70 hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all active:scale-95"
            >
              <Dices className="w-4 h-4" />
            </button>

            {/* Launch Mode Toggle */}
            <button
              type="button"
              onClick={() =>
                onChangeLaunchMode(
                  launchMode === "smart-embed" ? "new-tab" : "smart-embed"
                )
              }
              title={
                launchMode === "smart-embed"
                  ? "Launch Mode: Smart Embed (click for Always New Tab)"
                  : "Launch Mode: Always New Tab (click for Smart Embed)"
              }
              aria-label="Toggle launch mode"
              className={`flex h-9 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-medium transition-all ${
                launchMode === "smart-embed"
                  ? "border-white/[0.08] bg-[#121620]/80 text-white/80 hover:border-sky-400/40 hover:text-sky-200"
                  : "border-violet-400/45 bg-violet-500/15 text-violet-200"
              }`}
            >
              {launchMode === "smart-embed" ? (
                <>
                  <MonitorPlay className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden md:inline">Smart Embed</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-3.5 h-3.5 text-violet-300" />
                  <span className="hidden md:inline">New Tab</span>
                </>
              )}
            </button>

            {/* Played Today Counter */}
            <div ref={progressRef} className="relative">
              <button
                type="button"
                onClick={() => setProgressOpen((v) => !v)}
                title="Daily progress — resets at local midnight"
                aria-label={`Played ${playedCount} of ${games.length} today`}
                className="relative flex h-9 items-center gap-1.5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#121620]/90 px-2.5 font-mono text-xs text-white/85 hover:border-emerald-400/35 transition-all"
              >
                <span
                  className="pointer-events-none absolute inset-y-0 left-0 bg-emerald-500/15 transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
                <CheckCircle2 className="relative z-10 w-3.5 h-3.5 text-emerald-400" />
                <span className="relative z-10 font-semibold">
                  {playedCount}
                  <span className="text-white/40">/{games.length}</span>
                </span>
              </button>

              {progressOpen && (
                <div className="absolute right-0 top-12 z-50 w-60 rounded-2xl border border-white/10 bg-[#10141F]/95 p-3.5 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">
                      Today&apos;s Loop
                    </span>
                    <span className="font-mono text-xs text-emerald-400 font-semibold">
                      {progressPct}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="mt-2.5 text-[11px] text-white/55">
                    Auto-resets at local midnight in{" "}
                    <span className="font-mono text-white/85">
                      {timeUntilMidnight}
                    </span>
                  </p>
                  {playedCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        onResetToday();
                        setProgressOpen(false);
                      }}
                      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] py-1.5 text-[11px] font-medium text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset Today&apos;s Checklist
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Centered Neal.fun-inspired Hero Wordmark */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 pb-8 sm:pt-14 sm:pb-10 text-center">
        <div className="inline-flex flex-col items-center">
          <div className="flex items-center justify-center gap-3.5 sm:gap-4">
            <DayloopLogoMark className="w-11 h-11 sm:w-14 sm:h-14 drop-shadow-[0_0_24px_rgba(56,189,248,0.3)]" />
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent">
              DAYLOOP
            </h1>
          </div>
          <p className="mt-3.5 max-w-xl text-sm sm:text-base text-white/60 font-medium tracking-[-0.01em]">
            Every daily game. And the endless versions when one isn&apos;t enough.
          </p>
        </div>

        {/* Active filter chips (only shown when filtered) */}
        {hasActiveFilters && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {activeCategory !== "All" && (
              <button
                type="button"
                onClick={() => onSelectCategory("All")}
                className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/35 bg-sky-500/15 px-3 py-1 text-xs font-medium text-sky-200 hover:bg-sky-500/25 transition-colors"
              >
                <span>{activeCategory}</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {pinnedOnly && (
              <button
                type="button"
                onClick={onTogglePinnedOnly}
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/35 bg-amber-400/15 px-3 py-1 text-xs font-medium text-amber-200 hover:bg-amber-400/25 transition-colors"
              >
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                <span>Pinned</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {hidePlayed && (
              <button
                type="button"
                onClick={() => onToggleHidePlayed(false)}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/35 bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-200 hover:bg-emerald-500/25 transition-colors"
              >
                <span>Unplayed Only</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {searchQuery.trim().length > 0 && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-xs font-medium text-white/85 hover:bg-white/[0.14] transition-colors"
              >
                <span>&ldquo;{searchQuery.trim()}&rdquo;</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <span className="font-mono text-[11px] text-white/45 px-1">
              {visibleCount} {visibleCount === 1 ? "game" : "games"}
            </span>
          </div>
        )}
      </section>
    </>
  );
}
