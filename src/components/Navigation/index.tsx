"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProgress } from "@/lib/hooks/useProgress";
import { signOut } from "@/lib/firebase/auth";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AuthModal from "@/components/AuthModal";
import FuelBar from "@/components/FuelBar";

export default function Navigation() {
  const t = useTranslations("nav");
  const tJourney = useTranslations("journey");
  const locale = useLocale();
  const { isGuest } = useAuth();
  const { progress } = useProgress();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-surface-card border-b border-surface-border shadow-mac">
        <div className="max-w-2xl mx-auto px-4 h-12 flex items-center gap-3">
          <Link
            href={`/${locale}`}
            className="font-semibold text-sm text-gray-800 hover:text-brand-orange transition-colors mr-2"
          >
            C2C
          </Link>

          <Link
            href={`/${locale}/journey`}
            className="text-xs text-surface-muted hover:text-gray-700 transition-colors"
          >
            {t("journey")}
          </Link>

          <div className="flex-1" />

          <div className="w-28">
            <FuelBar fuel={progress.fuel} label={tJourney("fuel")} />
          </div>

          <LanguageSwitcher />

          {isGuest ? (
            <button
              onClick={() => setShowAuth(true)}
              className="text-xs px-3 py-1.5 rounded-mac bg-brand-orange text-white font-medium hover:bg-brand-orange/90 transition-colors shadow-mac"
            >
              {t("login")}
            </button>
          ) : (
            <button
              onClick={() => signOut()}
              className="text-xs px-3 py-1.5 rounded-mac border border-surface-border text-surface-muted hover:border-gray-400 transition-colors"
            >
              {t("logout")}
            </button>
          )}
        </div>
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
