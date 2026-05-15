"use client";

import { Link } from "@/lib/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import MemoireFlash from "@/components/games/MemoireFlash";
import { useTranslations } from "next-intl";

export default function MemoirePage() {
  const t = useTranslations("gamePages");
  const tg = useTranslations("game");
  return (
    <div>
      <Link href="/explorateur" className="inline-flex items-center gap-2 text-sm font-bold
        text-[#7A8BA0] hover:text-[#3D1F8A] mb-4 transition-colors">
        <ArrowLeft size={14} /> {tg("back_short")}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl overflow-hidden border-2 border-[#B8A8F0]"
        style={{ boxShadow: "0 4px 20px rgba(142,114,219,0.15)" }}
      >
        <div className="flex items-center gap-3 px-5 py-4"
          style={{ background: "linear-gradient(135deg, #E8E0F8, #D0C8FA)" }}>
          <span className="text-2xl">🧠</span>
          <div>
            <h1 className="font-display text-lg font-extrabold text-[#3D1F8A]">Flash Memory</h1>
            <p className="text-xs text-[#5B4082] font-semibold">{t("memoire.subtitle")}</p>
          </div>
        </div>

        <div className="p-5">
          <div className="bg-[#E8E0F8] rounded-2xl p-4 mb-5 text-sm text-[#3D1F8A] font-semibold leading-relaxed">
            🧩 {t("memoire.tip")}
          </div>
          <MemoireFlash />
        </div>
      </motion.div>
    </div>
  );
}
