"use client";
import ContrairesVite from "@/components/games/ContrairesVite";
export default function ContrairesPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-5" style={{ background: "linear-gradient(135deg, #FDECEA, #FFF9C4)" }}>
        <div className="text-3xl mb-1">🔀</div>
        <div className="font-display text-xl font-extrabold text-[#C02020]">Contraires Express</div>
        <div className="text-xs text-[#7A4200] font-semibold mt-1">Vitesse de traitement × Flexibilité cognitive</div>
      </div>
      <div className="bg-white rounded-3xl p-4 border border-gray-100" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <ContrairesVite />
      </div>
    </div>
  );
}
