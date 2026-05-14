"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "watch" | "recall" | "correct" | "wrong" | "win" | "gameover";

const COLORS = [
  "#5B9CF6", // bleu
  "#5CC7A0", // vert
  "#FFD93D", // jaune
  "#E05050", // rouge
  "#8E72DB", // violet
  "#FF922B", // orange
];

function buildPattern(size: number, filled: number): boolean[] {
  const grid = Array(size * size).fill(false);
  const indices = Array.from({ length: size * size }, (_, i) => i).sort(() => Math.random() - 0.5).slice(0, filled);
  indices.forEach((i) => (grid[i] = true));
  return grid;
}

function buildColors(size: number, filled: number, useMultiColor: boolean): (string | null)[] {
  const grid = Array(size * size).fill(null) as (string | null)[];
  const indices = Array.from({ length: size * size }, (_, i) => i).sort(() => Math.random() - 0.5).slice(0, filled);
  indices.forEach((i) => {
    grid[i] = useMultiColor ? COLORS[Math.floor(Math.random() * COLORS.length)] : COLORS[0];
  });
  return grid;
}

const LEVELS = [
  { size: 3, filled: 3, multiColor: false, label: "Niveau 1", desc: "Grille 3×3 · 3 cases" },
  { size: 3, filled: 4, multiColor: false, label: "Niveau 2", desc: "Grille 3×3 · 4 cases" },
  { size: 4, filled: 5, multiColor: false, label: "Niveau 3", desc: "Grille 4×4 · 5 cases" },
  { size: 4, filled: 6, multiColor: true,  label: "Niveau 4", desc: "Grille 4×4 · 6 couleurs" },
  { size: 4, filled: 8, multiColor: true,  label: "Niveau 5", desc: "Grille 4×4 · 8 couleurs" },
  { size: 5, filled: 9, multiColor: true,  label: "Niveau 6", desc: "Grille 5×5 · 9 couleurs" },
];

const WATCH_TIME = 2500;

