"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "growing" | "result" | "win";

const ROUNDS = [4000, 6000, 9000, 12000, 16000];

const STAGES = [
  { emoji: "🌱", label: "Graine",            min: 0    },
  { emoji: "🌿", label: "Pousse",             min: 0.2  },
  { emoji: "🪴", label: "Petite plante",     min: 0.4  },
  { emoji: "🌺", label: "Bourgeon",           min: 0.6  },
  { emoji: "🌸", label: "Fleur",              min: 0.8  },
  { emoji: "🌻", label: "Pleine floraison",  min: 1.0  },
];

function getStage(r: number) {
  for (let i = STAGES.length - 1; i >= 0; i--)
    if (r >= STAGES[i].min) return STAGES[i];
  return STAGES[0];
}

function starsFor(r: number): number {
  if (r >= 1.0) return 5;
  if (r >= 0.8) return 4;
  if (r >= 0.6) return 3;
  if (r >= 0.4) return 2;
  if (r >= 0.2) return 1;
  return 0;
}

const TIPS = [
  "Regarde ta graine… elle a besoin de temps 🌱",
  "Chaque seconde d'attente la fait grandir 🌿",
  "Tu ressens l'envie de toucher ? Résiste encore… 💪",
  "Ton cortex préfrontal se renforce à chaque seconde !",
  "Dernière ronde — montre toute ta patience 🌻",
];

