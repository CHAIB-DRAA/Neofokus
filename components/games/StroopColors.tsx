"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "playing" | "win";

interface Trial {
  word: string;
  wordColor: string;
  correct: string; // label of the ink color
}

const COLORS = [
  { label: "ROUGE", hex: "#E05050" },
  { label: "BLEU",  hex: "#5B9CF6" },
  { label: "VERT",  hex: "#5CC7A0" },
  { label: "JAUNE", hex: "#FFD93D" },
];

const DURATION = 45;

function generateTrial(): Trial {
  const wordColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  let ink;
  do { ink = COLORS[Math.floor(Math.random() * COLORS.length)]; } while (ink === wordColor);
  return { word: wordColor.label, wordColor: ink.hex, correct: ink.label };
}

function generateQueue(n: number): Trial[] {
  return Array.from({ length: n }, generateTrial);
}

export default function StroopColors() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [queue, setQueue] = useState<Trial[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [flash, setFlash] = useState<"ok" | "ko" | null>(null);

  const timerRef = useRef(0);
  const scoreRef = useRef(0);

  useEffect(() => () => clearInterval(timerRef.current), []);

  function startGame() {
    const q = generateQueue(50);
    setQueue(q);
    setIdx(0);
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(DURATION);
    setFlash(null);
    setPhase("playing");

    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          const s = scoreRef.current;
          addStars(s >= 22 ? 5 : s >= 16 ? 4 : s >= 11 ? 3 : s >= 6 ? 2 : 1);
          setScore(s);
          setPhase("win");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function choose(label: string) {
    if (phase !== "playing") return;
    const trial = queue[idx];
    const correct = label === trial.correct;
    if (correct) {
      scoreRef.current++;
      setScore(scoreRef.current);
    }
    setFlash(correct ? "ok" : "ko");
    setTimeout(() => {
      setFlash(null);
      setIdx((i) => i + 1);
    }, 280);
  }

  const trial = queue[idx];
  const pct = (timeLeft / DURATION) * 100;

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">

        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
            <div className="text-6xl mb-3">🎨</div>
            <div className="font-display text-lg font-extrabold text-[#3D1F8A] mb-2">Défi des Couleurs</div>
            <div className="bg-[#E8E0F8] rounded-2xl p-4 mb-3 text-sm text-[#3D1F8A] font-semibold leading-relaxed text-left">
              Tu vois un mot de couleur écrit dans une <b>autre couleur</b>. Appuie sur la couleur de <b>l'encre</b>, pas sur ce que dit le mot !
              <div className="mt-2 p-2 rounded-xl bg-white/50 text-center">
                Ex : <span className="font-extrabold text-lg" style={{ color: "#5B9CF6" }}>ROUGE</span>
                → réponse : <b>BLEU</b> (couleur de l'encre)
              </div>
            </div>
            <div className="text-xs text-[#7A8BA0] mb-5">
              🔬 Effet Stroop — entraîne l'inhibition cognitive et le contrôle de l'attention
            </div>
            <button onClick={startGame} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #8E72DB, #E05050)", color: "white", border: "none" }}>
              🎨 Commencer le défi
            </button>
          </motion.div>
        )}

        {phase === "playing" && trial && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full"
                  style={{ background: pct > 50 ? "#8E72DB" : pct > 20 ? "#FFD93D" : "#E05050",
                    width: `${pct}%` }} transition={{ duration: 0 }} />
              </div>
              <span className="text-sm font-extrabold text-[#1E2A38] w-8">{timeLeft}s</span>
            </div>

            <div className="text-right text-xs font-extrabold text-[#8E72DB] mb-4">Score : {score}</div>

            {/* Stroop word */}
            <motion.div
              animate={{ backgroundColor: flash === "ok" ? "#B8EDD9" : flash === "ko" ? "#FDECEA" : "#F8F6F0" }}
              transition={{ duration: 0.15 }}
              className="rounded-3xl flex items-center justify-center mb-6"
              style={{ height: 140, border: "2px solid #E2E8F0" }}>
              <AnimatePresence mode="wait">
                <motion.span key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.18 }}
                  className="font-display font-extrabold"
                  style={{ fontSize: 52, color: trial.wordColor, letterSpacing: "0.05em" }}>
                  {trial.word}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            <div className="text-center text-xs font-bold text-[#7A8BA0] mb-3">
              Quelle est la couleur de l'encre ?
            </div>

            <div className="grid grid-cols-2 gap-2">
              {COLORS.map((c) => (
                <button key={c.label}
                  onClick={() => choose(c.label)}
                  className="py-3 rounded-2xl font-display font-extrabold text-white text-base active:scale-95 transition-all"
                  style={{ background: c.hex }}>
                  {c.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "win" && (
          <motion.div key="win" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="rounded-3xl p-6 text-center"
            style={{ background: "linear-gradient(135deg, #E8E0F8, #BFE3F5)" }}>
            <div className="text-4xl mb-2">🎨🏆</div>
            <div className="font-display text-xl font-extrabold text-[#3D1F8A] mb-1">Défi relevé !</div>
            <div className="text-5xl font-extrabold text-[#8E72DB] mb-1">{score}</div>
            <div className="text-sm text-[#7A8BA0] mb-3">bonnes réponses en {DURATION} secondes</div>
            <div className="text-xs text-[#4A5568] font-semibold mb-4">
              🔬 L'effet Stroop entraîne l'inhibition — la capacité à ignorer une réponse automatique.
            </div>
            <button onClick={startGame}
              className="w-full py-3 rounded-2xl font-display font-extrabold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #8E72DB, #E05050)" }}>
              🎨 Rejouer
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
