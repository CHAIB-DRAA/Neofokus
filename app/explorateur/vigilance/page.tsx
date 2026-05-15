"use client";
import VigilanceStar from "@/components/games/VigilanceStar";
export default function VigilancePage() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-5" style={{ background: "linear-gradient(135deg, #DBEAFE, #BFE3F5)" }}>
        <div className="text-3xl mb-1">🎯</div>
        <div className="font-display text-xl font-extrabold text-[#1A4FA0]">Vigilance ⭐</div>
        <div className="text-xs text-[#4A5568] font-semibold mt-1">Attention soutenue × CPT — déficit central TDAH</div>
      </div>
      <div className="bg-white rounded-3xl p-4 border border-gray-100" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <VigilanceStar />
      </div>
    </div>
  );
}
