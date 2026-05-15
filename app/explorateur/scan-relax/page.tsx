"use client";
import ScanRelax from "@/components/games/ScanRelax";
export default function ScanRelaxPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-5" style={{ background: "linear-gradient(135deg, #BFE3F5, #B8EDD9)" }}>
        <div className="text-3xl mb-1">🌊</div>
        <div className="font-display text-xl font-extrabold text-[#1A5F7A]">Scan Relax</div>
        <div className="text-xs text-[#4A5568] font-semibold mt-1">Relaxation musculaire progressive × Régulation émotionnelle</div>
      </div>
      <div className="bg-white rounded-3xl p-4 border border-gray-100" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <ScanRelax />
      </div>
    </div>
  );
}
