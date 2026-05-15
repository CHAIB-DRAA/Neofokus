"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

function getWeekLabel(locale: string): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.getFullYear(), d.getMonth(), diff);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (dt: Date) =>
    dt.toLocaleDateString(locale, { day: "numeric", month: "short" });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

const MAX_STARS = 50;

export default function StarsBar() {
  const { stars, badges, checkWeekReset } = useQuestStore();
  const t = useTranslations("starsBar");
  const locale = useLocale();

  useEffect(() => {
    checkWeekReset();
  }, []);

  const pct = Math.min((stars / MAX_STARS) * 100, 100);
  const isMax = stars >= MAX_STARS;

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>

      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-bold text-[#7A8BA0] uppercase tracking-widest">
          {t("title")}
        </div>
        <div className="text-[10px] font-semibold text-[#B0B8C4]">
          {getWeekLabel(locale)}
        </div>
      </div>

      <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2.5">
        <motion.div
          className="h-full rounded-full"
          style={{ background: isMax
            ? "linear-gradient(90deg, #5CC7A0, #3A9FD4)"
            : "linear-gradient(90deg, #FFD93D, #FF922B)"
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-lg font-extrabold"
          style={{ color: isMax ? "#3A9FD4" : "#FF922B" }}>
          ⭐ {stars} / {MAX_STARS}
        </span>

        {badges.length === 0 ? (
          <span className="text-[10px] font-semibold text-[#B0B8C4] italic">
            {t("noBadges")}
          </span>
        ) : (
          <div className="flex gap-1.5 flex-wrap justify-end">
            {badges.map((badge, i) => (
              <motion.span
                key={badge}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#BFE3F5] text-[#1A5F7A]"
              >
                {badge}
              </motion.span>
            ))}
          </div>
        )}
      </div>

      {isMax && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-center text-xs font-extrabold text-[#3A9FD4]"
        >
          {t("weekDone")}
        </motion.div>
      )}
    </div>
  );
}
