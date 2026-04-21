"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import type { Level, LevelState } from "@/types/level";
import { SECTORS } from "@/data/sectors";

interface JourneyMapProps {
  levels: Level[];
  completedLevels: string[];
}

export default function JourneyMap({ levels, completedLevels }: JourneyMapProps) {
  const locale = useLocale();

  function getLevelState(level: Level, index: number): LevelState {
    if (completedLevels.includes(level.id)) return "completed";
    if (index === 0) return "available";
    const prev = levels[index - 1];
    if (completedLevels.includes(prev.id)) return "available";
    return "locked";
  }

  const grouped = SECTORS.map((sector) => ({
    sector,
    levels: levels.filter((l) => l.sector === sector.id),
  })).filter((g) => g.levels.length > 0);

  return (
    <div className="space-y-8">
      {grouped.map(({ sector, levels: sectorLevels }) => (
        <div key={sector.id}>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: sector.color }}
            />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-surface-muted">
              {sector.label}
            </h3>
            <span className="text-xs text-surface-muted/60">{sector.depthRange}</span>
          </div>

          <div className="space-y-2">
            {sectorLevels.map((level, i) => {
              const globalIndex = levels.indexOf(level);
              const state = getLevelState(level, globalIndex);
              const sectorData = SECTORS.find((s) => s.id === level.sector);
              const color = sectorData?.color ?? "#E77222";

              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  {state === "locked" ? (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-mac bg-surface-bg border border-surface-border opacity-50 cursor-not-allowed">
                      <div className="w-1.5 h-1.5 rounded-full bg-surface-muted" />
                      <div>
                        <p className="text-xs font-medium text-surface-muted">{level.title}</p>
                        <p className="text-xs text-surface-muted/60">{level.coordinates}</p>
                      </div>
                      <span className="ml-auto text-xs text-surface-muted">🔒</span>
                    </div>
                  ) : (
                    <Link href={`/${locale}/journey/${level.id}`}>
                      <div
                        className="flex items-center gap-3 px-4 py-3 rounded-mac bg-white border shadow-mac hover:shadow-mac-md transition-all cursor-pointer"
                        style={{
                          borderColor: state === "completed" ? color + "60" : "#D1D1D6",
                          borderLeftWidth: 3,
                          borderLeftColor: color,
                        }}
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800">{level.title}</p>
                          <p className="text-xs text-surface-muted">{level.coordinates}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5">
                          {state === "completed" && (
                            <span className="text-xs text-brand-green font-medium">✓</span>
                          )}
                          <span className="text-xs text-surface-muted">→</span>
                        </div>
                      </div>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
