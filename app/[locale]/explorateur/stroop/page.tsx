"use client";
import StroopColors from "@/components/games/StroopColors";
import { useTranslations } from "next-intl";

export default function StroopPage() {
  const t = useTranslations("gamePages");
  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-5" style={{ background: "linear-gradient(135deg, #E8E0F8, #FDECEA)" }}>
        <div className="text-3xl mb-1">🎨</div>
        <div className="font-display text-xl font-extrabold text-[#3D1F8A]">Color Challenge</div>
        <div className="text-xs text-[#4A5568] font-semibold mt-1">{t("stroop.subtitle")}</div>
      </div>
      <div className="bg-white rounded-3xl p-4 border border-gray-100" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <StroopColors />
      </div>
    </div>
  );
}
