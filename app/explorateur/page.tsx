"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import QuestPanel from "@/components/quest/QuestPanel";
import StarsBar from "@/components/quest/StarsBar";
import ThermometreEmotionnel from "@/components/games/ThermometreEmotionnel";
import { useProfileStore } from "@/lib/useProfileStore";
import { useState } from "react";
import ProfileSelector from "@/components/profile/ProfileSelector";

type Game = {
  href: string;
  icon: string;
  bgColor: string;
  name: string;
  desc: string;
  tag: string;
  tagColor: string;
  minAge: number;
  maxAge: number | null; // null = no upper limit
};

// ── CATALOGUE COMPLET (30 jeux) ──────────────────────────────────────────────

const ALL_GAMES: { section: string; desc: string; emoji: string; games: Game[] }[] = [
  {
    section: "🛑 Inhibition & Contrôle",
    desc: "Apprends à freiner avant d'agir",
    emoji: "🛑",
    games: [
      { href: "/explorateur/signal-stop", icon: "🛑", bgColor: "#BFE3F5", name: "Signal Stop",           desc: "Stoppe uniquement quand il le faut",        tag: "Inhibition",  tagColor: "#1A5F7A", minAge: 6,  maxAge: null },
      { href: "/explorateur/sabr",        icon: "🌱", bgColor: "#B8EDD9", name: "Jardin de la Patience", desc: "Laisse la plante grandir sans toucher",      tag: "Patience",    tagColor: "#0F5C3A", minAge: 7,  maxAge: null },
      { href: "/explorateur/stroop",      icon: "🎨", bgColor: "#E8E0F8", name: "Défi des Couleurs",     desc: "Lis la couleur de l'encre, pas le mot",     tag: "Stroop",      tagColor: "#3D1F8A", minAge: 9,  maxAge: null },
    ],
  },
  {
    section: "🎯 Attention & Vigilance",
    desc: "Reste concentré même quand c'est long",
    emoji: "🎯",
    games: [
      { href: "/explorateur/minuteur",    icon: "⏱️", bgColor: "#FFF3CD", name: "Défi Minuteur",         desc: "Focus total sur une mission choisie",        tag: "Focus",       tagColor: "#7A4200", minAge: 7,  maxAge: null },
      { href: "/explorateur/intrus",      icon: "🔍", bgColor: "#BFE3F5", name: "Intrus Éclair",         desc: "Trouve l'émoji qui ne va pas !",             tag: "Sélective",   tagColor: "#1A5F7A", minAge: 6,  maxAge: null },
      { href: "/explorateur/vigilance",   icon: "🎯", bgColor: "#DBEAFE", name: "Vigilance ⭐",          desc: "Tape uniquement l'étoile dans le flux",      tag: "Soutenue",    tagColor: "#1A4FA0", minAge: 7,  maxAge: null },
      { href: "/explorateur/chrono",      icon: "⌛", bgColor: "#BFE3F5", name: "Chrono Magique",        desc: "Arrête le chrono au bon moment",             tag: "Temps",       tagColor: "#1A5F7A", minAge: 8,  maxAge: null },
    ],
  },
  {
    section: "🧠 Mémoire de Travail",
    desc: "Garde des infos dans ta tête pendant que tu travailles",
    emoji: "🧠",
    games: [
      { href: "/explorateur/memoire",     icon: "🧠", bgColor: "#D0C8FA", name: "Mémoire Flash",         desc: "Mémorise la séquence de couleurs",           tag: "Séquence",    tagColor: "#3D1F8A", minAge: 6,  maxAge: null },
      { href: "/explorateur/paires",      icon: "🃏", bgColor: "#FFE0B2", name: "Paires Magiques",       desc: "Retourne et associe les cartes",             tag: "Visuelle",    tagColor: "#9C4400", minAge: 5,  maxAge: null },
      { href: "/explorateur/chiffres",    icon: "👻", bgColor: "#F0F4F8", name: "Chiffres Fantômes",     desc: "Rappelle la séquence de chiffres",           tag: "Numérique",   tagColor: "#1E2A38", minAge: 8,  maxAge: null },
      { href: "/explorateur/grille",      icon: "🟦", bgColor: "#DBEAFE", name: "Grille Mémoire",        desc: "Reproduis la grille colorée",                tag: "Spatial",     tagColor: "#1A4FA0", minAge: 8,  maxAge: null },
      { href: "/explorateur/dhikr",       icon: "💡", bgColor: "#E8E0F8", name: "Séquence de Lumières",  desc: "Reproduis la séquence lumineuse",            tag: "Travail",     tagColor: "#3D1F8A", minAge: 7,  maxAge: null },
      { href: "/explorateur/nujum",       icon: "🌌", bgColor: "#BFE3F5", name: "Carte du Ciel",         desc: "Retrace le chemin dans les étoiles",         tag: "Spatial",     tagColor: "#1A5F7A", minAge: 9,  maxAge: null },
      { href: "/explorateur/mot-mystere", icon: "🔤", bgColor: "#B8EDD9", name: "Mot Mystère",           desc: "Mémorise le mot, retape ses lettres",        tag: "Orthographe", tagColor: "#0F5C3A", minAge: 8,  maxAge: null },
    ],
  },
  {
    section: "🔀 Flexibilité & Vitesse",
    desc: "Change de règle rapidement, réfléchis vite",
    emoji: "🔀",
    games: [
      { href: "/explorateur/rythme",      icon: "🥁", bgColor: "#FDECEA", name: "Rythme Écho",           desc: "Simon Says de couleurs rythmé",              tag: "Rythme",      tagColor: "#C02020", minAge: 7,  maxAge: null },
      { href: "/explorateur/tri-eclair",  icon: "⚡", bgColor: "#C8F7D4", name: "Tri Éclair",            desc: "Classe les émojis selon la règle",           tag: "Flexibilité", tagColor: "#0F5C3A", minAge: 7,  maxAge: null },
      { href: "/explorateur/mizan",       icon: "⚖️", bgColor: "#FFF9C4", name: "La Grande Balance",     desc: "Trie chaque carte du bon côté",              tag: "Set-shifting", tagColor: "#9C6800", minAge: 7, maxAge: null },
      { href: "/explorateur/contraires",  icon: "🔀", bgColor: "#FDECEA", name: "Contraires Express",    desc: "Trouve le contraire en 60 secondes",         tag: "Vitesse",     tagColor: "#C02020", minAge: 8,  maxAge: null },
    ],
  },
  {
    section: "📅 Organisation & Planification",
    desc: "Divise les grandes tâches, ordonne les étapes",
    emoji: "📅",
    games: [
      { href: "/explorateur/mission-ordre", icon: "📋", bgColor: "#E8E0F8", name: "Mission Ordre",       desc: "Remet les étapes de la journée en ordre",    tag: "Séquençage",  tagColor: "#3D1F8A", minAge: 6,  maxAge: null },
      { href: "/explorateur/puzzle",        icon: "🧩", bgColor: "#DBEAFE", name: "Puzzle Taquin",       desc: "Glisse les pièces dans l'ordre",             tag: "Planification", tagColor: "#1A4FA0", minAge: 7, maxAge: null },
      { href: "#quest",                     icon: "🗺️", bgColor: "#B8EDD9", name: "Quête en 3 pas",      desc: "Divise ton grand défi en étapes simples",    tag: "Organisation", tagColor: "#0F5C3A", minAge: 7, maxAge: null },
    ],
  },
  {
    section: "😊 Émotions & Corps",
    desc: "Reconnais, exprime et régule tes émotions",
    emoji: "😊",
    games: [
      { href: "/explorateur/emotions",    icon: "🔍", bgColor: "#B8EDD9", name: "Détective des Émotions", desc: "Devine l'émotion de chaque personnage",    tag: "Empathie",    tagColor: "#0F5C3A", minAge: 6,  maxAge: null },
      { href: "/explorateur/bulle",       icon: "🧘", bgColor: "#E8E0F8", name: "Bulle de Calme",         desc: "Respiration guidée animée",               tag: "Régulation",  tagColor: "#3D1F8A", minAge: 4,  maxAge: null },
      { href: "/explorateur/scan-relax",  icon: "🌊", bgColor: "#BFE3F5", name: "Scan Relax",             desc: "Détends ton corps zone par zone",          tag: "Relaxation",  tagColor: "#1A5F7A", minAge: 6,  maxAge: null },
    ],
  },
  {
    section: "📖 Lecture & Écriture",
    desc: "Méthodes adaptées au cerveau TDAH et dyslexique",
    emoji: "📖",
    games: [
      { href: "/explorateur/syllabes",    icon: "🥁", bgColor: "#DBEAFE", name: "Syllabes Tap",          desc: "Tape le rythme des syllabes",               tag: "Phonologie",  tagColor: "#1A4FA0", minAge: 5,  maxAge: null },
      { href: "/explorateur/lecture",     icon: "🌈", bgColor: "#E8F7FF", name: "Lecture Couleurs",      desc: "Lis en bicolore facilitant",                tag: "Décodage",    tagColor: "#1A5F7A", minAge: 5,  maxAge: null },
      { href: "/explorateur/dictee",      icon: "✨", bgColor: "#B8EDD9", name: "Dictée Éclair",         desc: "Mémorise et écris le mot",                  tag: "Orthographe", tagColor: "#0F5C3A", minAge: 8,  maxAge: null },
    ],
  },
  {
    section: "🌈 Créativité & Mouvement",
    desc: "Le corps bouge, le cerveau apprend mieux",
    emoji: "🌈",
    games: [
      { href: "/explorateur/couleurs",    icon: "🎨", bgColor: "#FFF9C4", name: "Couleurs Rigolos",      desc: "Trouve la bonne couleur !",                 tag: "Visuel",      tagColor: "#9C6800", minAge: 4,  maxAge: 8  },
      { href: "/explorateur/bouge",       icon: "🤸", bgColor: "#B8EDD9", name: "Bouge & Compte",        desc: "Défis de mouvement corporel",               tag: "Mouvement",   tagColor: "#0F5C3A", minAge: 4,  maxAge: 10 },
      { href: "/explorateur/creatif",     icon: "✍️", bgColor: "#E8E0F8", name: "Défi Créatif",          desc: "Écris sans te retenir !",                   tag: "Créativité",  tagColor: "#3D1F8A", minAge: 10, maxAge: null },
    ],
  },
];

