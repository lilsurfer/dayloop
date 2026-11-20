"use client";

import { useCallback, useEffect, useState } from "react";

export type LaunchMode = "smart-embed" | "new-tab";

interface PlayedStoragePayload {
  date: string;
  ids: string[];
}

interface PrefsStoragePayload {
  floatPinned: boolean;
  hidePlayed: boolean;
}

const STORAGE_KEYS = {
  played: "dayloop_played_v1",
  pinned: "dayloop_pinned_v1",
  launchMode: "dayloop_launch_mode_v1",
  prefs: "dayloop_prefs_v1",
} as const;

export function getLocalDateKey(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTimeUntilMidnight(now = new Date()): string {
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0
  );
  const diffMs = Math.max(0, midnight.getTime() - now.getTime());
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

function safeReadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWriteJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota / privacy mode errors
  }
}

export function useDayloopState() {
  const [hydrated, setHydrated] = useState(false);
  const [todayKey, setTodayKey] = useState<string>("");
  const [playedIds, setPlayedIds] = useState<string[]>([]);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [launchMode, setLaunchModeState] = useState<LaunchMode>("smart-embed");
  const [floatPinned, setFloatPinnedState] = useState<boolean>(true);
  const [hidePlayed, setHidePlayedState] = useState<boolean>(false);
  const [timeUntilMidnight, setTimeUntilMidnight] = useState<string>("--h --m");

  const syncDayAndMidnight = useCallback(() => {
    const now = new Date();
    const currentKey = getLocalDateKey(now);
    setTimeUntilMidnight(getTimeUntilMidnight(now));
    setTodayKey((prevKey) => {
      if (prevKey && prevKey !== currentKey) {
        setPlayedIds([]);
        safeWriteJson(STORAGE_KEYS.played, {
          date: currentKey,
          ids: [],
        } satisfies PlayedStoragePayload);
      }
      return currentKey;
    });
  }, []);

  useEffect(() => {
    const now = new Date();
    const currentKey = getLocalDateKey(now);
    setTodayKey(currentKey);
    setTimeUntilMidnight(getTimeUntilMidnight(now));

    const storedPlayed = safeReadJson<PlayedStoragePayload | null>(
      STORAGE_KEYS.played,
      null
    );
    if (
      storedPlayed &&
      storedPlayed.date === currentKey &&
      Array.isArray(storedPlayed.ids)
    ) {
      setPlayedIds(
        storedPlayed.ids.filter((id): id is string => typeof id === "string")
      );
    } else {
      safeWriteJson(STORAGE_KEYS.played, {
        date: currentKey,
        ids: [],
      } satisfies PlayedStoragePayload);
    }

    const storedPinned = safeReadJson<unknown>(STORAGE_KEYS.pinned, []);
    if (Array.isArray(storedPinned)) {
      setPinnedIds(
        storedPinned.filter((id): id is string => typeof id === "string")
      );
    }

    try {
      const storedMode = window.localStorage.getItem(STORAGE_KEYS.launchMode);
      if (storedMode === "smart-embed" || storedMode === "new-tab") {
        setLaunchModeState(storedMode);
      }
    } catch {
      // Ignore storage errors
    }

    const storedPrefs = safeReadJson<Partial<PrefsStoragePayload>>(
      STORAGE_KEYS.prefs,
      {}
    );
    if (typeof storedPrefs.floatPinned === "boolean") {
      setFloatPinnedState(storedPrefs.floatPinned);
    }
    if (typeof storedPrefs.hidePlayed === "boolean") {
      setHidePlayedState(storedPrefs.hidePlayed);
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(syncDayAndMidnight, 30_000);
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        syncDayAndMidnight();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [syncDayAndMidnight]);

  const persistPlayed = useCallback(
    (nextIds: string[]) => {
      const dateKey = todayKey || getLocalDateKey();
      safeWriteJson(STORAGE_KEYS.played, {
        date: dateKey,
        ids: nextIds,
      } satisfies PlayedStoragePayload);
    },
    [todayKey]
  );

  const togglePlayed = useCallback(
    (id: string) => {
      setPlayedIds((prev) => {
        const next = prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id];
        persistPlayed(next);
        return next;
      });
    },
    [persistPlayed]
  );

  const markPlayed = useCallback(
    (id: string) => {
      setPlayedIds((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        persistPlayed(next);
        return next;
      });
    },
    [persistPlayed]
  );

  const resetToday = useCallback(() => {
    setPlayedIds([]);
    persistPlayed([]);
  }, [persistPlayed]);

  const togglePinned = useCallback((id: string) => {
    setPinnedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      safeWriteJson(STORAGE_KEYS.pinned, next);
      return next;
    });
  }, []);

  const setLaunchMode = useCallback((mode: LaunchMode) => {
    setLaunchModeState(mode);
    try {
      window.localStorage.setItem(STORAGE_KEYS.launchMode, mode);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const setFloatPinned = useCallback(
    (value: boolean) => {
      setFloatPinnedState(value);
      safeWriteJson(STORAGE_KEYS.prefs, {
        floatPinned: value,
        hidePlayed,
      } satisfies PrefsStoragePayload);
    },
    [hidePlayed]
  );

  const setHidePlayed = useCallback(
    (value: boolean) => {
      setHidePlayedState(value);
      safeWriteJson(STORAGE_KEYS.prefs, {
        floatPinned,
        hidePlayed: value,
      } satisfies PrefsStoragePayload);
    },
    [floatPinned]
  );

  return {
    hydrated,
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
  };
}
