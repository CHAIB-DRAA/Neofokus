"use client";

import { Link } from "@/lib/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import TriEclair from "@/components/games/TriEclair";
import { useTranslations } from "next-intl";

export default function TriEclairPage() {
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
        className="bg-white rounded-3xl overflow-hidden border-2 border-[#5CC7A0]"
        style={{ boxShadow: "0 4px 20px rgba(92,199,160,0.15)" }}
      >
        <div className="flex items-center gap-3 px-5 py-4"
          style={{ background: "linear-gradient(135deg, #B8EDD9, #BFE3F5)" }}>
          <span className="text-2xl">⚡</span>
          <div>
            <h1 className="font-display text-lg font-extrabold text-[#0F5C3A]">Flash Sort</h1>
            <p className="text-xs text-[#1A5F7A] font-semibold">{t("tri-eclair.subtitle")}</p>
          </div>
        </div>

        <div className="p-5">
          <div className="bg-[#B8EDD9] rounded-2xl p-4 mb-5 text-sm text-[#0F5C3A] font-semibold leading-relaxed">
            ⚡ {t("tri-eclair.tip")}
          </div>
          <TriEclair />
        </div>
      </motion.div>
    </div>
  );
}
