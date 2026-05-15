"use client";
import MissionOrdre from "@/components/games/MissionOrdre";
export default function MissionOrdrePage() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-5" style={{ background: "linear-gradient(135deg, #E8E0F8, #DBEAFE)" }}>
        <div className="text-3xl mb-1">📋</div>
        <div className="font-display text-xl font-extrabold text-[#3D1F8A]">Mission Ordre</div>
        <div className="text-xs text-[#4A5568] font-semibold mt-1">Planification × Séquençage — fonctions exécutives</div>
      </div>
      <div className="bg-white rounded-3xl p-4 border border-gray-100" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <MissionOrdre />
      </div>
    </div>
  );
}
