"use client";

import { Link } from "@/lib/navigation";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

const POWERS_META = [
  { id: "hyperfocus",  icon: "🎯", color: "#FF922B", bg: "#FFE0B2" },
  { id: "creativite",  icon: "🎨", color: "#8E72DB", bg: "#E8E0F8" },
  { id: "energie",     icon: "⚡", color: "#FFD93D", bg: "#FFF9C4" },
  { id: "empathie",    icon: "💙", color: "#5B9CF6", bg: "#DBEAFE" },
  { id: "resilience",  icon: "💪", color: "#5CC7A0", bg: "#B8EDD9" },
  { id: "spontaneite", icon: "🚀", color: "#E05050", bg: "#FDECEA" },
];

export default function SuperpouvoirsPage() {
  const [open, setOpen] = useState<string | null>(null);
  const t = useTranslations("powers");
  const tg = useTranslations("game");

  return (
    <div>
      <Link href="/explorateur" className="inline-flex items-center gap-2 text-sm font-bold
        text-[#7A8BA0] hover:text-[#1A5F7A] mb-4 transition-colors">
        <ArrowLeft size={14} /> {tg("back_short")}
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl overflow-hidden border-2 border-[#FFD93D]"
        style={{ background: "linear-gradient(135deg, #FFF9C4, #FFE0B2)", boxShadow: "0 4px 20px rgba(255,217,61,0.2)" }}>
        <div className="px-5 py-5">
          <div className="text-4xl mb-2">🦸</div>
          <h1 className="font-display text-2xl font-extrabold text-[#1E2A38] mb-1">
            {t("pageTitle")}
          </h1>
          <p className="text-sm text-[#7A4200] font-semibold">
            {t("pageSubtitle")}
          </p>
        </div>
      </motion.div>

      <div className="mt-4 space-y-3">
        {POWERS_META.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <button
              onClick={() => setOpen(open === p.id ? null : p.id)}
              className="w-full text-left bg-white rounded-2xl border-2 transition-all"
              style={{
                borderColor: open === p.id ? p.color : "#E2E8F0",
                boxShadow: open === p.id ? `0 4px 16px ${p.color}33` : "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: p.bg }}>
                  {p.icon}
                </div>
                <div className="flex-1">
                  <div className="font-display text-base font-extrabold" style={{ color: p.color }}>
                    {t(`${p.id}.nom`)}
                  </div>
                  <div className="text-xs font-semibold text-[#7A8BA0]">{t(`${p.id}.tagline`)}</div>
                </div>
                <div className="text-lg" style={{ color: p.color }}>
                  {open === p.id ? "▲" : "▼"}
                </div>
              </div>

              <AnimatePresence>
                {open === p.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      <div className="text-sm text-[#1E2A38] font-semibold leading-relaxed"
                        style={{ borderLeft: `3px solid ${p.color}`, paddingLeft: 12 }}>
                        {t(`${p.id}.description`)}
                      </div>

                      <div>
                        <div className="text-[10px] font-extrabold uppercase tracking-wider mb-2"
                          style={{ color: p.color }}>
                          {t("usageLabel")}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(t.raw(`${p.id}.exemples`) as string[]).map((ex: string) => (
                            <span key={ex} className="text-xs font-bold px-2.5 py-1 rounded-full"
                              style={{ background: p.bg, color: p.color }}>
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#F8F6F0] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#4A5568]">
                        🔬 {t(`${p.id}.science`)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="mt-5 bg-white rounded-3xl p-5 border-2 border-[#5CC7A0] text-center">
        <div className="text-3xl mb-2">🌟</div>
        <div className="font-display text-base font-extrabold text-[#1E2A38] mb-1">
          {t("closingTitle")}
        </div>
        <div className="text-sm text-[#7A8BA0] font-semibold">
          {t("closingDesc")}
        </div>
      </motion.div>
    </div>
  );
}
