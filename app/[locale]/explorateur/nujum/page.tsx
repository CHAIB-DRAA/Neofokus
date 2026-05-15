"use client";

import NujumStars from "@/components/games/NujumStars";
import { useTranslations } from "next-intl";

export default function CarteCielPage() {
  const t = useTranslations("gamePages");
  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-5" style={{ background: "linear-gradient(135deg, #0B1A2E, #1A3358)" }}>
        <div className="text-3xl mb-1">🌌</div>
        <div className="font-display text-xl font-extrabold text-[#FFD93D]">Sky Map</div>
        <div className="text-xs text-[#7DC4E8] font-semibold mt-1">{t("nujum.subtitle")}</div>
      </div>
      <div className="bg-white rounded-3xl p-4 border border-gray-100"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <NujumStars />
      </div>
    </div>
  );
}
