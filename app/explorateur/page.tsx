"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import QuestPanel from "@/components/quest/QuestPanel";
import StarsBar from "@/components/quest/StarsBar";
import ThermometreEmotionnel from "@/components/games/ThermometreEmotionnel";

type Game = {
  href: string;
  icon: string;
  bgColor: string;
  name: string;
  desc: string;
  tag: string;
  tagColor: string;
  age?: string;
};

const GAMES: Game[] = [
  {
    href: "/explorateur/signal-stop",
    icon: "🛑",
    bgColor: "#BFE3F5",
    name: "Signal Stop",
    desc: "Entraîne ton frein magique !",
    tag: "Inhibition",
    tagColor: "#1A5F7A",
  },
  {
    href: "#quest",
    icon: "🗺️",
    bgColor: "#B8EDD9",
    name: "Quête en 3 pas",
    desc: "Divise ton grand défi",
    tag: "Planification",
    tagColor: "#0F5C3A",
  },
  {
    href: "/explorateur/minuteur",
    icon: "⏱️",
    bgColor: "#FFF3CD",
    name: "Défi Minuteur",
    desc: "Focus total, mission choisie",
    tag: "Concentration",
    tagColor: "#7A4200",
  },
  {
    href: "/explorateur/bulle",
    icon: "🧘",
    bgColor: "#E8E0F8",
    name: "Bulle de calme",
    desc: "Respiration guidée animée",
    tag: "Régulation",
    tagColor: "#3D1F8A",
  },
  {
    href: "/explorateur/memoire",
    icon: "🧠",
    bgColor: "#D0C8FA",
    name: "Mémoire Flash",
    desc: "Mémorise la séquence !",
    tag: "Mémoire",
    tagColor: "#3D1F8A",
  },
  {
    href: "/explorateur/tri-eclair",
    icon: "⚡",
    bgColor: "#C8F7D4",
    name: "Tri Éclair",
    desc: "Classe les émojis vite !",
    tag: "Flexibilité",
    tagColor: "#0F5C3A",
  },
];

const NEW_GAMES: Game[] = [
  {
    href: "/explorateur/couleurs",
    icon: "🎨",
    bgColor: "#FFF9C4",
    name: "Couleurs Rigolos",
    desc: "Trouve la bonne couleur !",
    tag: "Visuel",
    tagColor: "#9C6800",
    age: "3-5 ans",
  },
  {
    href: "/explorateur/paires",
    icon: "🃏",
    bgColor: "#FFE0B2",
    name: "Paires Magiques",
    desc: "Retourne et associe les cartes",
    tag: "Mémoire",
    tagColor: "#9C4400",
    age: "6-8 ans",
  },
  {
    href: "/explorateur/rythme",
    icon: "🥁",
    bgColor: "#FDECEA",
    name: "Rythme Écho",
    desc: "Simon Says de couleurs",
    tag: "Rythme",
    tagColor: "#C02020",
    age: "9-12 ans",
  },
  {
    href: "/explorateur/creatif",
    icon: "✍️",
    bgColor: "#E8E0F8",
    name: "Défi Créatif",
    desc: "Écris sans te retenir !",
    tag: "Créativité",
    tagColor: "#3D1F8A",
    age: "13+ ans",
  },
  {
    href: "/explorateur/intrus",
    icon: "🔍",
    bgColor: "#BFE3F5",
    name: "Intrus Éclair",
    desc: "Trouve l'émoji qui ne va pas !",
    tag: "Attention",
    tagColor: "#1A5F7A",
    age: "6-10 ans",
  },
  {
    href: "/explorateur/grille",
    icon: "🟦",
    bgColor: "#DBEAFE",
    name: "Grille Mémoire",
    desc: "Reproduis la grille colorée",
    tag: "Spatial",
    tagColor: "#1A4FA0",
    age: "9-13 ans",
  },
  {
    href: "/explorateur/chiffres",
    icon: "👻",
    bgColor: "#F0F4F8",
    name: "Chiffres Fantômes",
    desc: "Rappelle la séquence de chiffres",
    tag: "Numérique",
    tagColor: "#1E2A38",
    age: "8-12 ans",
  },
  {
    href: "/explorateur/bouge",
    icon: "🤸",
    bgColor: "#B8EDD9",
    name: "Bouge & Compte",
    desc: "Défis de mouvement corporel",
    tag: "Mouvement",
    tagColor: "#0F5C3A",
    age: "4-8 ans",
  },
  {
    href: "/explorateur/puzzle",
    icon: "🧩",
    bgColor: "#DBEAFE",
    name: "Puzzle Taquin",
    desc: "Glisse les pièces dans l'ordre !",
    tag: "Planification",
    tagColor: "#1A4FA0",
    age: "7-12 ans",
  },
];

