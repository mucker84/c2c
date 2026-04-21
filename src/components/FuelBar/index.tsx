"use client";

import { motion } from "framer-motion";

interface FuelBarProps {
  fuel: number;
  maxFuel?: number;
  label?: string;
}

export default function FuelBar({ fuel, maxFuel = 500, label }: FuelBarProps) {
  const pct = Math.min((fuel / maxFuel) * 100, 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-surface-muted font-medium">{label}</span>
          <span className="text-xs font-mono text-brand-orange font-semibold">{fuel}</span>
        </div>
      )}
      <div className="h-2 bg-surface-border rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-orange to-brand-green"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
