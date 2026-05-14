"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type EtatId = "calme" | "energique" | "stresse" | "triste" | "agite";

interface Etat {
  id: EtatId;
  emoji: string;
  label: string;
  color: string;
  bg: string;
  message: string;
  science: string;
  activites: { href: string; icon: string; nom: string }[];
}

const ETATS: Etat[] = [
  {
    id: "calme",
    emoji: "😌",
    label: "Calme",
    color: "#5CC7A0",
    bg: "#B8EDD9",
    message: "Ton cerveau est en pleine forme ! C'est le moment idéal pour les défis cognitifs.",
    science: "Un état calme active le cortex préfrontal — ton centre de concentration.",
    activites: [
      { href: "/explorateur/signal-stop", icon: "🛑", nom: "Signal Stop" },
      { href: "/explorateur/tri-eclair", icon: "⚡", nom: "Tri Éclair" },
    ],
  },
  {
    id: "energique",
    emoji: "⚡",
    label: "Énergique",
    color: "#FF922B",
    bg: "#FFE0B2",
    message: "Super énergie ! Dirige-la d'abord avec un jeu de mouvement, puis passe aux défis.",
    science: "L'exercice physique libère de la dopamine et améliore la concentration pendant 30 min.",
    activites: [
      { href: "/explorateur/bouge", icon: "🤸", nom: "Bouge & Compte" },
      { href: "/explorateur/rythme", icon: "🥁", nom: "Rythme Écho" },
    ],
  },
  {
    id: "stresse",
    emoji: "😤",
    label: "Débordé",
    color: "#8E72DB",
    bg: "#E8E0F8",
    message: "Ton cerveau est surchargé. Commence par respirer — tu géreras mieux ensuite.",
    science: "La respiration lente active le nerf vague et réduit le cortisol en 90 secondes.",
    activites: [
      { href: "/explorateur/bulle", icon: "🧘", nom: "Bulle de calme" },
      { href: "/explorateur/bouge", icon: "🤸", nom: "Bouge & Compte" },
    ],
  },
  {
    id: "triste",
    emoji: "😢",
    label: "Triste",
    color: "#5B9CF6",
    bg: "#DBEAFE",
    message: "C'est normal de se sentir comme ça. Prends soin de toi — une activité douce t'aidera.",
    science: "L'expression créative aide à traiter les émotions difficiles et à les nommer.",
    activites: [
      { href: "/explorateur/bulle", icon: "🧘", nom: "Bulle de calme" },
      { href: "/explorateur/creatif", icon: "✍️", nom: "Défi Créatif" },
    ],
  },
  {
    id: "agite",
    emoji: "🌀",
    label: "Agité",
    color: "#E05050",
    bg: "#FDECEA",
    message: "Trop d'énergie dedans ! Bouge pour la libérer, puis ton cerveau sera plus libre.",
    science: "L'agitation TDAH est souvent un signe de sous-stimulation dopaminergique — le mouvement aide.",
    activites: [
      { href: "/explorateur/bouge", icon: "🤸", nom: "Bouge & Compte" },
      { href: "/explorateur/signal-stop", icon: "🛑", nom: "Signal Stop" },
    ],
  },
];

export default function ThermometreEmotionnel() {
  const [selected, setSelected] = useState<EtatId | null>(null);
  const etat = ETATS.find((e) => e.id === selected) ?? null;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div className="px-5 pt-4 pb-3">
        <div className="font-display text-sm font-extrabold text-[#1E2A38] mb-0.5">
          🌡️ Comment tu te sens maintenant ?
        </div>
        <div className="text-xs text-[#7A8BA0] font-semibold">
          Choisis, l'app t'aide à trouver la bonne activité.
        </div>
      </div>

      {/* Boutons d'état */}
      <div className="flex gap-2 px-5 pb-4 overflow-x-auto">
        {ETATS.map((e) => (
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
              {e.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Panneau de réponse */}
      <AnimatePresence>
        {etat && (
          <motion.div
            key={etat.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mx-4 mb-4 rounded-2xl p-4 space-y-3"
              style={{ background: etat.bg }}>
              {/* Message */}
              <div className="text-sm font-bold" style={{ color: etat.color }}>
                {etat.emoji} {etat.message}
              </div>

              {/* Science */}
              <div className="text-xs font-semibold text-[#4A5568] bg-white/70 rounded-xl px-3 py-2">
                🔬 {etat.science}
              </div>

              {/* Activités recommandées */}
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider mb-2"
                  style={{ color: etat.color }}>
                  Activités recommandées
                </div>
                <div className="flex gap-2">
                  {etat.activites.map((a) => (
                    <Link key={a.href} href={a.href}
                      className="flex-1 flex items-center gap-2 bg-white rounded-xl px-3 py-2.5
                        border-2 hover:shadow-sm transition-all"
                      style={{ borderColor: etat.color + "44" }}>
                      <span className="text-lg">{a.icon}</span>
                      <span className="text-xs font-bold text-[#1E2A38]">{a.nom}</span>
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