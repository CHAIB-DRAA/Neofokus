"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "playing" | "feedback" | "win" | "lose";

interface Item {
  label: string;
  correct: "left" | "right";
}

interface Level {
  leftLabel: string;
  rightLabel: string;
  leftEmoji: string;
  rightEmoji: string;
  items: Item[];
}

const LEVELS: Level[] = [
  {
    leftLabel: "Léger", rightLabel: "Lourd",
    leftEmoji: "🪶", rightEmoji: "🪨",
    items: [
      { label: "Plume", correct: "left" },
      { label: "Rocher", correct: "right" },
      { label: "Bulle", correct: "left" },
      { label: "Montagne", correct: "right" },
      { label: "Papier", correct: "left" },
      { label: "Métal", correct: "right" },
    ],
  },
  {
    leftLabel: "Calme", rightLabel: "Énergique",
    leftEmoji: "😌", rightEmoji: "⚡",
    items: [
      { label: "Respiration lente", correct: "left" },
      { label: "Course rapide", correct: "right" },
      { label: "Lire un livre", correct: "left" },
      { label: "Sauter partout", correct: "right" },
      { label: "Méditation", correct: "left" },
      { label: "Danser vite", correct: "right" },
    ],
  },
  {
    leftLabel: "Aide en classe", rightLabel: "Distrait",
    leftEmoji: "📚", rightEmoji: "📵",
    items: [
      { label: "Écouter le prof", correct: "left" },
      { label: "Regarder par la fenêtre", correct: "right" },
      { label: "Prendre des notes", correct: "left" },
      { label: "Chatter avec un ami", correct: "right" },
      { label: "Lever la main", correct: "left" },
      { label: "Jouer en secret", correct: "right" },
    ],
  },
  {
    leftLabel: "Bienveillant", rightLabel: "Blessant",
    leftEmoji: "💚", rightEmoji: "💔",
    items: [
      { label: "Partager son goûter", correct: "left" },
      { label: "Se moquer", correct: "right" },
      { label: "Aider quelqu'un", correct: "left" },
      { label: "Taper", correct: "right" },
      { label: "Dire merci", correct: "left" },
      { label: "Insulter", correct: "right" },
    ],
  },
];

