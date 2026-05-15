"use client";

import MizanBalance from "@/components/games/MizanBalance";

export default function GrandeBalancePage() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-5" style={{ background: "linear-gradient(135deg, #FFF9C4, #FFE0B2)" }}>
        <div className="text-3xl mb-1">⚖️</div>
        <div className="font-display text-xl font-extrabold text-[#9C4400]">La Grande Balance</div>
        <div className="text-xs text-[#7A5C00] font-semibold mt-1">
          Flexibilité cognitive × Set-shifting
        </div>
      </div>
      <div className="bg-white rounded-3xl p-4 border border-gray-100"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <MizanBalance />
      </div>
    </div>
  );
}
