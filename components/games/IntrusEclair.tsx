"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "playing" | "correct" | "wrong" | "gameover";

const GROUPS = [
  { category: "Animaux", items: ["🐶","🐱","🐸","🦊","🐼","🦁","🐨","🐯","🐻","🐰","🦋","🐬","🦄","🐷","🐮"] },
  { category: "Nourriture", items: ["🍎","🍊","🍋","🍇","🍓","🍕","🍦","🥕","🥑","🍰","🍜","🥗","🌮","🍩","🍒"] },
  { category: "Nature", items: ["🌸","⭐","🌙","☀️","❄️","🌊","🔥","🌈","🍀","🌺","🌻","🌴","🌿","🌾","🍁"] },
  { category: "Objets", items: ["🎈","⚽","📚","🎸","🏆","🎨","🚀","🎮","💡","🔑","🎁","🌟","🚂","🎯","🎻"] },
  { category: "Visages", items: ["😀","😂","😍","😎","😢","😡","😴","🤔","😱","🥳","😏","🤩","😇","🥺","😤"] },
];

function pick<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function buildRound(difficulty: number) {
  const gridSize = 4 + Math.min(difficulty, 4); // 4 to 8 items
  const correctGroup = GROUPS[Math.floor(Math.random() * GROUPS.length)];
  const wrongGroup = GROUPS.filter((g) => g.category !== correctGroup.category)[
    Math.floor(Math.random() * (GROUPS.length - 1))
  ];

  const mainItems = pick(correctGroup.items, gridSize - 1);
  const intrus = pick(wrongGroup.items, 1)[0];
  const intrusIdx = Math.floor(Math.random() * gridSize);

  const items = [...mainItems];
  items.splice(intrusIdx, 0, intrus);

  return { items, intrusIdx, correctGroup };
}

const TOTAL_ROUNDS = 8;

export default function IntrusEclair() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [current, setCurrent] = useState(() => buildRound(0));
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const nextRound = useCallback((r: number, diff: number) => {
    setCurrent(buildRound(diff));
    setSelectedIdx(null);
    setPhase("playing");
  }, []);

  function start() {
    setScore(0);
    setStreak(0);
    setLives(3);
    setRound(0);
    setCurrent(buildRound(0));
    setSelectedIdx(null);
    setPhase("playing");
  }

  function handlePick(idx: number) {
    if (phase !== "playing") return;
    setSelectedIdx(idx);
    const correct = idx === current.intrusIdx;

    if (correct) {
      const bonus = streak >= 2 ? 20 : 10;
      setScore((s) => s + bonus);
      setStreak((s) => s + 1);
      setPhase("correct");
      const next = round + 1;
      if (next >= TOTAL_ROUNDS) {
        addStars(3);
        setTimeout(() => setPhase("gameover"), 800);
      } else {
        setTimeout(() => {
          setRound(next);
          nextRound(next, Math.floor(next / 2));
        }, 700);
      }
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setStreak(0);
      setPhase("wrong");
      if (newLives <= 0) {
        addStars(1);
        setTimeout(() => setPhase("gameover"), 900);
      } else {
        setTimeout(() => {
          nextRound(round, Math.floor(round / 2));
        }, 900);
      }
    }
  }

  const cols = current.items.length <= 4 ? 2 : current.items.length <= 6 ? 3 : 4;

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
            <div className="text-5xl mb-3">🔍</div>
            <div className="font-display text-lg font-bold text-[#1E2A38] mb-1">Intrus Éclair</div>
            <div className="text-sm text-[#7A8BA0] mb-5 max-w-xs mx-auto">
              Un groupe d'émojis apparaît — trouve l'intrus qui ne fait pas partie de la même famille ! Plus vite tu trouves, plus tu gagnes.
            </div>
            <button onClick={start}
              className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #3A9FD4, #5CC7A0)", color: "white", border: "none" }}>
              🔍 Chercher !
            </button>
          </motion.div>
        )}

        {(phase === "playing" || phase === "correct" || phase === "wrong") && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center text-xs font-bold">
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className="text-lg" style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
                ))}
              </div>
              <div className="text-[#3A9FD4]">
                {round + 1}/{TOTAL_ROUNDS}
              </div>
              <div className="text-[#FF922B]">
                {streak >= 2 ? `🔥 ×${streak}` : ""} {score} pts
              </div>
            </div>

            {/* Progress */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full"
                style={{ width: `${(round / TOTAL_ROUNDS) * 100}%`, background: "#3A9FD4" }}
                transition={{ duration: 0.4 }} />
            </div>

            {/* Hint */}
            <motion.div
              key={phase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm font-extrabold py-2 rounded-2xl"
              style={{
                background: phase === "correct" ? "#B8EDD9" : phase === "wrong" ? "#FDECEA" : "#E8F7FF",
                color: phase === "correct" ? "#0F5C3A" : phase === "wrong" ? "#C02020" : "#1A5F7A",
              }}
            >
              {phase === "correct" ? "✅ Bravo, bien trouvé !" :
               phase === "wrong" ? `❌ Raté ! L'intrus était ${current.items[current.intrusIdx]}` :
               "👆 Tape l'émoji qui n'est pas de la même famille"}
            </motion.div>

            {/* Grid */}
            <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {current.items.map((emoji, i) => {
                const isIntrus = i === current.intrusIdx;
                const isSelected = selectedIdx === i;
                const revealed = phase === "correct" || phase === "wrong";
                return (
                  <motion.button
                    key={`${round}-${i}`}
                    whileTap={phase === "playing" ? { scale: 0.88 } : {}}
                    onClick={() => handlePick(i)}
                    disabled={phase !== "playing"}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.04, type: "spring", stiffness: 300 }}
                    className="aspect-square rounded-2xl flex items-center justify-center text-3xl border-2 transition-all"
                    style={{
                      background: revealed && isIntrus
                        ? "#FDECEA"
                        : revealed && isSelected && !isIntrus
                        ? "#FDECEA"
                        : "#F8F6F0",
                      borderColor: revealed && isIntrus
                        ? "#E05050"
                        : revealed && isSelected && !isIntrus
                        ? "#E05050"
                        : "#E2E8F0",
                      transform: revealed && isIntrus ? "scale(1.08)" : "scale(1)",
                    }}
                  >
                    {emoji}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {phase === "gameover" && (
          <motion.div key="gameover" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }} className="text-center py-4">
            <div className="text-4xl mb-3">{score >= 100 ? "🌟🔍🏆" : "🔍💪😊"}</div>
            <div className="font-display text-xl font-extrabold text-[#3A9FD4] mb-1">
              {score >= 100 ? "Détective de génie !" : "Bien joué !"}
            </div>
            <div className="text-sm text-[#7A8BA0] mb-4">Score final : {score} points</div>
            <div className="bg-[#BFE3F5] rounded-2xl p-3 mb-5 text-xs font-semibold text-[#1A5F7A]">
              👁️ Ce jeu entraîne ton <strong>attention sélective</strong> — la capacité à repérer vite ce qui est différent !
            </div>
            <button onClick={start} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #3A9FD4, #5CC7A0)", color: "white", border: "none" }}>
              🔄 Rejouer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}