"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "playing" | "win";

const EMOJI_POOL = [
  "🐶","🐱","🐸","🦊","🐼","🦁","🐨","🦋","🚀","🎸","🍕","🌈",
  "⭐","🎈","🏆","🌸","🔥","🎨","🍦","💡","🦄","🐬","🎯","🌙",
];

function buildDeck(pairs: number): { id: number; emoji: string; matched: boolean; flipped: boolean }[] {
  const emojis = [...EMOJI_POOL].sort(() => Math.random() - 0.5).slice(0, pairs);
  const cards = [...emojis, ...emojis].map((emoji, i) => ({
    id: i,
    emoji,
    matched: false,
    flipped: false,
  }));
  return cards.sort(() => Math.random() - 0.5).map((c, i) => ({ ...c, id: i }));
}

const LEVELS = [
  { pairs: 6, cols: 3, label: "Facile (6 paires)" },
  { pairs: 8, cols: 4, label: "Moyen (8 paires)" },
  { pairs: 10, cols: 4, label: "Difficile (10 paires)" },
];

export default function PairesMagiques() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(0);
  const [deck, setDeck] = useState(buildDeck(LEVELS[0].pairs));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [locked, setLocked] = useState(false);

  const totalPairs = LEVELS[level].pairs;
  const cols = LEVELS[level].cols;

  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  function start() {
    setDeck(buildDeck(LEVELS[level].pairs));
    setFlipped([]);
    setMoves(0);
    setMatched(0);
    setSeconds(0);
    setLocked(false);
    setPhase("playing");
  }

  function handleFlip(id: number) {
    if (locked || phase !== "playing") return;
    const card = deck[id];
    if (card.matched || card.flipped) return;
    if (flipped.length === 1 && flipped[0] === id) return;

    const newDeck = deck.map((c) => c.id === id ? { ...c, flipped: true } : c);
    setDeck(newDeck);

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    const firstId = flipped[0];
    const first = newDeck[firstId];
    const second = newDeck[id];
    setMoves((m) => m + 1);
    setFlipped([]);

    if (first.emoji === second.emoji) {
      const matched = newDeck.map((c) =>
        c.id === firstId || c.id === id ? { ...c, matched: true } : c
      );
      setDeck(matched);
      const newMatched = matched.filter((c) => c.matched).length / 2;
      setMatched(newMatched);
      if (newMatched >= totalPairs) { addStars(3); setTimeout(() => setPhase("win"), 400); }
    } else {
      setLocked(true);
      setTimeout(() => {
        setDeck((d) =>
          d.map((c) => c.id === firstId || c.id === id ? { ...c, flipped: false } : c)
        );
        setLocked(false);
      }, 900);
    }
  }

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
            <div className="text-5xl mb-3">🃏</div>
            <div className="font-display text-lg font-bold text-[#1E2A38] mb-1">Paires Magiques</div>
            <div className="text-sm text-[#7A8BA0] mb-4 max-w-xs mx-auto">
              Retourne les cartes et retrouve toutes les paires identiques !
            </div>
            <div className="flex flex-col gap-2 mb-5">
              {LEVELS.map((l, i) => (
                <button
                  key={l.label}
                  onClick={() => setLevel(i)}
                  className="py-2.5 px-4 rounded-2xl border-2 text-sm font-bold transition-all"
                  style={{
                    borderColor: level === i ? "#FF922B" : "#E2E8F0",
                    background: level === i ? "#FFE0B2" : "transparent",
                    color: level === i ? "#FF922B" : "#7A8BA0",
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <button onClick={start} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #FF922B, #FFD93D)", color: "white", border: "none" }}>
              🃏 Jouer !
            </button>
          </motion.div>
        )}

        {phase === "playing" && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Stats */}
            <div className="flex justify-between items-center mb-4 text-xs font-bold">
              <div className="text-[#FF922B]">🃏 {matched}/{totalPairs} paires</div>
              <div className="text-[#1A5F7A]">⏱️ {mins}:{secs}</div>
              <div className="text-[#7A8BA0]">🔄 {moves} retournements</div>
            </div>

            {/* Card grid */}
            <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {deck.map((card) => (
                <motion.button
                  key={card.id}
                  onClick={() => handleFlip(card.id)}
                  whileTap={{ scale: 0.93 }}
                  className="aspect-square rounded-2xl flex items-center justify-center text-2xl
                    border-2 transition-all duration-200"
                  style={{
                    background: card.matched
                      ? "#B8EDD9"
                      : card.flipped
                      ? "white"
                      : "linear-gradient(135deg, #7DC4E8, #5CC7A0)",
                    borderColor: card.matched ? "#5CC7A0" : card.flipped ? "#E2E8F0" : "transparent",
                    cursor: card.matched || card.flipped ? "default" : "pointer",
                  }}
                >
                  <AnimatePresence mode="wait">
                    {card.flipped || card.matched ? (
                      <motion.span
                        key="emoji"
                        initial={{ scale: 0, rotateY: 90 }}
                        animate={{ scale: 1, rotateY: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {card.emoji}
                      </motion.span>
                    ) : (
                      <motion.span key="back" className="text-white text-xl">❓</motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "win" && (
          <motion.div
            key="win"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 14 }}
            className="text-center py-4"
          >
            <div className="text-4xl mb-3">🎉🧠🏆</div>
            <div className="font-display text-xl font-extrabold text-[#FF922B] mb-1">
              Toutes les paires trouvées !
            </div>
            <div className="grid grid-cols-2 gap-2 my-4">
              {[
                { label: "Temps", value: `${mins}:${secs}`, color: "#1A5F7A" },
                { label: "Retournements", value: moves, color: "#FF922B" },
              ].map((s) => (
                <div key={s.label} className="bg-[#F8F6F0] rounded-2xl p-3">
                  <div className="font-display text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs font-bold text-[#7A8BA0]">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-[#FFE0B2] rounded-2xl p-3 mb-5 text-sm font-semibold text-[#9C4400]">
              🧠 Tu as entraîné ta <strong>mémoire visuelle</strong> et ta <strong>concentration</strong> !
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPhase("idle")}
                className="flex-1 py-3 rounded-2xl border-2 border-[#E2E8F0] text-sm font-bold text-[#7A8BA0]">
                Changer de niveau
              </button>
              <button onClick={start}
                className="flex-1 py-3 rounded-2xl text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, #FF922B, #FFD93D)" }}>
                🔄 Rejouer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
