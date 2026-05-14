"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "showing" | "input" | "correct" | "wrong" | "gameover" | "win";

const FLASH_DURATION = 700;
const FLASH_GAP = 250;
const MAX_LEVEL = 9;

export default function ChiffreFantome() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [currentDigit, setCurrentDigit] = useState<number | null>(null);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  function clearTimeouts() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }

  const showSequence = useCallback((seq: number[]) => {
    setPhase("showing");
    setCurrentDigit(null);
    setUserInput([]);

    seq.forEach((digit, i) => {
      const t1 = setTimeout(() => setCurrentDigit(digit), i * (FLASH_DURATION + FLASH_GAP));
      const t2 = setTimeout(() => setCurrentDigit(null), i * (FLASH_DURATION + FLASH_GAP) + FLASH_DURATION);
      timeoutsRef.current.push(t1, t2);
    });

    const endTime = seq.length * (FLASH_DURATION + FLASH_GAP) + 400;
    const t3 = setTimeout(() => setPhase("input"), endTime);
    timeoutsRef.current.push(t3);
  }, []);

  function buildSequence(len: number): number[] {
    return Array.from({ length: len }, () => Math.floor(Math.random() * 9) + 1);
  }

  function start() {
    clearTimeouts();
    setLives(3);
    setScore(0);
    setLevel(1);
    const seq = buildSequence(2);
    setSequence(seq);
    showSequence(seq);
  }

  function handleDigit(d: number) {
    if (phase !== "input") return;
    const newInput = [...userInput, d];
    setUserInput(newInput);
    const pos = newInput.length - 1;

    if (newInput[pos] !== sequence[pos]) {
      const newLives = lives - 1;
      setLives(newLives);
      setPhase("wrong");
      clearTimeouts();
      if (newLives <= 0) {
        addStars(2);
        setTimeout(() => setPhase("gameover"), 900);
      } else {
        setTimeout(() => showSequence(sequence), 1100);
      }
      return;
    }

    if (newInput.length === sequence.length) {
      const pts = level * sequence.length * 5;
      setScore((s) => s + pts);
      setPhase("correct");
      clearTimeouts();
      const nextLevel = level + 1;
      if (nextLevel > MAX_LEVEL) {
        addStars(5);
        setTimeout(() => setPhase("win"), 1000);
      } else {
        setLevel(nextLevel);
        const len = nextLevel + 1; // level 1 → 2 digits, level 9 → 10 digits
        const seq = buildSequence(len);
        setSequence(seq);
        setTimeout(() => showSequence(seq), 1200);
      }
    }
  }

  function handleDelete() {
    if (phase !== "input" || userInput.length === 0) return;
    setUserInput((u) => u.slice(0, -1));
  }

  const KEYPAD = [1,2,3,4,5,6,7,8,9];

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
            <div className="text-5xl mb-3">👻</div>
            <div className="font-display text-lg font-bold text-[#1E2A38] mb-1">Chiffres Fantômes</div>
            <div className="text-sm text-[#7A8BA0] mb-5 max-w-xs mx-auto">
              Des chiffres apparaissent un à un puis disparaissent — retiens-les tous dans le bon ordre !
            </div>
            <div className="flex justify-center gap-2 mb-5">
              {[3,7,1,5].map((n, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-display text-xl font-extrabold"
                  style={{ background: "#1E2A38", color: "#FFD93D" }}>
                  {n}
                </motion.div>
              ))}
            </div>
            <button onClick={start}
              className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #1E2A38, #4A5568)", color: "#FFD93D", border: "none" }}>
              👻 Mémoriser !
            </button>
          </motion.div>
        )}

        {phase === "showing" && (
          <motion.div key="showing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="text-center text-xs font-bold text-[#7A8BA0] uppercase tracking-wider">
              Niveau {level} — séquence de {level + 1} chiffres
            </div>
            <div className="flex justify-center items-center" style={{ minHeight: 140 }}>
              <AnimatePresence mode="wait">
                {currentDigit !== null ? (
                  <motion.div
                    key={currentDigit + Math.random()}
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 14 }}
                    className="w-28 h-28 rounded-3xl flex items-center justify-center font-display text-6xl font-extrabold"
                    style={{ background: "#1E2A38", color: "#FFD93D", boxShadow: "0 8px 32px rgba(30,42,56,0.3)" }}
                  >
                    {currentDigit}
                  </motion.div>
                ) : (
                  <motion.div
                    key="blank"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-28 h-28 rounded-3xl flex items-center justify-center text-3xl"
                    style={{ background: "#F0F4F8", border: "3px dashed #CBD5E0" }}
                  >
                    👁️
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex justify-center gap-1.5">
              {sequence.map((_, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0]" />
              ))}
            </div>
          </motion.div>
        )}

        {(phase === "input" || phase === "correct" || phase === "wrong") && (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center text-xs font-bold">
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className="text-lg" style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
                ))}
              </div>
              <div style={{ color: "#FFD93D", background: "#1E2A38" }} className="px-3 py-1 rounded-full text-xs font-extrabold">
                Niv. {level} — {level + 1} chiffres
              </div>
              <div className="text-[#FF922B]">⭐ {score}</div>
            </div>

            {/* Status */}
            <div className="text-center text-sm font-extrabold py-2 rounded-2xl"
              style={{
                background: phase === "correct" ? "#B8EDD9" : phase === "wrong" ? "#FDECEA" : "#FFF9C4",
                color: phase === "correct" ? "#0F5C3A" : phase === "wrong" ? "#C02020" : "#9C6800",
              }}>
              {phase === "correct" ? "✅ Parfait !" :
               phase === "wrong" ? `❌ La séquence était : ${sequence.join(" ")}` :
               `🔢 Tape les ${sequence.length} chiffres dans l'ordre`}
            </div>

            {/* User answer display */}
            <div className="flex justify-center gap-2 min-h-[52px] items-center">
              {sequence.map((_, i) => (
                <div key={i}
                  className="w-11 h-11 rounded-xl flex items-center justify-center font-display text-xl font-extrabold border-2"
                  style={{
                    background: i < userInput.length ? "#1E2A38" : "#F0F4F8",
                    color: i < userInput.length ? "#FFD93D" : "#CBD5E0",
                    borderColor: i < userInput.length ? "#1E2A38" : "#E2E8F0",
                  }}>
                  {i < userInput.length ? userInput[i] : ""}
                </div>
              ))}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
              {KEYPAD.map((d) => (
                <motion.button key={d} whileTap={{ scale: 0.88 }} onClick={() => handleDigit(d)}
                  disabled={phase !== "input"}
                  className="h-12 rounded-2xl font-display text-xl font-extrabold border-2 transition-all"
                  style={{
                    background: "white", borderColor: "#E2E8F0", color: "#1E2A38",
                    opacity: phase !== "input" ? 0.5 : 1,
                  }}>
                  {d}
                </motion.button>
              ))}
              <div />
              <motion.button whileTap={{ scale: 0.88 }} onClick={() => handleDigit(0)}
                disabled={phase !== "input"}
                className="h-12 rounded-2xl font-display text-xl font-extrabold border-2"
                style={{ background: "white", borderColor: "#E2E8F0", color: "#1E2A38", opacity: phase !== "input" ? 0.5 : 1 }}>
                0
              </motion.button>
              <motion.button whileTap={{ scale: 0.88 }} onClick={handleDelete}
                disabled={phase !== "input"}
                className="h-12 rounded-2xl text-lg border-2"
                style={{ background: "#FDECEA", borderColor: "#FDECEA", color: "#E05050", opacity: phase !== "input" ? 0.5 : 1 }}>
                ⌫
              </motion.button>
            </div>
          </motion.div>
        )}

        {(phase === "gameover" || phase === "win") && (
          <motion.div key={phase} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }} className="text-center py-4">
            <div className="text-4xl mb-3">{phase === "win" ? "🏆👻🎉" : "👻💪🔢"}</div>
            <div className="font-display text-xl font-extrabold mb-1"
              style={{ color: phase === "win" ? "#FFD93D" : "#E05050" }}>
              {phase === "win" ? "Mémoire de champion !" : "Bien essayé !"}
            </div>
            <div className="text-sm text-[#7A8BA0] mb-4">
              Score : {score} pts · Niveau max atteint : {level}
            </div>
            <div className="bg-[#1E2A38] rounded-2xl p-3 mb-5 text-xs font-semibold text-[#FFD93D]">
              🔢 Tu as entraîné ton <strong>empan de chiffres</strong> — la capacité à retenir et manipuler des séquences numériques !
            </div>
            <button onClick={start} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #1E2A38, #4A5568)", color: "#FFD93D", border: "none" }}>
              🔄 Rejouer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}