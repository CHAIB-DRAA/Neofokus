"use client";

import { Link } from "@/lib/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import IntrusEclair from "@/components/games/IntrusEclair";

export default function IntrusPage() {
  return (
    <div>
      <Link href="/explorateur" className="inline-flex items-center gap-2 text-sm font-bold
        text-[#7A8BA0] hover:text-[#1A5F7A] mb-4 transition-colors">
        <ArrowLeft size={14} /> Retour
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl overflow-hidden border-2 border-[#3A9FD4]"
        style={{ boxShadow: "0 4px 20px rgba(58,159,212,0.15)" }}
      >
        <div className="flex items-center gap-3 px-5 py-4"
          style={{ background: "linear-gradient(135deg, #3A9FD4, #5CC7A0)" }}>
          <span className="text-2xl">🔍</span>
          <div>
            <h1 className="font-display text-lg font-extrabold text-white">Intrus Éclair</h1>
            <p className="text-xs text-white/80 font-semibold">Attention sélective — Discrimination visuelle · 6-10 ans</p>
          </div>
        </div>

        <div className="p-5">
          <div className="bg-[#BFE3F5] rounded-2xl p-4 mb-5 text-sm text-[#1A5F7A] font-semibold leading-relaxed">
            👁️ Ce jeu entraîne ton <strong>attention sélective</strong> — la capacité à repérer rapidement ce qui est différent parmi un groupe !
          </div>
          <IntrusEclair />
        </div>
      </motion.div>
    </div>
  );
}