export default function ExplorateurPage() {
  return (
    <div className="space-y-5">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 rounded-3xl p-5 border border-[#7DC4E8]/30"
        style={{ background: "linear-gradient(135deg, #E8F7FF 0%, #DFFFEF 100%)" }}
      >
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #7DC4E8, #5CC7A0)" }}>
          🦊
        </div>
        <div>
          <div className="font-display text-xl font-extrabold text-[#1A5F7A]">
            Bonjour, Champion·ne ! ✨
          </div>
          <div className="text-sm text-[#4A5568] mt-0.5">
            Tu as 15 activités disponibles. Prêt·e à explorer ?
          </div>
        </div>
      </motion.div>

      {/* Stars */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <StarsBar />
      </motion.div>

      {/* Thermomètre émotionnel */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <ThermometreEmotionnel />
      </motion.div>

      {/* Super-pouvoirs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
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

      {/* Games */}
      <div>
        <h2 className="font-display text-base font-bold text-[#1E2A38] mb-3 flex items-center gap-2">
          🎮 Mes activités
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {GAMES.map((game, i) => (
            <motion.div
              key={game.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
            >
              <Link href={game.href}>
                <div className="bg-white rounded-2xl p-4 border border-gray-100 cursor-pointer
                  hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                  style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: game.bgColor }}>
                      {game.icon}
                    </div>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                      style={{ background: game.bgColor, color: game.tagColor }}>
                      {game.tag}
                    </span>
                  </div>
                  <div className="font-display text-sm font-bold text-[#1E2A38] mb-1">
                    {game.name}
                  </div>
                  <div className="text-xs text-[#7A8BA0]">{game.desc}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* New Games by Age */}
      <div>
        <h2 className="font-display text-base font-bold text-[#1E2A38] mb-3 flex items-center gap-2">
          🌟 Nouveaux jeux — par âge
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {NEW_GAMES.map((game, i) => (
            <motion.div
              key={game.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
            >
              <Link href={game.href}>
                <div className="relative bg-white rounded-2xl p-4 border border-gray-100 cursor-pointer
                  hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                  style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
                  {/* Badge Nouveau */}
                  <div className="absolute -top-2 -right-2 text-[9px] font-extrabold uppercase tracking-wider
                    text-white px-2 py-0.5 rounded-full"
                    style={{ background: "linear-gradient(135deg, #FF922B, #FFD93D)" }}>
                    ✨ Nouveau
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: game.bgColor }}>
                      {game.icon}
                    </div>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                      style={{ background: game.bgColor, color: game.tagColor }}>
                      {game.tag}
                    </span>
                  </div>
                  <div className="font-display text-sm font-bold text-[#1E2A38] mb-1">
                    {game.name}
                  </div>
                  <div className="text-xs text-[#7A8BA0]">{game.desc}</div>
                  {game.age && (
                    <div className="mt-1.5 text-[9px] font-extrabold uppercase tracking-wider text-white
                      px-2 py-0.5 rounded-full inline-block"
                      style={{ background: game.tagColor }}>
                      {game.age}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lecture & Écriture */}
      <div>
        <h2 className="font-display text-base font-bold text-[#1E2A38] mb-1 flex items-center gap-2">
          📖 Lire & Écrire
        </h2>
        <p className="text-xs text-[#7A8BA0] font-semibold mb-3">
          Méthodes professionnelles adaptées au cerveau TDAH
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { href: "/explorateur/syllabes", icon: "🥁", bg: "#DBEAFE", name: "Syllabes Tap", desc: "Tape les syllabes", tag: "Phonologie", tagColor: "#1A4FA0" },
            { href: "/explorateur/lecture",  icon: "🌈", bg: "#E8F7FF", name: "Lecture Couleurs", desc: "Lis en bicolore", tag: "Décodage", tagColor: "#1A5F7A" },
            { href: "/explorateur/dictee",   icon: "✨", bg: "#B8EDD9", name: "Dictée Éclair", desc: "Mémorise & écris", tag: "Orthographe", tagColor: "#0F5C3A" },
          ].map((g, i) => (
            <motion.div key={g.name}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.06 }}>
              <Link href={g.href}>
                <div className="bg-white rounded-2xl p-3 border border-gray-100 cursor-pointer
                  hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2"
                    style={{ background: g.bg }}>{g.icon}</div>
                  <div className="font-display text-xs font-bold text-[#1E2A38] leading-tight mb-1">{g.name}</div>
                  <div className="text-[10px] text-[#7A8BA0]">{g.desc}</div>
                  <div className="mt-1.5 text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full inline-block"
                    style={{ background: g.bg, color: g.tagColor }}>{g.tag}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quest */}
      <div id="quest">
        <h2 className="font-display text-base font-bold text-[#1E2A38] mb-3 flex items-center gap-2">
          🗺️ Ma Quête du jour
        </h2>
        <QuestPanel />
      </div>
    </div>
  );
}