export default function GrilleMemoire() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [levelIdx, setLevelIdx] = useState(0);
  const [pattern, setPattern] = useState<(string | null)[]>([]);
  const [userGrid, setUserGrid] = useState<(string | null)[]>([]);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const level = LEVELS[levelIdx];
  const size = level.size;

  function startLevel(idx: number) {
    const lv = LEVELS[idx];
    const p = buildColors(lv.size, lv.filled, lv.multiColor);
    setPattern(p);
    setUserGrid(Array(lv.size * lv.size).fill(null));
    setActiveColor(COLORS[0]);
    setPhase("watch");
    timerRef.current = setTimeout(() => setPhase("recall"), WATCH_TIME);
  }

  function start() {
    setScore(0);
    setErrors(0);
    setLevelIdx(0);
    startLevel(0);
  }

  function handleCellClick(i: number) {
    if (phase !== "recall") return;
    const newGrid = [...userGrid];
    if (newGrid[i] === activeColor) {
      newGrid[i] = null;
    } else {
      newGrid[i] = activeColor;
    }
    setUserGrid(newGrid);
  }

  function checkAnswer() {
    let correct = true;
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] !== userGrid[i]) {
        correct = false;
        break;
      }
    }
    if (correct) {
      setScore((s) => s + (levelIdx + 1) * 20);
      setPhase("correct");
      const next = levelIdx + 1;
      if (next >= LEVELS.length) {
        addStars(3);
        setTimeout(() => setPhase("win"), 900);
      } else {
        setTimeout(() => {
          setLevelIdx(next);
          startLevel(next);
        }, 1000);
      }
    } else {
      const newErrors = errors + 1;
      setErrors(newErrors);
      setPhase("wrong");
      if (newErrors >= 3) {
        setTimeout(() => setPhase("gameover"), 1000);
      } else {
        setTimeout(() => startLevel(levelIdx), 1000);
      }
    }
  }

  function countFilled(grid: (string | null)[]) {
    return grid.filter(Boolean).length;
  }

  const targetFilled = pattern.filter(Boolean).length;
  const userFilled = countFilled(userGrid);

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
            <div className="text-5xl mb-3">🟦</div>
            <div className="font-display text-lg font-bold text-[#1E2A38] mb-1">Grille Mémoire</div>
            <div className="text-sm text-[#7A8BA0] mb-5 max-w-xs mx-auto">
              Une grille colorée s'affiche brièvement — mémorise les cases, puis reproduis-la de mémoire !
            </div>
            <div className="grid grid-cols-2 gap-2 mb-5 text-left">
              {LEVELS.slice(0, 4).map((l, i) => (
                <div key={l.label} className="bg-[#F8F6F0] rounded-xl px-3 py-2 text-xs font-semibold text-[#7A8BA0]">
                  <span className="font-extrabold text-[#1E2A38]">{l.label}</span> · {l.desc}
                </div>
              ))}
            </div>
            <button onClick={start}
              className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #5B9CF6, #8E72DB)", color: "white", border: "none" }}>
              🟦 Démarrer !
            </button>
          </motion.div>
        )}

        {(phase === "watch" || phase === "recall" || phase === "correct" || phase === "wrong") && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {/* Header */}
            <div className="flex justify-between items-center text-xs font-bold">
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className="text-lg" style={{ opacity: i < 3 - errors ? 1 : 0.2 }}>❤️</span>
                ))}
              </div>
              <div className="font-extrabold text-[#5B9CF6]">{level.label}</div>
              <div className="text-[#FF922B]">⭐ {score} pts</div>
            </div>

            {/* Status banner */}
            <motion.div key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center text-sm font-extrabold py-2.5 rounded-2xl"
              style={{
                background: phase === "watch" ? "#DBEAFE" :
                             phase === "correct" ? "#B8EDD9" :
                             phase === "wrong" ? "#FDECEA" : "#F3F0FF",
                color: phase === "watch" ? "#1A4FA0" :
                       phase === "correct" ? "#0F5C3A" :
                       phase === "wrong" ? "#C02020" : "#3D1F8A",
              }}>
              {phase === "watch" ? `👀 Mémorise ! (${(WATCH_TIME / 1000).toFixed(1)}s)` :
               phase === "recall" ? `✏️ Reproduis les ${targetFilled} cases (${userFilled}/${targetFilled})` :
               phase === "correct" ? "✅ Parfait !" : "❌ Pas tout à fait…"}
            </motion.div>

            {/* Color picker (multi-color levels) */}
            {phase === "recall" && level.multiColor && (
              <div className="flex gap-2 justify-center">
                {COLORS.map((c) => (
                  <button key={c} onClick={() => setActiveColor(c)}
                    className="w-8 h-8 rounded-xl border-4 transition-all"
                    style={{
                      background: c,
                      borderColor: activeColor === c ? "#1E2A38" : "transparent",
                      transform: activeColor === c ? "scale(1.2)" : "scale(1)",
                    }} />
                ))}
              </div>
            )}

            {/* Grid */}
            <div className="flex justify-center">
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, width: `${size * 52}px` }}>
                {(phase === "watch" ? pattern : userGrid).map((cell, i) => {
                  const isTarget = phase !== "watch" && pattern[i];
                  return (
                    <motion.button
                      key={i}
                      whileTap={phase === "recall" ? { scale: 0.88 } : {}}
                      onClick={() => handleCellClick(i)}
                      disabled={phase !== "recall"}
                      className="rounded-xl border-2 transition-all"
                      style={{
                        width: 48,
                        height: 48,
                        background: cell || "#F0F4F8",
                        borderColor: cell ? "rgba(0,0,0,0.15)" : "#E2E8F0",
                        cursor: phase === "recall" ? "pointer" : "default",
                        boxShadow: cell ? `0 2px 8px ${cell}66` : "none",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {phase === "recall" && (
              <button onClick={checkAnswer}
                className="w-full py-3 rounded-2xl text-sm font-extrabold text-white transition-all"
                style={{
                  background: userFilled === targetFilled
                    ? "linear-gradient(135deg, #5B9CF6, #8E72DB)"
                    : "#CBD5E0",
                }}>
                ✅ Valider ma réponse
              </button>
            )}
          </motion.div>
        )}

        {(phase === "win" || phase === "gameover") && (
          <motion.div key={phase} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }} className="text-center py-4">
            <div className="text-4xl mb-3">{phase === "win" ? "🏆🟦🌟" : "😅💪🟦"}</div>
            <div className="font-display text-xl font-extrabold mb-1"
              style={{ color: phase === "win" ? "#5B9CF6" : "#E05050" }}>
              {phase === "win" ? "Mémoire spatiale au top !" : "Bien tenté !"}
            </div>
            <div className="text-sm text-[#7A8BA0] mb-4">
              Score : {score} pts · {phase === "win" ? `Tous les niveaux réussis !` : `Niveau ${levelIdx + 1} atteint`}
            </div>
            <div className="bg-[#DBEAFE] rounded-2xl p-3 mb-5 text-xs font-semibold text-[#1A4FA0]">
              🧠 Ce jeu entraîne ta <strong>mémoire spatiale</strong> — retenir où sont les objets dans l'espace !
            </div>
            <button onClick={start} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #5B9CF6, #8E72DB)", color: "white", border: "none" }}>
              🔄 Rejouer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}