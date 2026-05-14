"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "playing" | "correct" | "wrong" | "win";

const ANIMALS = [
  { emoji: "🐶", name: "Chien" },
  { emoji: "🐱", name: "Chat" },
  { emoji: "🐸", name: "Grenouille" },
  { emoji: "🦊", name: "Renard" },
  { emoji: "🐻", name: "Ours" },
  { emoji: "🐨", name: "Koala" },
  { emoji: "🐯", name: "Tigre" },
  { emoji: "🦁", name: "Lion" },
  { emoji: "🐷", name: "Cochon" },
  { emoji: "🦋", name: "Papillon" },
];

const COLORS = [
  { name: "Rouge", hex: "#E05050", light: "#FDECEA" },
  { name: "Bleu", hex: "#5B9CF6", light: "#DBEAFE" },
  { name: "Vert", hex: "#5CC7A0", light: "#B8EDD9" },
  { name: "Jaune", hex: "#FFD93D", light: "#FFF9C4" },
  { name: "Violet", hex: "#8E72DB", light: "#E8E0F8" },
  { name: "Orange", hex: "#FF922B", light: "#FFE0B2" },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function CouleursRigolos() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [animal, setAnimal] = useState(ANIMALS[0]);
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [options, setOptions] = useState<typeof COLORS>([]);
  const [lastAnswer, setLastAnswer] = useState<string | null>(null);

  const totalRounds = 8;

  function nextRound(currentRound: number) {
    if (currentRound >= totalRounds) {
      addStars(2);
      setPhase("win");
      return;
    }
    const a = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    const distractors = shuffle(COLORS.filter((x) => x.name !== c.name)).slice(0, 3);
    setAnimal(a);
    setTargetColor(c);
    setOptions(shuffle([c, ...distractors]));
    setLastAnswer(null);
    setPhase("playing");
  }

  function start() {
    setScore(0);
    setRound(0);
    nextRound(0);
  }

  function handlePick(color: (typeof COLORS)[0]) {
    if (phase !== "playing") return;
    const correct = color.name === targetColor.name;
    setLastAnswer(color.name);
    if (correct) {
      setScore((s) => s + 1);
      setPhase("correct");
      setTimeout(() => {
        const next = round + 1;
        setRound(next);
        nextRound(next);
      }, 900);
    } else {
      setPhase("wrong");
      setTimeout(() => {
        setPhase("playing");
        setLastAnswer(null);
      }, 800);
    }
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
            <div className="text-6xl mb-4">🎨</div>
            <div className="font-display text-xl font-bold text-[#1E2A38] mb-2">Couleurs Rigolos</div>
            <div className="text-sm text-[#7A8BA0] mb-6 max-w-xs mx-auto">
              Un animal apparaît avec une couleur — appuie sur la bonne couleur ! 🌈
            </div>
            <button onClick={start} className="btn-primary btn-mint mx-auto text-lg py-4 px-8">
              🎨 Jouer !
            </button>
          </motion.div>
        )}

        {(phase === "playing" || phase === "correct" || phase === "wrong") && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            {/* Progress */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "#5CC7A0", width: `${(round / totalRounds) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="text-xs font-bold text-[#7A8BA0]">{round}/{totalRounds}</div>
            </div>

            {/* Animal card */}
            <div className="flex flex-col items-center">
              <motion.div
                key={animal.emoji + targetColor.hex}
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 14 }}
                className="w-36 h-36 rounded-3xl flex flex-col items-center justify-center gap-2 border-4"
                style={{
                  background: targetColor.light,
                  borderColor: targetColor.hex,
                  boxShadow: `0 6px 24px ${targetColor.hex}44`,
                }}
              >
                <span className="text-6xl">{animal.emoji}</span>
              </motion.div>
              <div
                className="mt-3 px-5 py-1.5 rounded-full text-sm font-extrabold"
                style={{ background: targetColor.light, color: targetColor.hex }}
              >
                Quelle couleur ?
              </div>
            </div>

            {/* Color buttons */}
            <div className="grid grid-cols-2 gap-3">
              {options.map((c) => {
                const isCorrect = phase === "correct" && c.name === targetColor.name;
                const isWrong = phase === "wrong" && c.name === lastAnswer;
                return (
                  <motion.button
                    key={c.name}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handlePick(c)}
                    disabled={phase !== "playing"}
                    className="py-5 rounded-3xl text-lg font-extrabold border-4 transition-all"
                    style={{
                      background: isCorrect ? c.light : isWrong ? "#FDECEA" : c.light,
                      borderColor: isCorrect ? "#5CC7A0" : isWrong ? "#E05050" : c.hex,
                      color: isWrong ? "#E05050" : c.hex,
                      transform: isCorrect ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    {isCorrect ? "✅" : isWrong ? "❌" : c.name}
                  </motion.button>
                );
              })}
            </div>

            {/* Score */}
            <div className="flex justify-center gap-1">
              {Array.from({ length: totalRounds }).map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full transition-all"
                  style={{ background: i < score ? "#5CC7A0" : "#E2E8F0" }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {phase === "win" && (
          <motion.div
            key="win"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 12 }}
            className="text-center py-6"
          >
            <div className="text-5xl mb-4">🎉🌈⭐</div>
            <div className="font-display text-2xl font-extrabold text-[#5CC7A0] mb-2">
              Bravo champion·ne !
            </div>
            <div className="text-sm text-[#7A8BA0] mb-2">Tu as trouvé {score} bonnes couleurs sur {totalRounds} !</div>
            <div className="bg-[#B8EDD9] rounded-2xl p-4 mb-5">
              <div className="font-bold text-[#0F5C3A]">
                {score >= 7 ? "🌟 Tu es un expert des couleurs !" : score >= 5 ? "🎨 Très bien joué !" : "💪 Continue, tu t'améliores !"}
              </div>
            </div>
            <button onClick={start} className="btn-primary btn-mint mx-auto">
              🔄 Rejouer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
