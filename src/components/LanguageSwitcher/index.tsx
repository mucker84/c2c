"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales } from "@/i18n/config";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(next: string) {
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/"));
  }

  return (
    <div className="flex items-center gap-0.5 bg-surface-bg rounded-mac p-0.5 border border-surface-border">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
            locale === l
              ? "bg-white shadow-mac text-gray-800"
              : "text-surface-muted hover:text-gray-600"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
