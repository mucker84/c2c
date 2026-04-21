"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import GlitchText from "@/components/GlitchText";
import QuizEngine from "@/components/QuizEngine";
import type { Level } from "@/types/level";
import { FUEL_PER_QUESTION, FUEL_BONUS } from "@/data/sectors";

type Phase = "glitch" | "quiz" | "bonus" | "complete";

interface LevelControllerProps {
  level: Level;
  sectorColor: string;
  onComplete: (fuelEarned: number, bonusEarned: boolean) => void;
}

export default function LevelController({ level, sectorColor, onComplete }: LevelControllerProps) {
  const t = useTranslations("level");
  const [phase, setPhase] = useState<Phase>("glitch");
  const [quizScore, setQuizScore] = useState(0);
  const [bonusAnswer, setBonusAnswer] = useState("");
  const [bonusSubmitted, setBonusSubmitted] = useState(false);

  const fuelFromQuiz = quizScore * FUEL_PER_QUESTION;

  function handleQuizComplete(score: number) {
    setQuizScore(score);
    if (level.content.logicBonus) {
      setPhase("bonus");
    } else {
      const fuel = score * FUEL_PER_QUESTION;
      onComplete(fuel, false);
      setPhase("complete");
    }
  }

  function handleBonusSubmit() {
    setBonusSubmitted(true);
    setTimeout(() => {
      onComplete(fuelFromQuiz + FUEL_BONUS, true);
      setPhase("complete");
    }, 1200);
  }

  function handleBonusSkip() {
    onComplete(fuelFromQuiz, false);
    setPhase("complete");
  }

  return (
    <div className="bg-surface-card rounded-mac-lg shadow-mac-md overflow-hidden">
      {/* Header */}
      <div
        className="px-6 py-4 border-b border-surface-border"
        style={{ borderLeftWidth: 4, borderLeftColor: sectorColor }}
      >
        <p className="text-xs text-surface-muted font-mono mb-0.5">{level.coordinates}</p>
        <h2 className="text-lg font-semibold text-gray-800">{level.title}</h2>
      </div>

      <div className="px-6 py-5 space-y-5">
        <AnimatePresence mode="wait">
          {phase === "glitch" && (
            <motion.div
              key="glitch-phase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <GlitchText
                glitch={level.content.glitch}
                fullText={level.content.fullText}
                revealed={false}
              />
              <p className="text-xs text-surface-muted italic">
                Správně odpověz na otázky, aby se text odhalil.
              </p>
              <button
                onClick={() => setPhase("quiz")}
                className="w-full py-2.5 rounded-mac text-sm font-medium text-white shadow-mac transition-colors"
                style={{ backgroundColor: sectorColor }}
              >
                Spustit kvíz →
              </button>
            </motion.div>
          )}

          {phase === "quiz" && (
            <motion.div
              key="quiz-phase"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <GlitchText
                glitch={level.content.glitch}
                fullText={level.content.fullText}
                revealed={false}
              />
              <div className="mt-4 pt-4 border-t border-surface-border">
                <QuizEngine questions={level.questions} onComplete={handleQuizComplete} />
              </div>
            </motion.div>
          )}

          {phase === "bonus" && level.content.logicBonus && (
            <motion.div
              key="bonus-phase"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <GlitchText
                glitch={level.content.glitch}
                fullText={level.content.fullText}
                revealed={true}
              />
              <div className="p-4 rounded-mac border border-brand-purple/30 bg-purple-50">
                <p className="text-xs font-semibold text-brand-purple mb-1 uppercase tracking-wide">
                  {t("bonusTitle")}
                </p>
                <p className="text-sm text-gray-700">{level.content.logicBonus}</p>
              </div>
              {!bonusSubmitted ? (
                <>
                  <textarea
                    value={bonusAnswer}
                    onChange={(e) => setBonusAnswer(e.target.value)}
                    placeholder="Napiš svou odpověď..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-surface-border rounded-mac resize-none focus:outline-none focus:border-brand-purple/60"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleBonusSubmit}
                      disabled={!bonusAnswer.trim()}
                      className="flex-1 py-2.5 rounded-mac bg-brand-purple text-white text-sm font-medium disabled:opacity-40 hover:bg-brand-purple/90 transition-colors shadow-mac"
                    >
                      {t("bonusSubmit")} +{FUEL_BONUS} ⚡
                    </button>
                    <button
                      onClick={handleBonusSkip}
                      className="px-4 py-2.5 rounded-mac border border-surface-border text-sm text-surface-muted hover:border-gray-400 transition-colors"
                    >
                      Přeskočit
                    </button>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 rounded-mac bg-green-50 border border-brand-green/40 text-sm text-green-700 font-medium text-center"
                >
                  +{FUEL_BONUS} energie získáno! ⚡
                </motion.div>
              )}
            </motion.div>
          )}

          {phase === "complete" && (
            <motion.div
              key="complete-phase"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 space-y-3"
            >
              <div className="text-4xl">✓</div>
              <h3 className="text-base font-semibold text-gray-800">{t("levelComplete")}</h3>
              <p className="text-sm text-surface-muted">
                {t("energyEarned")}:{" "}
                <span className="font-mono font-bold text-brand-orange">{fuelFromQuiz}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
