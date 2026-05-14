"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import JeuPuzzle from "@/components/games/JeuPuzzle";

export default function PuzzlePage() {
  return (
    <div>
      <Link href="/explorateur" className="inline-flex items-center gap-2 text-sm font-bold
        text-[#7A8BA0] hover:text-[#1A5F7A] mb-4 transition-colors">
        <ArrowLeft size={14} /> Retour
      </Link>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl overflow-hidden border-2 border-[#5B9CF6]"
        style={{ boxShadow: "0 4px 20px rgba(91,156,246,0.15)" }}>
        <div className="flex items-center gap-3 px-5 py-4"
          style={{ background: "linear-gradient(135deg, #5B9CF6, #8E72DB)" }}>
          <span className="text-2xl">🧩</span>
          <div>
            <h1 className="font-display text-lg font-extrabold text-white">Puzzle Taquin</h1>
            <p className="text-xs text-white/80 font-semibold">Planification · Mémoire de travail · 7-12 ans</p>
          </div>
        </div>
        <div className="p-5">
          <div className="bg-[#DBEAFE] rounded-2xl p-4 mb-5 text-sm text-[#1A4FA0] font-semibold leading-relaxed">
            🧩 Glisse les pièces pour remettre les chiffres dans l'ordre. Entraîne la <strong>planification à plusieurs pas</strong> et la <strong>mémoire de travail</strong> — deux fonctions clés du cerveau TDAH !
          </div>
          <JeuPuzzle />
        </div>
      </motion.div>
    </div>
  );
}