export default function GrandeBalance() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [levelIdx, setLevelIdx] = useState(0);
  const [itemIdx, setItemIdx] = useState(0);
  const [lives, setLives] = useState(3);
  const [correct, setCorrect] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [feedbackCorrect, setFeedbackCorrect] = useState(true);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const feedbackTimer = useRef(0);

  useEffect(() => () => clearTimeout(feedbackTimer.current), []);

  const level = LEVELS[levelIdx];
  const item = level.items[itemIdx];

  function startGame() {
    setLevelIdx(0);
    setItemIdx(0);
    setLives(3);
    setCorrect(0);
    setTotalCorrect(0);
    setTotalItems(0);
    setTilt(0);
    setPhase("playing");
  }

  function choose(side: "left" | "right") {
    if (phase !== "playing") return;
    const isCorrect = item.correct === side;
    setFeedbackCorrect(isCorrect);
    setTilt(side === "left" ? -1 : 1);
    setPhase("feedback");

    const newCorrect = correct + (isCorrect ? 1 : 0);
    const newLives = lives - (isCorrect ? 0 : 1);
    const newTotalCorrect = totalCorrect + (isCorrect ? 1 : 0);
    const newTotalItems = totalItems + 1;

    setCorrect(newCorrect);
    setLives(newLives);
    setTotalCorrect(newTotalCorrect);
    setTotalItems(newTotalItems);

    feedbackTimer.current = window.setTimeout(() => {
      setTilt(0);
      if (newLives <= 0) { setPhase("lose"); return; }
      const nextItem = itemIdx + 1;
      if (nextItem >= level.items.length) {
        const nextLevel = levelIdx + 1;
        if (nextLevel >= LEVELS.length) {
          const ratio = newTotalCorrect / newTotalItems;
          addStars(ratio >= 0.9 ? 5 : ratio >= 0.75 ? 4 : ratio >= 0.6 ? 3 : 2);
          setPhase("win");
        } else {
          setLevelIdx(nextLevel);
          setItemIdx(0);
          setCorrect(0);
          setPhase("playing");
        }
      } else {
        setItemIdx(nextItem);
        setPhase("playing");
      }
    }, 900);
  }

  const progress = level ? itemIdx / level.items.length : 0;

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">

        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-2">
            <div className="text-6xl mb-3">⚖️</div>
            <div className="font-display text-lg font-extrabold text-[#9C6800] mb-2">
              La Grande Balance
            </div>
            <div className="bg-[#FFF9C4] rounded-2xl p-4 mb-3 text-sm text-[#9C6800] font-semibold leading-relaxed text-left">
              Trie chaque carte du bon côté de la balance ! Entraîne ta flexibilité mentale en changeant de catégorie à chaque niveau.
            </div>
            <div className="text-xs text-[#7A8BA0] mb-5">
              🔬 Entraîne la flexibilité cognitive — le cerveau TDAH apprend à changer de règle (set-shifting)
            </div>
            <button onClick={startGame} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #FFD93D, #FF922B)", color: "white", border: "none" }}>
              ⚖️ Équilibrer !
            </button>
          </motion.div>
        )}

        {(phase === "playing" || phase === "feedback") && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A8BA0]">
                Niveau {levelIdx + 1} / {LEVELS.length}
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <span key={i} className="text-base" style={{ opacity: i <= lives ? 1 : 0.2 }}>❤️</span>
                ))}
              </div>
            </div>

            <div className="h-1.5 bg-[#E2E8F0] rounded-full mb-4 overflow-hidden">
              <motion.div className="h-full rounded-full bg-[#FFD93D]"
                animate={{ width: `${progress * 100}%` }} />
            </div>

            {/* Balance scale */}
            <div className="relative flex justify-center mb-5 h-36">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#9C6800] rounded-full z-10" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-[#9C6800]" />
              <motion.div
                className="absolute top-10 left-[calc(50%-80px)] w-40 h-1 bg-[#9C6800] rounded origin-center"
                animate={{ rotate: tilt * 18 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
              >
                <div className="absolute -top-1 -left-1 w-0.5 h-8 bg-[#C8A500]" />
                <div className="absolute top-7 -left-10 w-20 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "#FFF9C4", border: "2px solid #FFD93D" }}>
                  <span className="text-lg">{level.leftEmoji}</span>
                </div>
                <div className="absolute -top-1 -right-1 w-0.5 h-8 bg-[#C8A500]" />
                <div className="absolute top-7 -right-10 w-20 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "#FFF9C4", border: "2px solid #FFD93D" }}>
                  <span className="text-lg">{level.rightEmoji}</span>
                </div>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={`${levelIdx}-${itemIdx}`}
                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="rounded-2xl p-5 text-center mb-4 font-display text-xl font-extrabold text-[#1E2A38]"
                style={{
                  background: "#FFFDE7", border: "2px solid #FFD93D",
                  boxShadow: feedbackCorrect && phase === "feedback"
                    ? "0 0 0 3px #5CC7A0" : !feedbackCorrect && phase === "feedback"
                    ? "0 0 0 3px #E05050" : "none",
                }}>
                {item?.label}
                {phase === "feedback" && (
                  <span className="ml-2">{feedbackCorrect ? "✅" : "❌"}</span>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => choose("left")} disabled={phase === "feedback"}
                className="py-3 rounded-2xl font-display font-extrabold text-sm border-2 transition-all active:scale-95"
                style={{ background: "#FFF9C4", borderColor: "#FFD93D", color: "#9C6800",
                  opacity: phase === "feedback" ? 0.6 : 1 }}>
                {level.leftEmoji} {level.leftLabel}
              </button>
              <button onClick={() => choose("right")} disabled={phase === "feedback"}
                className="py-3 rounded-2xl font-display font-extrabold text-sm border-2 transition-all active:scale-95"
                style={{ background: "#FFF9C4", borderColor: "#FFD93D", color: "#9C6800",
                  opacity: phase === "feedback" ? 0.6 : 1 }}>
                {level.rightEmoji} {level.rightLabel}
              </button>
            </div>
          </motion.div>
        )}

        {phase === "lose" && (
          <motion.div key="lose" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }} className="text-center py-6">
            <div className="text-5xl mb-3">⚖️</div>
            <div className="font-display text-lg font-extrabold text-[#E05050] mb-2">
              La balance est déséquilibrée…
            </div>
            <div className="text-sm text-[#7A8BA0] mb-4">
              {totalCorrect} / {totalItems} bonnes réponses — réessaie !
            </div>
            <button onClick={startGame}
              className="w-full py-3 rounded-2xl font-display font-extrabold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #FFD93D, #FF922B)" }}>
              ⚖️ Réessayer
            </button>
          </motion.div>
        )}

        {phase === "win" && (
          <motion.div key="win" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="rounded-3xl p-6 text-center"
            style={{ background: "linear-gradient(135deg, #FFF9C4, #FFE0B2)" }}>
            <div className="text-4xl mb-2">⚖️✨</div>
            <div className="font-display text-xl font-extrabold text-[#9C4400] mb-1">
              Balance parfaite !
            </div>
            <div className="text-sm text-[#7A8BA0] mb-2">
              {totalCorrect} / {totalItems} — flexibilité mentale entraînée
            </div>
            <div className="text-xs text-[#4A5568] font-semibold mb-4">
              🔬 Ton cerveau vient de pratiquer le changement de règle — une fonction clé du cortex préfrontal.
            </div>
            <button onClick={startGame}
              className="w-full py-3 rounded-2xl font-display font-extrabold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #FFD93D, #FF922B)" }}>
              ⚖️ Rejouer
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
