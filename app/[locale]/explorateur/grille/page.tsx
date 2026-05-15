"use client";

import { Link } from "@/lib/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import GrilleMemoire from "@/components/games/GrilleMemoire";

export default function GrillePage() {
  return (
    <div>
      <Link href="/explorateur" className="inline-flex items-center gap-2 text-sm font-bold
        text-[#7A8BA0] hover:text-[#1A5F7A] mb-4 transition-colors">
        <ArrowLeft size={14} /> Retour
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl overflow-hidden border-2 border-[#5B9CF6]"
        style={{ boxShadow: "0 4px 20px rgba(91,156,246,0.15)" }}
      >
        <div className="flex items-center gap-3 px-5 py-4"
          style={{ background: "linear-gradient(135deg, #5B9CF6, #8E72DB)" }}>
          <span className="text-2xl">🟦</span>
          <div>
            <h1 className="font-display text-lg font-extrabold text-white">Grille Mémoire</h1>
            <p className="text-xs text-white/80 font-semibold">Mémoire spatiale — Concentration · 9-13 ans</p>
          </div>
        </div>

        <div className="p-5">
          <div className="bg-[#DBEAFE] rounded-2xl p-4 mb-5 text-sm text-[#1A4FA0] font-semibold leading-relaxed">
            🧩 Une grille colorée s'affiche brièvement — mémorise les cases et reproduis-les ! Entraîne ta <strong>mémoire spatiale</strong>.
          </div>
          <GrilleMemoire />
        </div>
      </motion.div>
    </div>
  );
}