export default function JardinZen() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [roundIdx, setRoundIdx] = useState(0);
  const [ratio, setRatio] = useState(0);
  const [harvestRatio, setHarvestRatio] = useState(0);
  const [earned, setEarned] = useState<number[]>([]);

  const startRef  = useRef(0);
  const rafRef    = useRef(0);
  const totalRef  = useRef(ROUNDS[0]);
  const earnedRef = useRef<number[]>([]);

  const tick = useCallback((now: number) => {
    const r = Math.min((now - startRef.current) / totalRef.current, 1);
    setRatio(r);
    if (r < 1) rafRef.current = requestAnimationFrame(tick);
  }, []);

  function beginRound(idx: number) {
    totalRef.current = ROUNDS[idx];
    startRef.current = performance.now();
    setRatio(0);
    setRoundIdx(idx);
    setPhase("growing");
    rafRef.current = requestAnimationFrame(tick);
  }

  function start() {
    earnedRef.current = [];
    setEarned([]);
    beginRound(0);
  }

  function harvest() {
    if (phase !== "growing") return;
    cancelAnimationFrame(rafRef.current);
    const r = Math.min((performance.now() - startRef.current) / totalRef.current, 1);
    setHarvestRatio(r);
    const s = starsFor(r);
    const newEarned = [...earnedRef.current, s];
    earnedRef.current = newEarned;
    setEarned(newEarned);
    setPhase("result");

    setTimeout(() => {
      const next = roundIdx + 1;
      if (next >= ROUNDS.length) {
        const avg = newEarned.reduce((a, b) => a + b, 0) / newEarned.length;
        addStars(avg >= 4 ? 5 : avg >= 3 ? 4 : avg >= 2 ? 3 : 2);
        setPhase("win");
      } else {
        beginRound(next);
      }
    }, 1800);
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const stage = getStage(ratio);
  const previewStars = starsFor(ratio);

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">

        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-2">
            <div className="text-6xl mb-3">🌱</div>
            <div className="font-display text-lg font-extrabold text-[#0F5C3A] mb-2">
              Le Jardin de la Patience
            </div>
            <div className="bg-[#B8EDD9] rounded-2xl p-4 mb-3 text-sm text-[#0F5C3A] font-semibold leading-relaxed text-left">
              Laisse la plante grandir sans la toucher. Plus tu attends, plus elle fleurit.
              Tu peux la cueillir quand tu veux — mais la patience porte ses fruits !
            </div>
            <div className="text-xs text-[#7A8BA0] mb-5">
              🔬 Entraîne le cortex préfrontal — le centre d'autocontrôle du cerveau
            </div>
            <button onClick={start} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #5CC7A0, #3A9FD4)", color: "white", border: "none" }}>
              🌱 Planter ma graine !
            </button>
          </motion.div>
        )}

        {phase === "growing" && (
          <motion.div key="growing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A8BA0] mb-1">
              Ronde {roundIdx + 1} / {ROUNDS.length}
            </div>
            <div className="text-xs font-semibold text-[#4A5568] italic mb-5 h-8 flex items-center justify-center px-4">
              {TIPS[roundIdx]}
            </div>

            <div className="flex justify-center mb-3">
              <div className="relative w-44 h-44">
                <svg className="w-full h-full -rotate-90 absolute inset-0" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#E2E8F0" strokeWidth="5" />
                  <motion.circle cx="50" cy="50" r="44" fill="none"
                    stroke={ratio >= 1 ? "#FFD93D" : "#5CC7A0"} strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 44 * ratio} ${2 * Math.PI * 44}`}
                  />
                </svg>
                <motion.button
                  onClick={harvest}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  animate={{ scale: 1 + ratio * 0.25 }}
                  transition={{ type: "spring", stiffness: 120 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span style={{ fontSize: 56 }}>{stage.emoji}</span>
                </motion.button>
              </div>
            </div>

            <div className="font-display text-sm font-bold text-[#0F5C3A] mb-2">{stage.label}</div>

            <div className="flex justify-center gap-1 mb-5">
              {[1,2,3,4,5].map((s) => (
                <motion.span key={s} animate={{ scale: s <= previewStars ? 1.1 : 0.9 }}
                  className="text-xl" style={{ opacity: s <= previewStars ? 1 : 0.2 }}>
                  ⭐
                </motion.span>
              ))}
            </div>

            <button onClick={harvest}
              className="w-full py-3.5 rounded-2xl font-display font-extrabold border-2 transition-all text-sm"
              style={{
                background: ratio >= 1 ? "linear-gradient(135deg,#5CC7A0,#3A9FD4)" : "#F8F6F0",
                borderColor: ratio >= 1 ? "#5CC7A0" : "#E2E8F0",
                color: ratio >= 1 ? "white" : "#7A8BA0",
              }}>
              {ratio >= 1 ? "🌻 Cueillir — floraison complète !" : `✋ Cueillir maintenant (${previewStars} ⭐)`}
            </button>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }} className="text-center py-6">
            <div className="text-6xl mb-3">
              {starsFor(harvestRatio) >= 4 ? "🌻" : starsFor(harvestRatio) >= 2 ? "🌸" : "🌿"}
            </div>
            <div className="flex justify-center gap-1 mb-2">
              {[1,2,3,4,5].map((s) => (
                <motion.span key={s} initial={{ scale: 0 }}
                  animate={{ scale: s <= starsFor(harvestRatio) ? 1 : 0.6 }}
                  transition={{ delay: s * 0.1, type: "spring" }}
                  className="text-2xl" style={{ opacity: s <= starsFor(harvestRatio) ? 1 : 0.2 }}>⭐</motion.span>
              ))}
            </div>
            <div className="font-display text-base font-extrabold text-[#0F5C3A]">
              {starsFor(harvestRatio) >= 4 ? "Quelle patience ! 🏆" :
               starsFor(harvestRatio) >= 2 ? "Bien joué ! 💪" : "Continue de t'entraîner ! 🌱"}
            </div>
            <div className="text-xs text-[#7A8BA0] mt-1">Prochaine ronde…</div>
          </motion.div>
        )}

        {phase === "win" && (
          <motion.div key="win" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="rounded-3xl p-6 text-center"
            style={{ background: "linear-gradient(135deg, #B8EDD9, #DBEAFE)" }}>
            <div className="text-4xl mb-2">🌻🌸🌺🌿🌱</div>
            <div className="font-display text-xl font-extrabold text-[#0F5C3A] mb-2">
              Ton jardin a fleuri !
            </div>
            <div className="flex justify-center gap-2 flex-wrap mb-3">
              {earned.map((s, i) => (
                <span key={i} className="text-xs font-bold bg-white/70 px-2 py-1 rounded-full text-[#0F5C3A]">
                  R{i+1}: {s}⭐
                </span>
              ))}
            </div>
            <div className="text-xs text-[#4A5568] font-semibold mb-4">
              🔬 En attendant, tu as renforcé ton cortex préfrontal — le siège de l'autocontrôle.
            </div>
            <button onClick={start}
              className="w-full py-3 rounded-2xl font-display font-extrabold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #5CC7A0, #3A9FD4)" }}>
              🌱 Replanter mon jardin
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
