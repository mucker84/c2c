"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { getUserProgress, initUserProgress, saveLevelResult } from "@/lib/firebase/firestore";
import type { UserProgress } from "@/types/user";

const GUEST_KEY = "c2c_guest_progress";

function loadGuestProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? JSON.parse(raw) : defaultProgress();
  } catch {
    return defaultProgress();
  }
}

function saveGuestProgress(p: UserProgress) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(p));
}

function defaultProgress(): UserProgress {
  return { fuel: 0, completedLevels: [], currentSector: "Core", archiveFragments: [], updatedAt: null };
}

export function useProgress() {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(defaultProgress());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      getUserProgress(user.uid).then((p) => {
        if (p) {
          setProgress(p);
        } else {
          initUserProgress(user.uid).then(setProgress);
        }
        setLoading(false);
      });
    } else {
      setProgress(loadGuestProgress());
      setLoading(false);
    }
  }, [user, authLoading]);

  const completeLevel = useCallback(
    async (levelId: string, fuelEarned: number, bonusEarned: boolean) => {
      const updated: UserProgress = {
        ...progress,
        fuel: progress.fuel + fuelEarned,
        completedLevels: progress.completedLevels.includes(levelId)
          ? progress.completedLevels
          : [...progress.completedLevels, levelId],
      };
      setProgress(updated);

      if (user) {
        await saveLevelResult(user.uid, levelId, fuelEarned, bonusEarned);
      } else {
        saveGuestProgress(updated);
      }
    },
    [user, progress]
  );

  return { progress, loading, completeLevel };
}
