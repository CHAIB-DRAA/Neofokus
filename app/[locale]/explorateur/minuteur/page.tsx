"use client";

import { Link } from "@/lib/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import DefMinuteur from "@/components/games/DefMinuteur";
import { useTranslations } from "next-intl";

export default function DefMinuteurPage() {
  const t = useTranslations("gamePages");
  const tg = useTranslations("game");
  return (
    <div>
      <Link href="/explorateur" className="inline-flex items-center gap-2 text-sm font-bold
        text-[#7A8BA0] hover:text-[#1A5F7A] mb-4 transition-colors">
        <ArrowLeft size={14} /> {tg("back_short")}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl overflow-hidden border-2 border-[#FFD93D]"
        style={{ boxShadow: "0 4px 20px rgba(255,217,61,0.2)" }}
      >
        <div className="flex items-center gap-3 px-5 py-4"
          style={{ background: "linear-gradient(135deg, #FFF3E0, #FFD93D)" }}>
          <span className="text-2xl">⏱️</span>
          <div>
            <h1 className="font-display text-lg font-extrabold text-[#7A4200]">Timer Challenge</h1>
            <p className="text-xs text-[#9C6800] font-semibold">{t("minuteur.subtitle")}</p>
          </div>
        </div>

        <div className="p-5">
          <div className="bg-[#FFF3E0] rounded-2xl p-4 mb-5 text-sm text-[#7A4200] font-semibold leading-relaxed">
            💡 {t("minuteur.tip")}
          </div>
          <DefMinuteur />
        </div>
      </motion.div>
    </div>
  );
}