function filterByAge(games: Game[], age: number): Game[] {
  return games.filter((g) => age >= g.minAge && (g.maxAge === null || age <= g.maxAge));
}

function GameCard({ game, delay = 0 }: { game: Game; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Link href={game.href}>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 cursor-pointer
          hover:-translate-y-1 hover:shadow-md transition-all duration-200"
          style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
              style={{ background: game.bgColor }}>{game.icon}</div>
            <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
              style={{ background: game.bgColor, color: game.tagColor }}>{game.tag}</span>
          </div>
          <div className="font-display text-sm font-bold text-[#1E2A38] mb-1 leading-tight">{game.name}</div>
          <div className="text-xs text-[#7A8BA0] leading-snug">{game.desc}</div>
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
            Bonjour, {profile?.name ?? "Champion·ne"} ! ✨
          </div>
          <div className="text-sm text-[#4A5568] mt-0.5">
            {age !== null
              ? `Jeux pour ${age} ans — ${ALL_GAMES.reduce((n, s) => n + filterByAge(s.games, age).length, 0)} activités disponibles`
              : "Définis ton âge pour voir tes jeux !"}
          </div>
        </div>
      </motion.div>

      {/* Âge non défini — bannière d'alerte */}
      <AnimatePresence>
        {age === null && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl p-4 flex items-center gap-3 border-2 border-[#FF922B]"
            style={{ background: "#FFF3E0" }}>
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <div className="font-display text-sm font-extrabold text-[#9C4400]">Âge non défini</div>
              <div className="text-xs text-[#7A4200] font-semibold">
                Les parents doivent renseigner l'âge pour afficher les jeux adaptés
              </div>
            </div>
            <button
              onClick={() => setShowAgeModal(true)}
              className="flex-shrink-0 px-3 py-2 rounded-xl font-display font-extrabold text-white text-xs"
              style={{ background: "linear-gradient(135deg, #FF922B, #FFD93D)" }}>
              Définir →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {showAgeModal && (
        <ProfileSelector onClose={() => setShowAgeModal(false)} />
      )}

      {/* Stars */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <StarsBar />
      </motion.div>

      {/* Thermomètre */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}>
        <ThermometreEmotionnel />
      </motion.div>

      {/* Super-pouvoirs */}
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

      {/* ── SECTIONS PAR DOMAINE COGNITIF ─────────────────────────────────── */}
      {age !== null ? (
        ALL_GAMES.map((section, si) => {
          const filtered = filterByAge(section.games, age);
          if (filtered.length === 0) return null;
          return (
            <motion.div key={section.section}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + si * 0.04 }}>
              <h2 className="font-display text-base font-bold text-[#1E2A38] mb-0.5">
                {section.section}
              </h2>
              <p className="text-xs text-[#7A8BA0] font-semibold mb-3">{section.desc}</p>
              <div className="grid grid-cols-2 gap-3">
                {filtered.map((game, gi) => (
                  <GameCard key={game.href} game={game} delay={0.18 + si * 0.04 + gi * 0.04} />
                ))}
              </div>
            </motion.div>
          );
        })
      ) : (
        /* Âge non défini → afficher tous les jeux en grisé */
        <div className="space-y-4 opacity-40 pointer-events-none select-none">
          {ALL_GAMES.map((section) => (
            <div key={section.section}>
              <h2 className="font-display text-base font-bold text-[#1E2A38] mb-0.5">{section.section}</h2>
              <div className="grid grid-cols-2 gap-3">
                {section.games.map((game) => (
                  <div key={game.href} className="bg-white rounded-2xl p-4 border border-gray-100"
                    style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3"
                      style={{ background: game.bgColor }}>{game.icon}</div>
                    <div className="font-display text-sm font-bold text-[#1E2A38] leading-tight">{game.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quest */}
      {age !== null && (
        <div id="quest">
          <h2 className="font-display text-base font-bold text-[#1E2A38] mb-3">🗺️ Ma Quête du jour</h2>
          <QuestPanel />
        </div>
      )}

    </div>
  );
}
