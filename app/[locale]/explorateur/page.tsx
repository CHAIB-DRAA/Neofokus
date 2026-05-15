"use client";

import { motion, AnimatePresence } from "framer-motion";
import QuestPanel from "@/components/quest/QuestPanel";
import StarsBar from "@/components/quest/StarsBar";
import ThermometreEmotionnel from "@/components/games/ThermometreEmotionnel";
import { useProfileStore } from "@/lib/useProfileStore";
import { useState } from "react";
import ProfileSelector from "@/components/profile/ProfileSelector";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";

type GameSlug = string;

type GameData = {
  slug: GameSlug;
  icon: string;
  bgColor: string;
  tag: string;
  tagColor: string;
  minAge: number;
  maxAge: number | null;
};

type SectionData = {
  key: string;
  emoji: string;
  games: GameData[];
};

const ALL_SECTIONS: SectionData[] = [
  {
    key: "inhibition",
    emoji: "🛑",
    games: [
      { slug: "signal-stop", icon: "🛑", bgColor: "#BFE3F5", tag: "Inhibition",   tagColor: "#1A5F7A", minAge: 6, maxAge: null },
      { slug: "sabr",        icon: "🌱", bgColor: "#B8EDD9", tag: "Patience",     tagColor: "#0F5C3A", minAge: 7, maxAge: null },
      { slug: "stroop",      icon: "🎨", bgColor: "#E8E0F8", tag: "Stroop",       tagColor: "#3D1F8A", minAge: 9, maxAge: null },
    ],
  },
  {
    key: "attention",
    emoji: "🎯",
    games: [
      { slug: "minuteur",  icon: "⏱️", bgColor: "#FFF3CD", tag: "Focus",     tagColor: "#7A4200", minAge: 7, maxAge: null },
      { slug: "intrus",    icon: "🔍", bgColor: "#BFE3F5", tag: "Sélective", tagColor: "#1A5F7A", minAge: 6, maxAge: null },
      { slug: "vigilance", icon: "🎯", bgColor: "#DBEAFE", tag: "Soutenue",  tagColor: "#1A4FA0", minAge: 7, maxAge: null },
      { slug: "chrono",    icon: "⌛", bgColor: "#BFE3F5", tag: "Temps",     tagColor: "#1A5F7A", minAge: 8, maxAge: null },
    ],
  },
  {
    key: "memory",
    emoji: "🧠",
    games: [
      { slug: "memoire",     icon: "🧠", bgColor: "#D0C8FA", tag: "Séquence",    tagColor: "#3D1F8A", minAge: 6, maxAge: null },
      { slug: "paires",      icon: "🃏", bgColor: "#FFE0B2", tag: "Visuelle",    tagColor: "#9C4400", minAge: 5, maxAge: null },
      { slug: "chiffres",    icon: "👻", bgColor: "#F0F4F8", tag: "Numérique",   tagColor: "#1E2A38", minAge: 8, maxAge: null },
      { slug: "grille",      icon: "🟦", bgColor: "#DBEAFE", tag: "Spatial",     tagColor: "#1A4FA0", minAge: 8, maxAge: null },
      { slug: "dhikr",       icon: "💡", bgColor: "#E8E0F8", tag: "Travail",     tagColor: "#3D1F8A", minAge: 7, maxAge: null },
      { slug: "nujum",       icon: "🌌", bgColor: "#BFE3F5", tag: "Spatial",     tagColor: "#1A5F7A", minAge: 9, maxAge: null },
      { slug: "mot-mystere", icon: "🔤", bgColor: "#B8EDD9", tag: "Orthographe", tagColor: "#0F5C3A", minAge: 8, maxAge: null },
    ],
  },
  {
    key: "flexibility",
    emoji: "🔀",
    games: [
      { slug: "rythme",     icon: "🥁", bgColor: "#FDECEA", tag: "Rythme",       tagColor: "#C02020", minAge: 7, maxAge: null },
      { slug: "tri-eclair", icon: "⚡", bgColor: "#C8F7D4", tag: "Flexibilité",  tagColor: "#0F5C3A", minAge: 7, maxAge: null },
      { slug: "mizan",      icon: "⚖️", bgColor: "#FFF9C4", tag: "Set-shifting", tagColor: "#9C6800", minAge: 7, maxAge: null },
      { slug: "contraires", icon: "🔀", bgColor: "#FDECEA", tag: "Vitesse",      tagColor: "#C02020", minAge: 8, maxAge: null },
    ],
  },
  {
    key: "organisation",
    emoji: "📅",
    games: [
      { slug: "mission-ordre", icon: "📋", bgColor: "#E8E0F8", tag: "Séquençage",   tagColor: "#3D1F8A", minAge: 6, maxAge: null },
      { slug: "puzzle",        icon: "🧩", bgColor: "#DBEAFE", tag: "Planification", tagColor: "#1A4FA0", minAge: 7, maxAge: null },
      { slug: "quete",         icon: "🗺️", bgColor: "#B8EDD9", tag: "Organisation",  tagColor: "#0F5C3A", minAge: 7, maxAge: null },
    ],
  },
  {
    key: "emotions",
    emoji: "😊",
    games: [
      { slug: "emotions",   icon: "🔍", bgColor: "#B8EDD9", tag: "Empathie",   tagColor: "#0F5C3A", minAge: 6, maxAge: null },
      { slug: "bulle",      icon: "🧘", bgColor: "#E8E0F8", tag: "Régulation", tagColor: "#3D1F8A", minAge: 4, maxAge: null },
      { slug: "scan-relax", icon: "🌊", bgColor: "#BFE3F5", tag: "Relaxation", tagColor: "#1A5F7A", minAge: 6, maxAge: null },
    ],
  },
  {
    key: "reading",
    emoji: "📖",
    games: [
      { slug: "syllabes", icon: "🥁", bgColor: "#DBEAFE", tag: "Phonologie",  tagColor: "#1A4FA0", minAge: 5, maxAge: null },
      { slug: "lecture",  icon: "🌈", bgColor: "#E8F7FF", tag: "Décodage",    tagColor: "#1A5F7A", minAge: 5, maxAge: null },
      { slug: "dictee",   icon: "✨", bgColor: "#B8EDD9", tag: "Orthographe", tagColor: "#0F5C3A", minAge: 8, maxAge: null },
    ],
  },
  {
    key: "creativity",
    emoji: "🎨",
    games: [
      { slug: "couleurs", icon: "🎨", bgColor: "#FFF9C4", tag: "Visuel",    tagColor: "#9C6800", minAge: 4,  maxAge: 8    },
      { slug: "bouge",    icon: "🤸", bgColor: "#B8EDD9", tag: "Mouvement", tagColor: "#0F5C3A", minAge: 4,  maxAge: 10   },
      { slug: "creatif",  icon: "✍️", bgColor: "#E8E0F8", tag: "Créativité", tagColor: "#3D1F8A", minAge: 10, maxAge: null },
    ],
  },
];

