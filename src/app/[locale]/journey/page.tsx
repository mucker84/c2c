import { getTranslations } from "next-intl/server";
import JourneyMapClient from "./JourneyMapClient";
import levelsData from "@/data/levels/core1.json";
import type { Level } from "@/types/level";

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "journey" });
  const levels = levelsData as Level[];

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-800">{t("title")}</h1>
      <JourneyMapClient levels={levels} />
    </div>
  );
}
