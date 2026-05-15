"use client";

import SabrJardin from "@/components/games/SabrJardin";

export default function JardinZenPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-5" style={{ background: "linear-gradient(135deg, #B8EDD9, #DBEAFE)" }}>
        <div className="text-3xl mb-1">🌱</div>
        <div className="font-display text-xl font-extrabold text-[#0F5C3A]">Le Jardin de la Patience</div>
        <div className="text-xs text-[#4A5568] font-semibold mt-1">
          Inhibition × Gratification différée — Barkley 2011
        </div>
      </div>
      <div className="bg-white rounded-3xl p-4 border border-gray-100"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <SabrJardin />
      </div>
    </div>
  );
}
