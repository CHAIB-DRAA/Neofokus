"use client";

import { Link } from "@/lib/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import PairesMagiques from "@/components/games/PairesMagiques";

export default function PairesPage() {
  return (
    <div>
      <Link href="/explorateur" className="inline-flex items-center gap-2 text-sm font-bold
        text-[#7A8BA0] hover:text-[#1A5F7A] mb-4 transition-colors">
        <ArrowLeft size={14} /> Retour
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl overflow-hidden border-2 border-[#FF922B]"
        style={{ boxShadow: "0 4px 20px rgba(255,146,43,0.15)" }}
      >
        <div className="flex items-center gap-3 px-5 py-4"
          style={{ background: "linear-gradient(135deg, #FF922B, #FFD93D)" }}>
          <span className="text-2xl">🃏</span>
          <div>
            <h1 className="font-display text-lg font-extrabold text-white">Paires Magiques</h1>
            <p className="text-xs text-white/80 font-semibold">Jeu de mémoire — Concentration · 6-8 ans</p>
          </div>
        </div>

        <div className="p-5">
          <div className="bg-[#FFE0B2] rounded-2xl p-4 mb-5 text-sm text-[#9C4400] font-semibold leading-relaxed">
            🧠 Retourne les cartes et retrouve les paires — entraîne ta <strong>mémoire visuelle</strong> et ta <strong>concentration</strong> !
          </div>
          <PairesMagiques />
        </div>
      </motion.div>
    </div>
  );
}
