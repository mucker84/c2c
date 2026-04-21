"use client";

import { useProgress } from "@/lib/hooks/useProgress";
import JourneyMap from "@/components/JourneyMap";
import type { Level } from "@/types/level";

export default function JourneyMapClient({ levels }: { levels: Level[] }) {
  const { progress } = useProgress();
  return <JourneyMap levels={levels} completedLevels={progress.completedLevels} />;
}
