"use client";

import { motion } from "framer-motion";
import AdviceCard from "@/components/parent/AdviceCard";
import CrisisPanel from "@/components/parent/CrisisPanel";
import RoutineBuilder from "@/components/parent/RoutineBuilder";

const ADVICE_CARDS = [
  {
    href: "/parents/cerveau",
    emoji: "🧠",
    tag: "Neurosciences",
    tagStyle: { background: "#E8E0F8", color: "#3D1F8A" },
    title: "Comprendre le cerveau TDAH",
    preview: "Dopamine, fonctions exécutives, inhibition… Ce qui se passe vraiment.",
    accentColor: "#8E72DB",
  },
  {
    href: "/parents/communication",
    emoji: "💬",
    tag: "Communication",
    tagStyle: { background: "#B8EDD9", color: "#0F5C3A" },
    title: "Parler avec bienveillance",
    preview: "Phrases-clés, ton de voix, écoute active pour éviter les conflits.",
    accentColor: "#5CC7A0",
  },
  {
    href: "/parents/crise",
    emoji: "🌊",
    tag: "Urgence",
    tagStyle: { background: "#FDECEA", color: "#7A1F1F" },
    title: "Crise en 3 étapes",
    preview: "Ton enfant déborde. Voici le plan d'action immédiat et calme.",
    accentColor: "#E05050",
  },
  {
    href: "/parents/routine",
    emoji: "📅",
    tag: "Routine",
    tagStyle: { background: "#FFF3E0", color: "#7A4200" },
    title: "Pourquoi la routine protège",
    preview: "La prévisibilité réduit l'anxiété et libère de la bande passante.",
    accentColor: "#FF922B",
  },
  {
    href: "/parents/recompenses",
    emoji: "🏆",
    tag: "Comportement",
    tagStyle: { background: "#FFF9C4", color: "#9C6800" },
    title: "Récompenses qui fonctionnent",
    preview: "Économie de jetons, ratio 5:1, timing immédiat — la méthode validée.",
    accentColor: "#FFD93D",
  },
  {
    href: "/parents/lire-ecrire",
    emoji: "📖",
    tag: "Apprentissage",
    tagStyle: { background: "#DBEAFE", color: "#1A4FA0" },
    title: "Lire & écrire avec le TDAH",
    preview: "Orton-Gillingham, méthode bicolore, séances courtes — les pros du TDAH.",
    accentColor: "#5B9CF6",
  },
];

export default function ParentsPage() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 rounded-3xl p-5 border border-[#8E72DB]/25"
        style={{ background: "linear-gradient(135deg, #EDE8FC 0%, #E0EDFF 100%)" }}
      >
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #8E72DB, #5B8EDB)" }}>
          🏠
        </div>
        <div>
          <div className="font-display text-xl font-extrabold text-[#3D1F8A]">
            Bienvenue au QG des Parents
          </div>
          <div className="text-sm text-[#5B4082] mt-0.5 font-medium">
            Outils, conseils et stratégies pour avancer ensemble.
          </div>
        </div>
      </motion.div>

      {/* Advice cards */}
      <div>
        <h2 className="font-display text-base font-bold text-[#1E2A38] mb-3">
          📚 Modules d'information
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {ADVICE_CARDS.map((card, i) => (
            <AdviceCard key={card.href} {...card} index={i} />
          ))}
        </div>
      </div>

      {/* Crisis */}
      <div>
        <h2 className="font-display text-base font-bold text-[#1E2A38] mb-3">
          🚨 Gestion de crise — Plan express
        </h2>
        <CrisisPanel />
      </div>

      {/* Routine builder */}
      <div>
        <h2 className="font-display text-base font-bold text-[#1E2A38] mb-3">
          📅 Générateur de routine visuelle
        </h2>
        <RoutineBuilder />
      </div>
    </div>
  );
}
