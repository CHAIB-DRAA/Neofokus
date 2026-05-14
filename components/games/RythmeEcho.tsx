"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "watch" | "repeat" | "correct" | "wrong" | "gameover" | "win";

const PADS = [
  { id: 0, color: "#E05050", light: "#FDECEA", label: "🔴" },
  { id: 1, color: "#5B9CF6", light: "#DBEAFE", label: "🔵" },
  { id: 2, color: "#5CC7A0", light: "#B8EDD9", label: "🟢" },
  { id: 3, color: "#FFD93D", light: "#FFF9C4", label: "🟡" },
];

const MAX_LEVELS = 8;
const FLASH_DURATION = 450;
const FLASH_GAP = 200;

export default function RythmeEcho() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  function clearTimeouts() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }

  const playSequence = useCallback((seq: number[]) => {
    clearTimeouts();
    setPhase("watch");
    setActiveId(null);

    seq.forEach((padId, i) => {
      const t1 = setTimeout(() => setActiveId(padId), i * (FLASH_DURATION + FLASH_GAP));
      const t2 = setTimeout(() => setActiveId(null), i * (FLASH_DURATION + FLASH_GAP) + FLASH_DURATION);
      timeoutsRef.current.push(t1, t2);
    });

    const endTime = seq.length * (FLASH_DURATION + FLASH_GAP) + 300;
    const t3 = setTimeout(() => {
      setUserInput([]);
      setPhase("repeat");
    }, endTime);
    timeoutsRef.current.push(t3);
  }, []);

  function startGame() {
    clearTimeouts();
    setLives(3);
    setScore(0);
    setLevel(1);
    const firstSeq = [Math.floor(Math.random() * 4)];
    setSequence(firstSeq);
    playSequence(firstSeq);
  }

  function handlePad(padId: number) {
    if (phase !== "repeat") return;
    const newInput = [...userInput, padId];
    setUserInput(newInput);
    setActiveId(padId);
    setTimeout(() => setActiveId(null), 200);

    const pos = newInput.length - 1;
    if (newInput[pos] !== sequence[pos]) {
      const newLives = lives - 1;
      setLives(newLives);
      setPhase("wrong");
      clearTimeouts();
      if (newLives <= 0) {
        addStars(2);
        setTimeout(() => setPhase("gameover"), 800);
      } else {
        setTimeout(() => playSequence(sequence), 1000);
      }
      return;
    }

    if (newInput.length === sequence.length) {
      const pts = level * 10;
      setScore((s) => s + pts);
      setPhase("correct");
      clearTimeouts();

      if (level >= MAX_LEVELS) {
        addStars(5);
        setTimeout(() => setPhase("win"), 1000);
      } else {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(nextSeq);
        setTimeout(() => playSequence(nextSeq), 1200);
      }
    }
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
            <div className="text-5xl mb-3">🥁</div>
            <div className="font-display text-lg font-bold text-[#1E2A38] mb-1">Rythme Écho</div>
            <div className="text-sm text-[#7A8BA0] mb-4 max-w-xs mx-auto">
              Regarde la séquence de couleurs qui s'allume — puis reproduis-la dans le même ordre !
            </div>
            <div className="grid grid-cols-2 gap-2 max-w-[180px] mx-auto mb-6">
              {PADS.map((p) => (
                <div key={p.id} className="aspect-square rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: p.light, border: `3px solid ${p.color}` }}>
                  {p.label}
                </div>
              ))}
            </div>
            <button onClick={startGame} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #E05050, #FF922B)", color: "white", border: "none" }}>
              🥁 Commencer !
            </button>
          </motion.div>
        )}

        {(phase === "watch" || phase === "repeat" || phase === "correct" || phase === "wrong") && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Status bar */}
            <div className="flex justify-between items-center text-xs font-bold">
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} style={{ opacity: i < lives ? 1 : 0.2 }} className="text-lg">❤️</span>
                ))}
              </div>
              <div className="text-[#E05050]">Niveau {level}/{MAX_LEVELS}</div>
              <div className="text-[#FF922B]">⭐ {score} pts</div>
            </div>

            {/* Instruction */}
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm font-extrabold rounded-2xl py-2.5"
              style={{
                background: phase === "watch" ? "#DBEAFE" :
                             phase === "repeat" ? "#B8EDD9" :
                             phase === "correct" ? "#B8EDD9" : "#FDECEA",
                color: phase === "watch" ? "#1A4FA0" :
                       phase === "repeat" ? "#0F5C3A" :
                       phase === "correct" ? "#0F5C3A" : "#C02020",
              }}
            >
              {phase === "watch" ? `👀 Regarde bien la séquence (${sequence.length} étapes)…` :
               phase === "repeat" ? `🎯 À toi ! Reproduis les ${sequence.length} couleurs` :
               phase === "correct" ? "✅ Parfait ! Niveau suivant…" : "❌ Raté ! On réessaie…"}
            </motion.div>

            {/* Pads */}
            <div className="grid grid-cols-2 gap-3 max-w-[260px] mx-auto">
              {PADS.map((p) => {
                const isActive = activeId === p.id;
                const repeatDone = phase === "repeat" ? userInput.filter((x) => x === p.id).length : 0;
                return (
                  <motion.button
                    key={p.id}
                    whileTap={phase === "repeat" ? { scale: 0.88 } : {}}
                    onClick={() => handlePad(p.id)}
                    disabled={phase !== "repeat"}
                    animate={isActive ? { scale: 1.12 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 12 }}
                    className="aspect-square rounded-2xl flex items-center justify-center text-4xl border-4
                      transition-colors duration-100"
                    style={{
                      background: isActive ? p.color : p.light,
                      borderColor: p.color,
                      boxShadow: isActive ? `0 0 24px ${p.color}88` : "none",
                      cursor: phase === "repeat" ? "pointer" : "default",
                    }}
                  >
                    {p.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Progress dots */}
            {phase === "repeat" && (
              <div className="flex justify-center gap-1.5">
                {sequence.map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full transition-all"
                    style={{ background: i < userInput.length ? "#5CC7A0" : "#E2E8F0" }} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {(phase === "gameover" || phase === "win") && (
          <motion.div
            key={phase}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }}
            className="text-center py-4"
          >
            <div className="text-4xl mb-3">{phase === "win" ? "🏆🎉🌟" : "😅💪🥁"}</div>
            <div className="font-display text-xl font-extrabold mb-1"
              style={{ color: phase === "win" ? "#5CC7A0" : "#E05050" }}>
              {phase === "win" ? "Champion du rythme !" : "Bonne tentative !"}
            </div>
            <div className="text-sm text-[#7A8BA0] mb-4">
              Score : {score} pts · Niveau atteint : {level}
            </div>
            <div className="bg-[#DBEAFE] rounded-2xl p-3 mb-5 text-xs font-semibold text-[#1A4FA0]">
              🧠 Ce jeu entraîne ta <strong>mémoire de travail</strong> et ton sens du <strong>rythme</strong> !
            </div>
            <button onClick={startGame} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #E05050, #FF922B)", color: "white", border: "none" }}>
              🔄 Rejouer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
