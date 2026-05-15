"use client";

import { Link } from "@/lib/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import DefiCreatif from "@/components/games/DefiCreatif";
import { useTranslations } from "next-intl";

export default function CreatifPage() {
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
        className="bg-white rounded-3xl overflow-hidden border-2 border-[#8E72DB]"
        style={{ boxShadow: "0 4px 20px rgba(142,114,219,0.15)" }}
      >
        <div className="flex items-center gap-3 px-5 py-4"
          style={{ background: "linear-gradient(135deg, #8E72DB, #C084FC)" }}>
          <span className="text-2xl">✍️</span>
          <div>
            <h1 className="font-display text-lg font-extrabold text-white">Creative Challenge</h1>
            <p className="text-xs text-white/80 font-semibold">{t("creatif.subtitle")}</p>
          </div>
        </div>

        <div className="p-5">
          <div className="bg-[#E8E0F8] rounded-2xl p-4 mb-5 text-sm text-[#3D1F8A] font-semibold leading-relaxed">
            ✨ {t("creatif.tip")}
          </div>
          <DefiCreatif />
        </div>
      </motion.div>
    </div>
  );
}
