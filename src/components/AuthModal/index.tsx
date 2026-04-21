"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { signInWithGoogle, signInWithEmail, registerWithEmail } from "@/lib/firebase/auth";

interface AuthModalProps {
  onClose: () => void;
}

type Mode = "login" | "register";

export default function AuthModal({ onClose }: AuthModalProps) {
  const t = useTranslations("auth");
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-surface-card rounded-mac-lg shadow-mac-lg w-full max-w-sm p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-800">{t("loginTitle")}</h2>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-surface-bg text-surface-muted text-xs hover:bg-surface-border transition-colors flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full py-2.5 rounded-mac border border-surface-border bg-white text-sm font-medium text-gray-700 hover:bg-surface-bg transition-colors shadow-mac flex items-center justify-center gap-2 mb-4"
          >
            <span className="text-base">G</span> {t("loginGoogle")}
          </button>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-px bg-surface-border" />
            <span className="text-xs text-surface-muted">nebo</span>
            <div className="flex-1 h-px bg-surface-border" />
          </div>

          <form onSubmit={handleEmail} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email")}
              required
              className="w-full px-3 py-2 text-sm border border-surface-border rounded-mac focus:outline-none focus:border-brand-orange/60"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("password")}
              required
              className="w-full px-3 py-2 text-sm border border-surface-border rounded-mac focus:outline-none focus:border-brand-orange/60"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-mac bg-brand-orange text-white text-sm font-medium disabled:opacity-50 hover:bg-brand-orange/90 transition-colors shadow-mac"
            >
              {mode === "login" ? t("loginEmail") : t("register")}
            </button>
          </form>

          <p className="text-xs text-surface-muted text-center mt-4">
            {mode === "login" ? t("noAccount") : t("haveAccount")}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-brand-orange hover:underline"
            >
              {mode === "login" ? t("register") : t("loginEmail")}
            </button>
          </p>

          <p className="text-xs text-surface-muted text-center mt-2 italic">{t("guestWarning")}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
