"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Question } from "@/types/level";

interface QuizEngineProps {
  questions: Question[];
  onComplete: (score: number) => void;
}

export default function QuizEngine({ questions, onComplete }: QuizEngineProps) {
  const t = useTranslations("level");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);

  const q = questions[current];
  const isCorrect = selected === q.correct;
  const isLast = current === questions.length - 1;

  function handleCheck() {
    if (selected === null) return;
    setChecked(true);
    if (selected === q.correct) setScore((s) => s + 1);
  }

  function handleNext() {
    if (isLast) {
      onComplete(score + (isCorrect ? 1 : 0));
      return;
    }
    setSelected(null);
    setChecked(false);
    setShowHint(false);
    setCurrent((c) => c + 1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-surface-muted mb-2">
        <span>
          {t("question")} {current + 1} {t("of")} {questions.length}
        </span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < current
                  ? "bg-brand-green"
                  : i === current
                  ? "bg-brand-orange"
                  : "bg-surface-border"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <p className="text-sm font-medium text-gray-800 mb-3">{q.q}</p>

          <div className="space-y-2">
            {q.a.map((opt, i) => {
              let style =
                "w-full text-left px-4 py-3 rounded-mac border text-sm transition-all cursor-pointer ";

              if (!checked) {
                style +=
                  selected === i
                    ? "border-brand-orange bg-orange-50 text-gray-800"
                    : "border-surface-border bg-white hover:border-brand-orange/50 text-gray-700";
              } else {
                if (i === q.correct) {
                  style += "border-brand-green bg-green-50 text-green-800";
                } else if (i === selected && selected !== q.correct) {
                  style += "border-red-400 bg-red-50 text-red-700";
                } else {
                  style += "border-surface-border bg-white text-gray-400";
                }
              }

              return (
                <button
                  key={i}
                  className={style}
                  disabled={checked}
                  onClick={() => setSelected(i)}
                >
                  <span className="font-mono text-xs mr-2 opacity-50">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {checked && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 px-4 py-2 rounded-mac text-sm font-medium ${
                isCorrect
                  ? "bg-green-50 text-green-700 border border-brand-green/40"
                  : "bg-red-50 text-red-700 border border-red-300"
              }`}
            >
              {isCorrect ? t("correct") : t("wrong")}
            </motion.div>
          )}

          {!checked && q.hint && (
            <div className="mt-2">
              {!showHint ? (
                <button
                  onClick={() => setShowHint(true)}
                  className="text-xs text-brand-orange/70 hover:text-brand-orange transition-colors"
                >
                  💡 {t("hint")}
                </button>
              ) : (
                <p className="text-xs text-surface-muted italic">{q.hint}</p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2 pt-2">
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={selected === null}
            className="flex-1 py-2.5 rounded-mac bg-brand-orange text-white text-sm font-medium disabled:opacity-40 hover:bg-brand-orange/90 transition-colors shadow-mac"
          >
            {t("check")}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 py-2.5 rounded-mac bg-brand-green text-white text-sm font-medium hover:bg-brand-green/90 transition-colors shadow-mac"
          >
            {isLast ? t("levelComplete") : t("next")}
          </button>
        )}
      </div>
    </div>
  );
}
