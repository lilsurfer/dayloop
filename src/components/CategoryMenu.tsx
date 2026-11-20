"use client";

import React, { useEffect, useRef } from "react";
import {
  Sparkles,
  LayoutGrid,
  BookA,
  Globe2,
  Brain,
  Music,
  Hash,
  Pin,
  EyeOff,
} from "lucide-react";
import type { CategoryFilter, DailyGame, GameCategory } from "@/data/games";
import { GAME_CATEGORIES } from "@/data/games";

interface CategoryMenuProps {
  open: boolean;
  onClose: () => void;
  activeCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  games: DailyGame[];
  floatPinned: boolean;
  onToggleFloatPinned: (value: boolean) => void;
  hidePlayed: boolean;
  onToggleHidePlayed: (value: boolean) => void;
  anchorRef?: React.RefObject<HTMLButtonElement | null>;
}

const CATEGORY_ICONS: Record<GameCategory, React.ReactNode> = {
  Words: <BookA className="w-4 h-4" />,
  Geography: <Globe2 className="w-4 h-4" />,
  "Trivia & Logic": <Brain className="w-4 h-4" />,
  "Pop Culture & Audio": <Music className="w-4 h-4" />,
  "Numbers & Puzzles": <Hash className="w-4 h-4" />,
};

export function CategoryMenu({
  open,
  onClose,
  activeCategory,
  onSelectCategory,
  games,
  floatPinned,
  onToggleFloatPinned,
  hidePlayed,
  onToggleHidePlayed,
  anchorRef,
}: CategoryMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !(anchorRef?.current && anchorRef.current.contains(target))
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  const countFor = (cat: CategoryFilter): number => {
    if (cat === "All") return games.length;
    if (cat === "Niche Gems") return games.filter((g) => g.isNiche).length;
    return games.filter((g) => g.category === cat).length;
  };

  const handleSelect = (cat: CategoryFilter) => {
    onSelectCategory(cat);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Filter games by category"
      className="absolute right-0 top-12 z-50 w-[272px] rounded-2xl border border-white/[0.1] bg-[#10141F]/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl"
    >
      <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-white/45">
        Categories
      </div>

      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          role="menuitem"
          onClick={() => handleSelect("All")}
          className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
            activeCategory === "All"
              ? "bg-sky-500/20 text-sky-200 font-semibold"
              : "text-white/80 hover:bg-white/[0.06] hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <LayoutGrid className="w-4 h-4 text-sky-400" />
            All Games
          </span>
          <span className="font-mono text-xs text-white/45">
            {countFor("All")}
          </span>
        </button>

        {GAME_CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              role="menuitem"
              onClick={() => handleSelect(category)}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-sky-500/20 text-sky-200 font-semibold"
                  : "text-white/80 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span className={isActive ? "text-sky-300" : "text-white/55"}>
                  {CATEGORY_ICONS[category]}
                </span>
                {category}
              </span>
              <span className="font-mono text-xs text-white/45">
                {countFor(category)}
              </span>
            </button>
          );
        })}

        <div className="my-1.5 h-px bg-white/[0.08]" />

        <button
          type="button"
          role="menuitem"
          onClick={() => handleSelect("Niche Gems")}
          className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
            activeCategory === "Niche Gems"
              ? "bg-amber-400/20 text-amber-200 font-semibold"
              : "text-amber-200/85 hover:bg-amber-400/10 hover:text-amber-100"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Niche Gems
          </span>
          <span className="font-mono text-xs text-amber-300/70">
            {countFor("Niche Gems")}
          </span>
        </button>
      </div>

      <div className="my-2 h-px bg-white/[0.08]" />

      <div className="flex flex-col gap-1 px-1 pb-0.5">
        <button
          type="button"
          onClick={() => onToggleFloatPinned(!floatPinned)}
          className="flex items-center justify-between rounded-xl px-2 py-1.5 text-xs text-white/75 hover:bg-white/[0.05] hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            <Pin className="w-3.5 h-3.5 text-amber-300/80" />
            Float Pinned to Top
          </span>
          <span
            className={`inline-flex h-4 w-7 items-center rounded-full p-0.5 transition-colors ${
              floatPinned ? "bg-sky-500" : "bg-white/15"
            }`}
          >
            <span
              className={`h-3 w-3 rounded-full bg-white transition-transform ${
                floatPinned ? "translate-x-3" : "translate-x-0"
              }`}
            />
          </span>
        </button>

        <button
          type="button"
          onClick={() => onToggleHidePlayed(!hidePlayed)}
          className="flex items-center justify-between rounded-xl px-2 py-1.5 text-xs text-white/75 hover:bg-white/[0.05] hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            <EyeOff className="w-3.5 h-3.5 text-emerald-300/80" />
            Hide Played Today
          </span>
          <span
            className={`inline-flex h-4 w-7 items-center rounded-full p-0.5 transition-colors ${
              hidePlayed ? "bg-emerald-500" : "bg-white/15"
            }`}
          >
            <span
              className={`h-3 w-3 rounded-full bg-white transition-transform ${
                hidePlayed ? "translate-x-3" : "translate-x-0"
              }`}
            />
          </span>
        </button>
      </div>
    </div>
  );
}
