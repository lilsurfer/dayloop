"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ExternalLink, Sparkles, X } from "lucide-react";
import { GAMES, type CategoryFilter, type DailyGame } from "@/data/games";
import { useDayloopState } from "@/hooks/useDayloopState";
import { Header } from "./Header";
import { GameGrid } from "./GameGrid";
import { GameTheater } from "./GameTheater";

interface ActiveTheaterState {
  game: DailyGame;
  mode: "daily" | "unlimited";
}

interface ToastState {
  id: number;
  message: string;
  undoGameId?: string;
}

export function DayloopApp() {
  const {
    playedIds,
    pinnedIds,
    launchMode,
    floatPinned,
    hidePlayed,
    timeUntilMidnight,
    togglePlayed,
    markPlayed,
    resetToday,
    togglePinned,
    setLaunchMode,
    setFloatPinned,
    setHidePlayed,
  } = useDayloopState();

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [theater, setTheater] = useState<ActiveTheaterState | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const toastTimerRef = useRef<number | null>(null);
  const highlightTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string, undoGameId?: string) => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setToast({ id: Date.now(), message, undoGameId });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  // Global keyboard shortcuts: '/' focuses search, 'Esc' closes overlays
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (theater) {
          setTheater(null);
          return;
        }
        if (categoryMenuOpen) {
          setCategoryMenuOpen(false);
          return;
        }
        if (searchOpen) {
          setSearchQuery("");
          setSearchOpen(false);
          return;
        }
      }

      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 20);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [theater, categoryMenuOpen, searchOpen]);

  const filteredGames = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matched = GAMES.filter((game) => {
      if (activeCategory === "Niche Gems" && !game.isNiche) return false;
      if (
        activeCategory !== "All" &&
        activeCategory !== "Niche Gems" &&
        game.category !== activeCategory
      ) {
        return false;
      }
      if (pinnedOnly && !pinnedIds.includes(game.id)) return false;
      if (hidePlayed && playedIds.includes(game.id)) return false;

      if (query.length > 0) {
        const haystack = `${game.name} ${game.tagline} ${game.category} ${
          game.isNiche ? "niche" : ""
        }`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });

    return [...matched].sort((a, b) => {
      if (floatPinned && !pinnedOnly) {
        const aPin = pinnedIds.includes(a.id) ? 0 : 1;
        const bPin = pinnedIds.includes(b.id) ? 0 : 1;
        if (aPin !== bPin) return aPin - bPin;
      }
      return a.relevanceRank - b.relevanceRank;
    });
  }, [
    activeCategory,
    pinnedOnly,
    pinnedIds,
    hidePlayed,
    playedIds,
    searchQuery,
    floatPinned,
  ]);

  const handleResetAllFilters = useCallback(() => {
    setActiveCategory("All");
    setPinnedOnly(false);
    setHidePlayed(false);
    setSearchQuery("");
    setSearchOpen(false);
    setCategoryMenuOpen(false);
  }, [setHidePlayed]);

  const handleOpenExternal = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const handleLaunch = useCallback(
    (game: DailyGame, mode: "daily" | "unlimited") => {
      const targetUrl =
        mode === "unlimited" && game.unlimitedUrl
          ? game.unlimitedUrl
          : game.dailyUrl;

      const canEmbedTarget =
        mode === "unlimited" ? game.unlimitedCanEmbed : game.dailyCanEmbed;

      if (launchMode === "smart-embed" && canEmbedTarget) {
        setTheater({ game, mode });
        return;
      }

      const wasPlayed = playedIds.includes(game.id);
      handleOpenExternal(targetUrl);
      markPlayed(game.id);
      showToast(
        `Opened ${game.name} (${mode === "daily" ? "Daily" : "Unlimited"}) in a new tab${
          wasPlayed ? "" : " · Marked played"
        }`,
        wasPlayed ? undefined : game.id
      );
    },
    [launchMode, playedIds, handleOpenExternal, markPlayed, showToast]
  );

  const handleSurpriseMe = useCallback(() => {
    const pool =
      filteredGames.filter((g) => !playedIds.includes(g.id)) || [];
    const candidates =
      pool.length > 0
        ? pool
        : GAMES.filter((g) => !playedIds.includes(g.id));
    const finalPool = candidates.length > 0 ? candidates : GAMES;

    const pick = finalPool[Math.floor(Math.random() * finalPool.length)];
    if (!pick) return;

    // Ensure card is visible if current filters exclude it
    if (!filteredGames.some((g) => g.id === pick.id)) {
      handleResetAllFilters();
    }

    setHighlightedId(pick.id);
    if (highlightTimerRef.current) window.clearTimeout(highlightTimerRef.current);
    highlightTimerRef.current = window.setTimeout(() => {
      setHighlightedId(null);
    }, 2600);

    setTimeout(() => {
      const el = document.getElementById(`game-card-${pick.id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);

    showToast(`Spotlight: ${pick.name} — ${pick.tagline}`);
  }, [filteredGames, playedIds, handleResetAllFilters, showToast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        games={GAMES}
        visibleCount={filteredGames.length}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        categoryMenuOpen={categoryMenuOpen}
        setCategoryMenuOpen={setCategoryMenuOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        searchInputRef={searchInputRef}
        pinnedOnly={pinnedOnly}
        onTogglePinnedOnly={() => setPinnedOnly((v) => !v)}
        pinnedCount={pinnedIds.length}
        playedCount={playedIds.length}
        timeUntilMidnight={timeUntilMidnight}
        onResetToday={resetToday}
        launchMode={launchMode}
        onChangeLaunchMode={setLaunchMode}
        floatPinned={floatPinned}
        onToggleFloatPinned={setFloatPinned}
        hidePlayed={hidePlayed}
        onToggleHidePlayed={setHidePlayed}
        onSurpriseMe={handleSurpriseMe}
        onResetAllFilters={handleResetAllFilters}
      />

      <main className="flex-1">
        <GameGrid
          games={filteredGames}
          playedIds={playedIds}
          pinnedIds={pinnedIds}
          launchMode={launchMode}
          highlightedId={highlightedId}
          onLaunch={handleLaunch}
          onTogglePlayed={togglePlayed}
          onTogglePinned={togglePinned}
          onResetFilters={handleResetAllFilters}
        />
      </main>

      <footer className="border-t border-white/[0.06] bg-[#090B10]/80 py-7 px-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/45">
          <p className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400/80" />
            <span>
              Dayloop celebrates independent puzzle creators — all games belong to their respective publishers.
            </span>
          </p>
          <p className="font-mono text-[11px] text-white/40">
            Local progress · Resets at midnight ({timeUntilMidnight}) ·{" "}
            <kbd className="rounded border border-white/15 bg-white/[0.05] px-1 py-0.5 text-[10px]">
              /
            </kbd>{" "}
            search
          </p>
        </div>
      </footer>

      {/* In-App Full-Viewport Game Theater */}
      {theater && (
        <GameTheater
          game={theater.game}
          mode={theater.mode}
          isPlayed={playedIds.includes(theater.game.id)}
          onClose={() => setTheater(null)}
          onSwitchMode={(nextMode) =>
            setTheater((prev) => (prev ? { ...prev, mode: nextMode } : null))
          }
          onTogglePlayed={togglePlayed}
          onOpenExternal={handleOpenExternal}
        />
      )}

      {/* Ephemeral Toast for External Launches & Surprise Me */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-white/15 bg-[#121622]/95 px-4 py-2.5 text-xs font-medium text-white shadow-2xl backdrop-blur-xl">
          {toast.undoGameId ? (
            <ExternalLink className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
          {toast.undoGameId && (
            <button
              type="button"
              onClick={() => {
                togglePlayed(toast.undoGameId!);
                setToast(null);
              }}
              className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-sky-300 hover:bg-white/20 transition-colors"
            >
              Undo
            </button>
          )}
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
