"use client";
import ChronoMagique from "@/components/games/ChronoMagique";
import { useTranslations } from "next-intl";

export default function ChronoPage() {
  const t = useTranslations("gamePages");
  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-5" style={{ background: "linear-gradient(135deg, #BFE3F5, #B8EDD9)" }}>
        <div className="text-3xl mb-1">⏱️</div>
        <div className="font-display text-xl font-extrabold text-[#1A5F7A]">Magic Chrono</div>
        <div className="text-xs text-[#4A5568] font-semibold mt-1">{t("chrono.subtitle")}</div>
      </div>
      <div className="bg-white rounded-3xl p-4 border border-gray-100" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <ChronoMagique />
      </div>
    </div>
  );
}
