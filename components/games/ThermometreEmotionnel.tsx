"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";

type EtatId = "calme" | "energique" | "stresse" | "triste" | "agite";

const STATES_META: {
  id: EtatId;
  emoji: string;
  color: string;
  bg: string;
  activites: { slug: string; icon: string }[];
}[] = [
  { id: "calme",     emoji: "😌", color: "#5CC7A0", bg: "#B8EDD9", activites: [{ slug: "signal-stop", icon: "🛑" }, { slug: "tri-eclair", icon: "⚡" }] },
  { id: "energique", emoji: "⚡", color: "#FF922B", bg: "#FFE0B2", activites: [{ slug: "bouge",       icon: "🤸" }, { slug: "rythme",    icon: "🥁" }] },
  { id: "stresse",   emoji: "😤", color: "#8E72DB", bg: "#E8E0F8", activites: [{ slug: "bulle",       icon: "🧘" }, { slug: "bouge",     icon: "🤸" }] },
  { id: "triste",    emoji: "😢", color: "#5B9CF6", bg: "#DBEAFE", activites: [{ slug: "bulle",       icon: "🧘" }, { slug: "creatif",   icon: "✍️" }] },
  { id: "agite",     emoji: "🌀", color: "#E05050", bg: "#FDECEA", activites: [{ slug: "bouge",       icon: "🤸" }, { slug: "signal-stop", icon: "🛑" }] },
];

export default function ThermometreEmotionnel() {
  const [selected, setSelected] = useState<EtatId | null>(null);
  const tt = useTranslations("thermostat");
  const tg = useTranslations("explorer");
  const meta = STATES_META.find((e) => e.id === selected) ?? null;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div className="px-5 pt-4 pb-3">
        <div className="font-display text-sm font-extrabold text-[#1E2A38] mb-0.5">
          {tt("title")}
        </div>
        <div className="text-xs text-[#7A8BA0] font-semibold">
          {tt("subtitle")}
        </div>
      </div>

      <div className="flex gap-2 px-5 pb-4 overflow-x-auto">
        {STATES_META.map((e) => (
          <motion.button
            key={e.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelected(selected === e.id ? null : e.id)}
            className="flex flex-col items-center gap-1 py-2.5 px-3 rounded-2xl border-2 flex-shrink-0 transition-all"
            style={{
              borderColor: selected === e.id ? e.color : "#E2E8F0",
              background: selected === e.id ? e.bg : "transparent",
              minWidth: 60,
            }}
          >
            <span className="text-2xl">{e.emoji}</span>
            <span className="text-[10px] font-extrabold"
              style={{ color: selected === e.id ? e.color : "#7A8BA0" }}>
              {tt(`${e.id}.label`)}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {meta && (
          <motion.div
            key={meta.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mx-4 mb-4 rounded-2xl p-4 space-y-3"
              style={{ background: meta.bg }}>
              <div className="text-sm font-bold" style={{ color: meta.color }}>
                {meta.emoji} {tt(`${meta.id}.message`)}
              </div>
              <div className="text-xs font-semibold text-[#4A5568] bg-white/70 rounded-xl px-3 py-2">
                🔬 {tt(`${meta.id}.science`)}
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider mb-2"
                  style={{ color: meta.color }}>
                  {tt("recommended")}
                </div>
                <div className="flex gap-2">
                  {meta.activites.map((a) => (
                    <Link key={a.slug} href={`/explorateur/${a.slug}`}
                      className="flex-1 flex items-center gap-2 bg-white rounded-xl px-3 py-2.5
                        border-2 hover:shadow-sm transition-all"
                      style={{ borderColor: meta.color + "44" }}>
                      <span className="text-lg">{a.icon}</span>
                      <span className="text-xs font-bold text-[#1E2A38]">{tg(`games.${a.slug}.name`)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
