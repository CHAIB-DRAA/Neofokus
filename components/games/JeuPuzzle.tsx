"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "playing" | "won";

const TILE_COLORS: Record<number, string> = {
  1:  "#E05050", 2:  "#FF922B", 3:  "#FFD93D",
  4:  "#5CC7A0", 5:  "#3A9FD4", 6:  "#5B9CF6",
  7:  "#8E72DB", 8:  "#C084FC", 9:  "#FF7EB3",
  10: "#4ECDC4", 11: "#FF7B54", 12: "#7DC4E8",
  13: "#B8A8F0", 14: "#86EFAC", 15: "#FCA5A5",
};

// Théorème de solvabilité du Taquin
function isSolvable(tiles: number[], size: number): boolean {
  const flat = tiles.filter((t) => t !== 0);
  let inversions = 0;
  for (let i = 0; i < flat.length; i++)
    for (let j = i + 1; j < flat.length; j++)
      if (flat[i] > flat[j]) inversions++;

  if (size % 2 === 1) return inversions % 2 === 0;
  const blankRowFromBottom = size - Math.floor(tiles.indexOf(0) / size);
  return (inversions + blankRowFromBottom) % 2 === 1;
}

function isSolved(tiles: number[]): boolean {
  for (let i = 0; i < tiles.length - 1; i++)
    if (tiles[i] !== i + 1) return false;
  return tiles[tiles.length - 1] === 0;
}

function createShuffled(size: number): number[] {
  const n = size * size;
  const goal = [...Array.from({ length: n - 1 }, (_, i) => i + 1), 0];
  let tiles: number[];
  let tries = 0;
  do {
    tiles = [...goal].sort(() => Math.random() - 0.5);
    tries++;
  } while ((!isSolvable(tiles, size) || isSolved(tiles)) && tries < 1000);
  return tiles;
}

