"use client";

import { motion } from "framer-motion";
import { Rocket, Home, Star, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";

export default function LandingPage() {
  const t = useTranslations("home");

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-7xl mb-4">🧠</div>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-[#1E2A38] mb-3">
          {t("welcome")}{" "}
          <span className="text-[#1A5F7A]">Néo</span>
          <span className="text-[#5CC7A0]">Fokus</span>
        </h1>
        <p className="text-[#4A5568] text-lg font-medium max-w-md mx-auto mb-10 leading-relaxed">
          {t("tagline")}
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <Link href="/explorateur">
          <div className="group cursor-pointer bg-white rounded-3xl p-7 border-2 border-transparent
            hover:border-[#5CC7A0] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg text-left"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
              style={{ background: "linear-gradient(135deg, #BFE3F5, #B8EDD9)" }}>🚀</div>
            <h2 className="font-display text-xl font-bold text-[#1E2A38] mb-2">{t("explorerTitle")}</h2>
            <p className="text-sm text-[#7A8BA0] leading-relaxed">{t("explorerDesc")}</p>
            <div className="mt-4 flex items-center gap-1 text-[#5CC7A0] text-sm font-bold">
              <Rocket size={14} /> {t("enterExplorer")}
            </div>
          </div>
        </Link>

        <Link href="/parents">
          <div className="group cursor-pointer bg-white rounded-3xl p-7 border-2 border-transparent
            hover:border-[#8E72DB] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg text-left"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
              style={{ background: "linear-gradient(135deg, #E8E0F8, #E0EDFF)" }}>🏠</div>
            <h2 className="font-display text-xl font-bold text-[#1E2A38] mb-2">{t("parentsTitle")}</h2>
            <p className="text-sm text-[#7A8BA0] leading-relaxed">{t("parentsDesc")}</p>
            <div className="mt-4 flex items-center gap-1 text-[#8E72DB] text-sm font-bold">
              <Home size={14} /> {t("enterParents")}
            </div>
          </div>
        </Link>
      </motion.div>

      <motion.div
        className="mt-10 flex flex-wrap justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {(["badge1", "badge2", "badge3"] as const).map((key, i) => (
          <div key={key} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-xs
            font-semibold text-[#4A5568] border border-gray-100">
            <span className="text-[#5CC7A0]">
              {i === 0 ? <Star size={13} /> : i === 1 ? <Heart size={13} /> : <Rocket size={13} />}
            </span>
            {t(key)}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
