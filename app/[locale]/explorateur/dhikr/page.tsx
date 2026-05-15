"use client";

import DhikrSequence from "@/components/games/DhikrSequence";
import { useTranslations } from "next-intl";

export default function SequenceLumierePage() {
  const t = useTranslations("gamePages");
  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-5" style={{ background: "linear-gradient(135deg, #E8E0F8, #BFE3F5)" }}>
        <div className="text-3xl mb-1">💡</div>
        <div className="font-display text-xl font-extrabold text-[#3D1F8A]">Light Sequence</div>
        <div className="text-xs text-[#5B3FA0] font-semibold mt-1">{t("dhikr.subtitle")}</div>
      </div>
      <div className="bg-white rounded-3xl p-4 border border-gray-100"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <DhikrSequence />
      </div>
    </div>
  );
}
