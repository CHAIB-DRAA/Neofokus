"use client";

import { Link } from "@/lib/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import ChiffreFantome from "@/components/games/ChiffreFantome";

export default function ChiffresPage() {
  return (
    <div>
      <Link href="/explorateur" className="inline-flex items-center gap-2 text-sm font-bold
        text-[#7A8BA0] hover:text-[#1A5F7A] mb-4 transition-colors">
        <ArrowLeft size={14} /> Retour
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl overflow-hidden border-2 border-[#1E2A38]"
        style={{ boxShadow: "0 4px 20px rgba(30,42,56,0.12)" }}
      >
        <div className="flex items-center gap-3 px-5 py-4"
          style={{ background: "linear-gradient(135deg, #1E2A38, #4A5568)" }}>
          <span className="text-2xl">👻</span>
          <div>
            <h1 className="font-display text-lg font-extrabold text-[#FFD93D]">Chiffres Fantômes</h1>
            <p className="text-xs text-white/60 font-semibold">Mémoire numérique — Empan de chiffres · 8-12 ans</p>
          </div>
        </div>

        <div className="p-5">
          <div className="bg-[#1E2A38] rounded-2xl p-4 mb-5 text-sm text-[#FFD93D] font-semibold leading-relaxed">
            🔢 Des chiffres apparaissent un par un puis disparaissent — retiens la séquence et tape-la dans l'ordre pour entraîner ton <strong>empan de mémoire</strong> !
          </div>
          <ChiffreFantome />
        </div>
      </motion.div>
    </div>
  );
}