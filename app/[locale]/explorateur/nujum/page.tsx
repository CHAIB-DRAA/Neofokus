"use client";

import NujumStars from "@/components/games/NujumStars";

export default function CarteCielPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-5" style={{ background: "linear-gradient(135deg, #0B1A2E, #1A3358)" }}>
        <div className="text-3xl mb-1">🌌</div>
        <div className="font-display text-xl font-extrabold text-[#FFD93D]">Carte du Ciel</div>
        <div className="text-xs text-[#7DC4E8] font-semibold mt-1">
          Mémoire spatiale × Hippocampe — Martinussen 2005
        </div>
      </div>
      <div className="bg-white rounded-3xl p-4 border border-gray-100"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <NujumStars />
      </div>
    </div>
  );
}