export default function JeuPuzzle() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [size, setSize] = useState(3);
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [lastMoved, setLastMoved] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const tileSize = size === 3 ? 82 : 62;
  const gap = 6;
  const gridWidth = size * tileSize + (size - 1) * gap;

  useEffect(() => {
    if (phase === "playing") {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  function start() {
    if (timerRef.current) clearInterval(timerRef.current);
    setTiles(createShuffled(size));
    setMoves(0);
    setSeconds(0);
    setLastMoved(null);
    setPhase("playing");
  }

  function handleTile(idx: number) {
    if (phase !== "playing") return;
    const blankIdx = tiles.indexOf(0);
    const row = Math.floor(idx / size), col = idx % size;
    const bRow = Math.floor(blankIdx / size), bCol = blankIdx % size;
    const adjacent =
      (Math.abs(row - bRow) === 1 && col === bCol) ||
      (Math.abs(col - bCol) === 1 && row === bRow);
    if (!adjacent) return;

    const next = [...tiles];
    [next[idx], next[blankIdx]] = [next[blankIdx], next[idx]];
    setTiles(next);
    setLastMoved(tiles[idx]);
    setMoves((m) => m + 1);

    if (isSolved(next)) {
      clearInterval(timerRef.current!);
      addStars(size === 3 ? 3 : 5);
      setTimeout(() => setPhase("won"), 150);
    }
  }

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const isGoodScore = moves <= (size === 3 ? 35 : 100);

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">

        {/* ── IDLE ── */}
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-4">
            <div className="text-5xl mb-3">🧩</div>
            <div className="font-display text-lg font-bold text-[#1E2A38] mb-1">
              Puzzle Taquin
            </div>
            <div className="text-sm text-[#7A8BA0] mb-5 max-w-xs mx-auto">
              Glisse les pièces pour remettre les chiffres dans l'ordre — de <strong>1</strong> à la fin,
              avec le trou en dernière case !
            </div>

            {/* Preview de l'objectif */}
            <div className="flex justify-center gap-1 mb-5">
              {Array.from({ length: size * size }, (_, i) => (
                <div key={i}
                  className="flex items-center justify-center rounded-lg font-display font-extrabold text-white text-xs"
                  style={{
                    width: 28, height: 28,
                    background: i < size * size - 1 ? TILE_COLORS[i + 1] : "#E2E8F0",
                    fontSize: 10,
                  }}>
                  {i < size * size - 1 ? i + 1 : ""}
                </div>
              ))}
            </div>

            {/* Niveau */}
            <div className="flex gap-2 max-w-[200px] mx-auto mb-5">
              {[3, 4].map((s) => (
                <button key={s} onClick={() => setSize(s)}
                  className="flex-1 py-3 rounded-2xl border-2 transition-all"
                  style={{
                    borderColor: size === s ? "#5B9CF6" : "#E2E8F0",
                    background: size === s ? "#DBEAFE" : "transparent",
                    color: size === s ? "#1A4FA0" : "#7A8BA0",
                  }}>
                  <div className="font-display text-base font-extrabold">{s}×{s}</div>
                  <div className="text-[10px] font-semibold">{s === 3 ? "Facile" : "Difficile"}</div>
                </button>
              ))}
            </div>

            <button onClick={start} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #5B9CF6, #8E72DB)", color: "white", border: "none" }}>
              🧩 Commencer !
            </button>
          </motion.div>
        )}

        {/* ── PLAYING / WON ── */}
        {(phase === "playing" || phase === "won") && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

            {/* Stats */}
            <div className="flex justify-between items-center text-xs font-bold">
              <div className="text-[#5B9CF6]">🔄 {moves} coup{moves !== 1 ? "s" : ""}</div>
              <div className="text-[#FF922B]">⏱️ {mins}:{secs}</div>
              <button onClick={start}
                className="text-[#7A8BA0] hover:text-[#E05050] transition-colors text-xs font-bold">
                🔀 Nouveau
              </button>
            </div>

            {/* Grille */}
            <div className="flex justify-center">
              <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${size}, ${tileSize}px)`,
                gridTemplateRows: `repeat(${size}, ${tileSize}px)`,
                gap: `${gap}px`,
                width: gridWidth,
              }}>
                {tiles.map((value, idx) =>
                  value === 0 ? (
                    <div key="blank"
                      style={{
                        width: tileSize, height: tileSize,
                        borderRadius: 14,
                        border: "2px dashed #E2E8F0",
                        background: "#F8F6F0",
                      }} />
                  ) : (
                    <motion.button
                      key={value}
                      layout
                      whileTap={{ scale: 0.91 }}
                      onClick={() => handleTile(idx)}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      style={{
                        width: tileSize,
                        height: tileSize,
                        background: phase === "won"
                          ? `linear-gradient(135deg, ${TILE_COLORS[value]}CC, ${TILE_COLORS[value]})`
                          : TILE_COLORS[value],
                        borderRadius: 14,
                        border: "none",
                        cursor: "pointer",
                        color: "white",
                        fontFamily: "'Baloo 2', sans-serif",
                        fontSize: size === 3 ? 26 : 20,
                        fontWeight: 900,
                        boxShadow: lastMoved === value
                          ? `0 0 16px ${TILE_COLORS[value]}88`
                          : "0 3px 8px rgba(0,0,0,0.15)",
                        outline: "none",
                      }}
                    >
                      {value}
                    </motion.button>
                  )
                )}
              </div>
            </div>

            {/* Victoire */}
            <AnimatePresence>
              {phase === "won" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 14 }}
                  className="rounded-3xl p-5 text-center"
                  style={{ background: "linear-gradient(135deg, #B8EDD9, #DBEAFE)" }}
                >
                  <div className="text-4xl mb-2">🎉🧩🌟</div>
                  <div className="font-display text-xl font-extrabold text-[#0F5C3A] mb-1">
                    Puzzle résolu !
                  </div>
                  <div className="text-sm font-bold text-[#1A5F7A]">
                    {moves} coups · {mins}:{secs}
                  </div>
                  <div className="mt-2 text-xs font-extrabold"
                    style={{ color: isGoodScore ? "#FF922B" : "#5CC7A0" }}>
                    {isGoodScore ? "⭐ Score optimal — cerveau de champion !" : "💪 Bien joué !"}
                  </div>
                  <div className="text-xs text-[#4A5568] mt-2 font-semibold">
                    🔬 Le Taquin entraîne la <strong>planification</strong> et la <strong>mémoire de travail</strong> — deux fonctions clés du TDAH.
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setPhase("idle")}
                      className="flex-1 py-2.5 rounded-2xl border-2 border-[#E2E8F0] text-sm font-bold text-[#7A8BA0]">
                      Changer
                    </button>
                    <button onClick={start}
                      className="flex-1 py-2.5 rounded-2xl text-sm font-extrabold text-white"
                      style={{ background: "linear-gradient(135deg, #5B9CF6, #8E72DB)" }}>
                      🔄 Rejouer
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}