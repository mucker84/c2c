"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import LevelController from "@/components/LevelController";
import { useProgress } from "@/lib/hooks/useProgress";
import { SECTORS } from "@/data/sectors";
import type { Level } from "@/types/level";

export default function LevelPageClient({ level }: { level: Level }) {
  const { completeLevel } = useProgress();
  const router = useRouter();
  const locale = useLocale();

  const sector = SECTORS.find((s) => s.id === level.sector);
  const sectorColor = sector?.color ?? "#E77222";

  async function handleComplete(fuelEarned: number, bonusEarned: boolean) {
    await completeLevel(level.id, fuelEarned, bonusEarned);
    setTimeout(() => router.push(`/${locale}/journey`), 1500);
  }

  return (
    <div className="max-w-lg mx-auto">
      <button
        onClick={() => router.back()}
        className="text-xs text-surface-muted hover:text-gray-700 mb-4 flex items-center gap-1 transition-colors"
      >
        ← Zpět
      </button>
      <LevelController level={level} sectorColor={sectorColor} onComplete={handleComplete} />
    </div>
  );
}
