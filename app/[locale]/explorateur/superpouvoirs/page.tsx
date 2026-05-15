"use client";

import { Link } from "@/lib/navigation";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const POUVOIRS = [
  {
    id: "hyperfocus",
    icon: "🎯",
    nom: "Hyperfocus",
    tagline: "Tu peux aller plus loin que tout le monde",
    color: "#FF922B",
    bg: "#FFE0B2",
    description:
      "Quand quelque chose te passionne vraiment, tu peux te concentrer avec une intensité incroyable — bien plus que la plupart des gens. C'est un super-pouvoir rare.",
    exemples: ["Jeux vidéo", "Dessin", "Sport favori", "Musique", "Lego"],
    science: "L'hyperfocus est lié à la dopamine — ton cerveau s'emballe quand il trouve quelque chose de passionnant.",
  },
  {
    id: "creativite",
    icon: "🎨",
    nom: "Créativité",
    tagline: "Ton cerveau voit des connexions que les autres ratent",
    color: "#8E72DB",
    bg: "#E8E0F8",
    description:
      "Ton cerveau fait des liens inattendus entre des idées très différentes. C'est ça la pensée créative — et les plus grands inventeurs, artistes et entrepreneurs l'ont eu.",
    exemples: ["Inventer des histoires", "Trouver des solutions originales", "Improviser", "Rêver éveillé"],
    science: "La pensée divergente — trouver plein d'idées différentes — est significativement plus développée chez les cerveaux TDAH.",
  },
  {
    id: "energie",
    icon: "⚡",
    nom: "Énergie",
    tagline: "Tu es capable d'enthousiasme contagieux",
    color: "#FFD93D",
    bg: "#FFF9C4",
    description:
      "Cette énergie que parfois tu ne sais pas quoi faire — c'est du carburant. Les personnes avec TDAH qui apprennent à la diriger peuvent accomplir des choses extraordinaires.",
    exemples: ["Motiver une équipe", "S'engager à fond", "Défendre une cause", "Explorer sans peur"],
    science: "L'énergie du TDAH vient d'une forte sensibilité au système de récompense — elle se transforme en force quand bien orientée.",
  },
  {
    id: "empathie",
    icon: "💙",
    nom: "Empathie",
    tagline: "Tu ressens les émotions des autres très profondément",
    color: "#5B9CF6",
    bg: "#DBEAFE",
    description:
      "Beaucoup d'enfants avec TDAH ressentent les émotions des autres de façon très intense. Ce n'est pas une faiblesse — c'est une sensibilité rare qui peut devenir une grande force.",
    exemples: ["Sentir quand quelqu'un est triste", "Vouloir aider", "Être un ami loyal", "Comprendre les animaux"],
    science: "La sensibilité émotionnelle accrue est liée à la même hyperréactivité du système limbique qui rend le TDAH intense — elle a aussi un côté lumineux.",
  },
  {
    id: "resilience",
    icon: "💪",
    nom: "Résilience",
    tagline: "Tu as déjà surmonté plus que tu ne le crois",
    color: "#5CC7A0",
    bg: "#B8EDD9",
    description:
      "Chaque fois que tu as tenu bon malgré les difficultés à l'école, à la maison ou avec les amis — tu as construit quelque chose d'invisible mais de très solide en toi.",
    exemples: ["Continuer malgré les erreurs", "Recommencer après un échec", "Demander de l'aide", "Trouver sa propre façon de faire"],
    science: "Les adultes avec TDAH qui réussissent décrivent souvent la résilience construite dans leur enfance comme leur plus grande force.",
  },
  {
    id: "spontaneite",
    icon: "🚀",
    nom: "Spontanéité",
    tagline: "Tu oses quand les autres hésitent",
    color: "#E05050",
    bg: "#FDECEA",
    description:
      "Tu es souvent le premier à essayer quelque chose de nouveau, à proposer une idée folle, à agir sans trop réfléchir. Dans beaucoup de situations, c'est exactement ce qu'il faut.",
    exemples: ["Proposer une idée inattendue", "Essayer sans peur du ridicule", "Faire rire", "Prendre des initiatives"],
    science: "La prise de risque contrôlée et la spontanéité sont des traits valorisés chez les entrepreneurs, artistes et leaders.",
  },
];

export default function SuperpouvoirsPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      <Link href="/explorateur" className="inline-flex items-center gap-2 text-sm font-bold
        text-[#7A8BA0] hover:text-[#1A5F7A] mb-4 transition-colors">
        <ArrowLeft size={14} /> Retour
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl overflow-hidden border-2 border-[#FFD93D]"
        style={{ background: "linear-gradient(135deg, #FFF9C4, #FFE0B2)", boxShadow: "0 4px 20px rgba(255,217,61,0.2)" }}>
        <div className="px-5 py-5">
          <div className="text-4xl mb-2">🦸</div>
          <h1 className="font-display text-2xl font-extrabold text-[#1E2A38] mb-1">
            Mes Super-Pouvoirs
          </h1>
          <p className="text-sm text-[#7A4200] font-semibold">
            Ton cerveau TDAH est différent — pas inférieur. Voici ce qu'il a de spécial.
          </p>
        </div>
      </motion.div>

      <div className="mt-4 space-y-3">
        {POUVOIRS.map((p, i) => (
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
                    {p.nom}
                  </div>
                  <div className="text-xs font-semibold text-[#7A8BA0]">{p.tagline}</div>
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
                      {/* Description */}
                      <div className="text-sm text-[#1E2A38] font-semibold leading-relaxed"
                        style={{ borderLeft: `3px solid ${p.color}`, paddingLeft: 12 }}>
                        {p.description}
                      </div>

                      {/* Exemples */}
                      <div>
                        <div className="text-[10px] font-extrabold uppercase tracking-wider mb-2"
                          style={{ color: p.color }}>
                          Où tu peux l'utiliser
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {p.exemples.map((ex) => (
                            <span key={ex} className="text-xs font-bold px-2.5 py-1 rounded-full"
                              style={{ background: p.bg, color: p.color }}>
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Science */}
                      <div className="bg-[#F8F6F0] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#4A5568]">
                        🔬 {p.science}
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
          Tu n'as pas un cerveau cassé.
        </div>
        <div className="text-sm text-[#7A8BA0] font-semibold">
          Tu as un cerveau différent — et la différence, quand on la comprend,
          devient une vraie force.
        </div>
      </motion.div>
    </div>
  );
}