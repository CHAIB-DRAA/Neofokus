"use client";

import { motion } from "framer-motion";
import AdviceCard from "@/components/parent/AdviceCard";
import CrisisPanel from "@/components/parent/CrisisPanel";
import RoutineBuilder from "@/components/parent/RoutineBuilder";
import { useTranslations } from "next-intl";

const CARD_KEYS = [
  { key: "brain",         href: "/parents/cerveau",       emoji: "🧠", tag: "Neurosciences", tagStyle: { background: "#E8E0F8", color: "#3D1F8A" }, accentColor: "#8E72DB" },
  { key: "communication", href: "/parents/communication",  emoji: "💬", tag: "Communication",  tagStyle: { background: "#B8EDD9", color: "#0F5C3A" }, accentColor: "#5CC7A0" },
  { key: "crisis",        href: "/parents/crise",          emoji: "🌊", tag: "Urgence",         tagStyle: { background: "#FDECEA", color: "#7A1F1F" }, accentColor: "#E05050" },
  { key: "routine",       href: "/parents/routine",        emoji: "📅", tag: "Routine",         tagStyle: { background: "#FFF3E0", color: "#7A4200" }, accentColor: "#FF922B" },
  { key: "rewards",       href: "/parents/recompenses",    emoji: "🏆", tag: "Comportement",   tagStyle: { background: "#FFF9C4", color: "#9C6800" }, accentColor: "#FFD93D" },
  { key: "reading",       href: "/parents/lire-ecrire",    emoji: "📖", tag: "Apprentissage",  tagStyle: { background: "#DBEAFE", color: "#1A4FA0" }, accentColor: "#5B9CF6" },
] as const;

export default function ParentsPage() {
  const t = useTranslations("parents");

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 rounded-3xl p-5 border border-[#8E72DB]/25"
        style={{ background: "linear-gradient(135deg, #EDE8FC 0%, #E0EDFF 100%)" }}
      >
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #8E72DB, #5B8EDB)" }}>🏠</div>
        <div>
          <div className="font-display text-xl font-extrabold text-[#3D1F8A]">{t("heroTitle")}</div>
          <div className="text-sm text-[#5B4082] mt-0.5 font-medium">{t("heroSubtitle")}</div>
        </div>
      </motion.div>

      <div>
        <h2 className="font-display text-base font-bold text-[#1E2A38] mb-3">{t("modulesTitle")}</h2>
        <div className="grid grid-cols-2 gap-3">
          {CARD_KEYS.map((card, i) => (
            <AdviceCard
              key={card.key}
              href={card.href}
              emoji={card.emoji}
              tag={card.tag}
              tagStyle={card.tagStyle}
              title={t(`cards.${card.key}.title`)}
              preview={t(`cards.${card.key}.preview`)}
              accentColor={card.accentColor}
              index={i}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-base font-bold text-[#1E2A38] mb-3">{t("crisisTitle")}</h2>
        <CrisisPanel />
      </div>

      <div>
        <h2 className="font-display text-base font-bold text-[#1E2A38] mb-3">{t("routineTitle")}</h2>
        <RoutineBuilder />
      </div>
    </div>
  );
}
