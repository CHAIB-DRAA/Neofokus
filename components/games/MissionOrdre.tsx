"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "playing" | "feedback" | "win";

interface Mission {
  title: string;
  icon: string;
  steps: string[];
}

const MISSIONS: Mission[] = [
  {
    title: "Ma matinée",
    icon: "🌅",
    steps: [
      "☀️ Se réveiller",
      "🦷 Se brosser les dents",
      "👕 S'habiller",
      "🥣 Prendre le petit-déjeuner",
      "🎒 Prendre son sac",
    ],
  },
  {
    title: "En classe",
    icon: "🏫",
    steps: [
      "🖐️ Dire bonjour au professeur",
      "🪑 S'asseoir à sa place",
      "📖 Sortir ses affaires",
      "✏️ Écrire la date",
      "👂 Écouter la leçon",
    ],
  },
  {
    title: "Faire ses devoirs",
    icon: "📚",
    steps: [
      "🎒 Sortir son agenda",
      "📋 Regarder ce qu'il y a à faire",
      "📖 Commencer par la lecture",
      "✏️ Faire les exercices écrits",
      "🎒 Ranger dans son sac",
    ],
  },
  {
    title: "Ma soirée",
    icon: "🌙",
    steps: [
      "🍽️ Manger le dîner",
      "🛁 Prendre son bain",
      "👗 Mettre son pyjama",
      "📖 Lire un peu",
      "💤 Se coucher",
    ],
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MissionOrdre() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [missionIdx, setMissionIdx] = useState(0);
  const [shuffled, setShuffled] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [lastCorrect, setLastCorrect] = useState(true);
  const [errors, setErrors] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);

  function startMission(idx: number) {
    setShuffled(shuffle(MISSIONS[idx].steps));
    setSelected([]);
    setErrors(0);
    setMissionIdx(idx);
    setPhase("playing");
  }

  function startGame() {
    setTotalErrors(0);
    setPhase("idle");
    // Show mission selection - handled by idle with missionIdx context
    startMission(0);
  }

  function tapStep(step: string) {
    if (phase !== "playing") return;
    const mission = MISSIONS[missionIdx];
    const expectedIdx = selected.length;
    const isCorrect = mission.steps[expectedIdx] === step;

    if (isCorrect) {
      const newSelected = [...selected, step];
      setSelected(newSelected);
      setLastCorrect(true);

      if (newSelected.length === mission.steps.length) {
        setPhase("feedback");
        const nextMission = missionIdx + 1;
        setTimeout(() => {
          if (nextMission >= MISSIONS.length) {
            addStars(totalErrors + errors <= 2 ? 5 : totalErrors + errors <= 5 ? 4 : totalErrors + errors <= 8 ? 3 : 2);
            setPhase("win");
          } else {
            setTotalErrors((e) => e + errors);
            startMission(nextMission);
          }
        }, 1200);
      }
    } else {
      setLastCorrect(false);
      setErrors((e) => e + 1);
      setTimeout(() => setLastCorrect(true), 600);
    }
  }

  const mission = MISSIONS[missionIdx];
  const remaining = shuffled.filter((s) => !selected.includes(s));

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">

        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
            <div className="text-6xl mb-3">📋</div>
            <div className="font-display text-lg font-extrabold text-[#3D1F8A] mb-2">Mission Ordre</div>
            <div className="bg-[#E8E0F8] rounded-2xl p-4 mb-3 text-sm text-[#3D1F8A] font-semibold leading-relaxed text-left">
              Des étapes d'une routine quotidienne sont mélangées. Tape-les dans le <b>bon ordre</b> du début à la fin !
            </div>
            <div className="text-xs text-[#7A8BA0] mb-5">
              🔬 Entraîne la planification et le séquençage — fonctions exécutives essentielles
            </div>
            <button onClick={startGame} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #8E72DB, #5B8EDB)", color: "white", border: "none" }}>
              📋 Commencer la mission
            </button>
          </motion.div>
        )}

        {(phase === "playing" || phase === "feedback") && (
          <motion.div key={`mission-${missionIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A8BA0]">
                Mission {missionIdx + 1} / {MISSIONS.length}
              </div>
              <div className="font-display text-sm font-extrabold text-[#8E72DB]">
                {mission.icon} {mission.title}
              </div>
            </div>

            {/* Progress */}
            <div className="flex gap-1 mb-4">
              {mission.steps.map((_, i) => (
                <div key={i} className="flex-1 h-1.5 rounded-full"
                  style={{ background: i < selected.length ? "#8E72DB" : "#E2E8F0" }} />
              ))}
            </div>

            {/* Next step hint */}
            <div className="text-center text-xs font-bold text-[#8E72DB] mb-3">
              {phase === "feedback" ? "✅ Mission accomplie !" :
                `Étape ${selected.length + 1} sur ${mission.steps.length} — quelle est la suivante ?`}
            </div>

            {/* Completed steps */}
            {selected.length > 0 && (
              <div className="mb-3 space-y-1">
                {selected.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold"
                    style={{ background: "#E8E0F8", color: "#3D1F8A" }}>
                    <span className="text-[#8E72DB] font-extrabold">{i+1}.</span> {s} <span className="ml-auto">✓</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Remaining steps */}
            <div className="space-y-2">
              {remaining.map((step) => (
                <motion.button key={step}
                  onClick={() => tapStep(step)}
                  disabled={phase === "feedback"}
                  animate={{ x: !lastCorrect ? [0, -8, 8, -5, 5, 0] : 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full text-left rounded-2xl px-4 py-3 text-sm font-semibold border-2 transition-all active:scale-95"
                  style={{ background: "#F8F6F0", borderColor: "#E2E8F0", color: "#1E2A38" }}>
                  {step}
                </motion.button>
              ))}
            </div>

            {errors > 0 && phase === "playing" && (
              <div className="text-center text-xs text-[#E05050] font-bold mt-2">
                {errors} erreur{errors > 1 ? "s" : ""} sur cette mission
              </div>
            )}
          </motion.div>
        )}

        {phase === "win" && (
          <motion.div key="win" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="rounded-3xl p-6 text-center"
            style={{ background: "linear-gradient(135deg, #E8E0F8, #BFE3F5)" }}>
            <div className="text-4xl mb-2">📋🏆</div>
            <div className="font-display text-xl font-extrabold text-[#3D1F8A] mb-1">
              Toutes les missions accomplies !
            </div>
            <div className="flex justify-center gap-2 flex-wrap mb-3">
              {MISSIONS.map((m, i) => (
                <span key={i} className="text-sm bg-white/70 px-2 py-1 rounded-full">{m.icon} {m.title}</span>
              ))}
            </div>
            <div className="text-xs text-[#4A5568] font-semibold mb-4">
              🔬 Ordonner des étapes entraîne la planification — déficit clé dans le TDAH.
            </div>
            <button onClick={startGame}
              className="w-full py-3 rounded-2xl font-display font-extrabold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #8E72DB, #5B8EDB)" }}>
              📋 Rejouer
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
