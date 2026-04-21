import { notFound } from "next/navigation";
import levelsData from "@/data/levels/core1.json";
import type { Level } from "@/types/level";
import LevelPageClient from "./LevelPageClient";

export function generateStaticParams() {
  const levels = levelsData as Level[];
  return levels.map((l) => ({ levelId: l.id }));
}

export default async function LevelPage({
  params,
}: {
  params: Promise<{ locale: string; levelId: string }>;
}) {
  const { levelId } = await params;
  const levels = levelsData as Level[];
  const level = levels.find((l) => l.id === levelId);

  if (!level) notFound();

  return <LevelPageClient level={level} />;
}