function filterByAge(games: GameData[], age: number): GameData[] {
  return games.filter((g) => age >= g.minAge && (g.maxAge === null || age <= g.maxAge));
}

function GameCard({ game, delay = 0, tg }: { game: GameData; delay?: number; tg: ReturnType<typeof useTranslations> }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Link href={`/explorateur/${game.slug}`}>
        <div
          className="bg-white rounded-2xl p-4 border border-gray-100 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200"
          style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: game.bgColor }}>
              {game.icon}
            </div>
            <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
              style={{ background: game.bgColor, color: game.tagColor }}>{game.tag}</span>
          </div>
          <div className="font-display text-sm font-bold text-[#1E2A38] mb-1 leading-tight">
            {tg(`games.${game.slug}.name`)}
          </div>
          <div className="text-xs text-[#7A8BA0] leading-snug">
            {tg(`games.${game.slug}.desc`)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ExplorateurPage() {
  const { profiles, currentProfileId } = useProfileStore();
  const profile = profiles.find((p) => p.id === currentProfileId);
  const age = profile?.age ?? null;
  const [showAgeModal, setShowAgeModal] = useState(false);
  const t = useTranslations("explorer");

  const totalGames = age !== null
    ? ALL_SECTIONS.reduce((n, s) => n + filterByAge(s.games, age).length, 0)
    : 0;

  return (
    <div className="space-y-5">

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 rounded-3xl p-5 border border-[#7DC4E8]/30"
        style={{ background: "linear-gradient(135deg, #E8F7FF 0%, #DFFFEF 100%)" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${profile?.color ?? "#7DC4E8"}, #5CC7A0)` }}>
          {profile?.avatar ?? "🦊"}
        </div>
        <div className="flex-1">
          <div className="font-display text-xl font-extrabold text-[#1A5F7A]">
            {profile?.name ?? "Champion·ne"} ✨
          </div>
          <div className="text-sm text-[#4A5568] mt-0.5">
            {age !== null
              ? t("heroGames", { count: totalGames })
              : t("alertNoAge")}
          </div>
        </div>
      </motion.div>

      {/* Âge non défini */}
      <AnimatePresence>
        {age === null && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl p-4 flex items-center gap-3 border-2 border-[#FF922B]"
            style={{ background: "#FFF3E0" }}>
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <div className="font-display text-sm font-extrabold text-[#9C4400]">{t("alertNoAge")}</div>
              <div className="text-xs text-[#7A4200] font-semibold">{t("alertNoAgeDesc")}</div>
            </div>
            <button
              onClick={() => setShowAgeModal(true)}
              className="flex-shrink-0 px-3 py-2 rounded-xl font-display font-extrabold text-white text-xs"
              style={{ background: "linear-gradient(135deg, #FF922B, #FFD93D)" }}>
              {t("setAge")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {showAgeModal && <ProfileSelector onClose={() => setShowAgeModal(false)} />}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <StarsBar />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}>
        <ThermometreEmotionnel />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <Link href="/explorateur/superpouvoirs">
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border-2 border-[#FFD93D]
            hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer"
            style={{ background: "linear-gradient(135deg, #FFF9C4, #FFE0B2)" }}>
            <span className="text-2xl">🦸</span>
            <div className="flex-1">
              <div className="font-display text-sm font-extrabold text-[#9C6800]">Mes Super-Pouvoirs TDAH</div>
              <div className="text-xs text-[#7A4200] font-semibold">Découvre ce que ton cerveau a de spécial ✨</div>
            </div>
            <span className="text-[#FFD93D] text-lg">→</span>
          </div>
        </Link>
      </motion.div>

      {/* Sections */}
      {age !== null ? (
        ALL_SECTIONS.map((section, si) => {
          const filtered = filterByAge(section.games, age);
          if (filtered.length === 0) return null;
          const sectionName = t(`sections.${section.key}`);
          const sectionDesc = section.key !== "creativity" ? t(`sections.${section.key}Desc`) : "";
          return (
            <motion.div key={section.key}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + si * 0.04 }}>
              <h2 className="font-display text-base font-bold text-[#1E2A38] mb-0.5">{sectionName}</h2>
              {sectionDesc && <p className="text-xs text-[#7A8BA0] font-semibold mb-3">{sectionDesc}</p>}
              <div className="grid grid-cols-2 gap-3">
                {filtered.map((game, gi) => (
                  <GameCard key={game.slug} game={game} delay={0.18 + si * 0.04 + gi * 0.04} tg={t} />
                ))}
              </div>
            </motion.div>
          );
        })
      ) : (
        <div className="space-y-4 opacity-40 pointer-events-none select-none">
          {ALL_SECTIONS.map((section) => (
            <div key={section.key}>
              <h2 className="font-display text-base font-bold text-[#1E2A38] mb-0.5">
                {t(`sections.${section.key}`)}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {section.games.map((game) => (
                  <div key={game.slug} className="bg-white rounded-2xl p-4 border border-gray-100">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3"
                      style={{ background: game.bgColor }}>{game.icon}</div>
                    <div className="font-display text-sm font-bold text-[#1E2A38] mb-1">
                      {t(`games.${game.slug}.name`)}
                    </div>
                    <div className="text-xs text-[#7A8BA0]">{t(`games.${game.slug}.desc`)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
