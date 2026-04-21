import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <div className="flex flex-col items-center text-center py-16 gap-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">{t("title")}</h1>
        <p className="text-base text-surface-muted max-w-sm">{t("subtitle")}</p>
      </div>

      <div className="w-full max-w-xs space-y-3 mt-4">
        <Link
          href={`/${locale}/journey`}
          className="block w-full py-3 rounded-mac-lg bg-brand-orange text-white font-semibold text-sm shadow-mac-md hover:bg-brand-orange/90 transition-colors text-center"
        >
          {t("cta")}
        </Link>
        <Link
          href={`/${locale}/journey`}
          className="block w-full py-3 rounded-mac-lg border border-surface-border bg-white text-gray-700 font-medium text-sm shadow-mac hover:bg-surface-bg transition-colors text-center"
        >
          {t("ctaGuest")}
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-sm text-center">
        {[
          { label: "Jádro", color: "#E77222", icon: "🔥" },
          { label: "Povrch", color: "#74E721", icon: "🌍" },
          { label: "Vesmír", color: "#73BDFA", icon: "🚀" },
        ].map((s) => (
          <div
            key={s.label}
            className="py-3 rounded-mac bg-white border border-surface-border shadow-mac text-sm"
          >
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-xs font-medium text-gray-700">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
