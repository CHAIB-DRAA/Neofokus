"use client";

import { Link } from "@/lib/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import RythmeEcho from "@/components/games/RythmeEcho";
import { useTranslations } from "next-intl";

export default function RythmePage() {
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
        className="bg-white rounded-3xl overflow-hidden border-2 border-[#E05050]"
        style={{ boxShadow: "0 4px 20px rgba(224,80,80,0.15)" }}
      >
        <div className="flex items-center gap-3 px-5 py-4"
          style={{ background: "linear-gradient(135deg, #E05050, #FF922B)" }}>
          <span className="text-2xl">🥁</span>
          <div>
            <h1 className="font-display text-lg font-extrabold text-white">Echo Rhythm</h1>
            <p className="text-xs text-white/80 font-semibold">{t("rythme.subtitle")}</p>
          </div>
        </div>

        <div className="p-5">
          <div className="bg-[#FDECEA] rounded-2xl p-4 mb-5 text-sm text-[#C02020] font-semibold leading-relaxed">
            🥁 {t("rythme.tip")}
          </div>
          <RythmeEcho />
        </div>
      </motion.div>
    </div>
  );
}
