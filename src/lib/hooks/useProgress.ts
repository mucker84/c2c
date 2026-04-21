"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { getUserProgress, initUserProgress, saveLevelResult } from "@/lib/firebase/firestore";
import type { UserProgress } from "@/types/user";

const GUEST_KEY = "c2c_guest_progress";
const GUEST_BONUS_KEY = "c2c_guest_bonus_answers";

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

function saveGuestBonusAnswer(levelId: string, data: { question: string; answer: string; levelTitle: string }) {
  try {
    const raw = localStorage.getItem(GUEST_BONUS_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    existing[levelId] = { ...data, answeredAt: new Date().toISOString(), aiEvaluation: null };
    localStorage.setItem(GUEST_BONUS_KEY, JSON.stringify(existing));
  } catch {}
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
        setProgress(p ?? defaultProgress());
        if (!p) initUserProgress(user.uid);
        setLoading(false);
      });
    } else {
      setProgress(loadGuestProgress());
      setLoading(false);
    }
  }, [user, authLoading]);

  const completeLevel = useCallback(
    async (
      levelId: string,
      fuelEarned: number,
      bonusEarned: boolean,
      bonusAnswer?: { question: string; answer: string; levelTitle: string }
    ) => {
      const updated: UserProgress = {
        ...progress,
        fuel: progress.fuel + fuelEarned,
        completedLevels: progress.completedLevels.includes(levelId)
          ? progress.completedLevels
          : [...progress.completedLevels, levelId],
      };
      setProgress(updated);

      if (user) {
        await saveLevelResult(user.uid, levelId, fuelEarned, bonusEarned, bonusAnswer);
      } else {
        saveGuestProgress(updated);
        if (bonusAnswer) saveGuestBonusAnswer(levelId, bonusAnswer);
      }
    },
    [user, progress]
  );

  return { progress, loading, completeLevel };
}
