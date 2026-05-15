"use client";

import { Link } from "@/lib/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import StopSignalGame from "@/components/games/StopSignal";
import { useTranslations } from "next-intl";

export default function SignalStopPage() {
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
        className="bg-white rounded-3xl overflow-hidden border-2 border-[#7DC4E8]"
        style={{ boxShadow: "0 4px 20px rgba(125,196,232,0.15)" }}
      >
        <div className="flex items-center gap-3 px-5 py-4"
          style={{ background: "linear-gradient(135deg, #7DC4E8, #BFE3F5)" }}>
          <span className="text-2xl">🛑</span>
          <div>
            <h1 className="font-display text-lg font-extrabold text-white">Signal Stop</h1>
            <p className="text-xs text-white/80 font-semibold">{t("signal-stop.subtitle")}</p>
          </div>
        </div>

        <div className="p-5">
          <div className="bg-[#E8F7FF] rounded-2xl p-4 mb-5 text-sm text-[#1A5F7A] font-semibold leading-relaxed">
            💡 {t("signal-stop.tip")}
          </div>
          <StopSignalGame />
        </div>
      </motion.div>
    </div>
  );
}
