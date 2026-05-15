"use client";
import { Link } from "@/lib/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import LectureCouleurs from "@/components/games/LectureCouleurs";

export default function LecturePage() {
  return (
    <div>
      <Link href="/explorateur" className="inline-flex items-center gap-2 text-sm font-bold
        text-[#7A8BA0] hover:text-[#1A5F7A] mb-4 transition-colors">
        <ArrowLeft size={14} /> Retour
      </Link>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl overflow-hidden border-2"
        style={{ borderColor: "#1A5F7A", boxShadow: "0 4px 20px rgba(26,95,122,0.12)" }}>
        <div className="flex items-center gap-3 px-5 py-4"
          style={{ background: "linear-gradient(135deg, #1A5F7A, #5B9CF6)" }}>
          <span className="text-2xl">🌈</span>
          <div>
            <h1 className="font-display text-lg font-extrabold text-white">Lecture Couleurs</h1>
            <p className="text-xs text-white/80 font-semibold">Méthode bicolore — Décodage syllabique · 6-10 ans</p>
          </div>
        </div>
        <div className="p-5">
          <div className="bg-[#E8F7FF] rounded-2xl p-4 mb-5 text-sm text-[#1A5F7A] font-semibold leading-relaxed">
            🌈 Les syllabes alternent en <strong style={{ color: "#1A5F7A" }}>bleu</strong> et <strong style={{ color: "#E05050" }}>rouge</strong> pour aider ton cerveau à découper les mots. Lis à voix haute !
          </div>
          <LectureCouleurs />
        </div>
      </motion.div>
    </div>
  );
}