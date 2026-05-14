"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type GameState = "idle" | "playing" | "finished";

export default function StopSignalGame() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [signal, setSignal] = useState<"go" | "stop">("go");
  const [scoreGood, setScoreGood] = useState(0);
  const [scoreBad, setScoreBad] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [shake, setShake] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const signalRef = useRef<NodeJS.Timeout | null>(null);
  const signalStateRef = useRef<"go" | "stop">("go");

  const clearAll = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (signalRef.current) clearTimeout(signalRef.current);
  };

  const scheduleNext = useCallback(() => {
    const isStop = Math.random() < 0.35;
    const delay = 700 + Math.random() * 1300;
    signalRef.current = setTimeout(() => {
      const newSignal = isStop ? "stop" : "go";
      setSignal(newSignal);
      signalStateRef.current = newSignal;
      if (isStop) {
        signalRef.current = setTimeout(() => {
          setSignal("go");
          signalStateRef.current = "go";
          scheduleNext();
        }, 900);
      } else {
        scheduleNext();
      }
    }, delay);
  }, []);

  const startGame = () => {
    clearAll();
    setScoreGood(0);
    setScoreBad(0);
    setTimeLeft(30);
    setSignal("go");
    signalStateRef.current = "go";
    setGameState("playing");

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearAll();
          useQuestStore.getState().addStars(2);
          setGameState("finished");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    scheduleNext();
  };

  const resetGame = () => {
    clearAll();
    setGameState("idle");
    setSignal("go");
    setScoreGood(0);
    setScoreBad(0);
    setTimeLeft(30);
  };

  useEffect(() => () => clearAll(), []);

  const handleClick = () => {
    if (gameState !== "playing") return;
    if (signalStateRef.current === "go") {
      setScoreGood((n) => n + 1);
    } else {
      setScoreBad((n) => n + 1);
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  const accuracy = scoreGood + scoreBad > 0
    ? Math.round((scoreGood / (scoreGood + scoreBad)) * 100)
    : 0;

  return (
    <div>
      {/* Instruction */}
      <div className="text-sm font-semibold text-[#1A5F7A] text-center mb-4">
        {gameState === "idle" && "Appuie sur DÉMARRER et clique quand c'est 🟢 vert — STOP si rouge !"}
        {gameState === "playing" && `⏱️ ${timeLeft}s — Clique sur VERT, arrête-toi sur ROUGE !`}
        {gameState === "finished" && `Terminé ! Précision : ${accuracy}%`}
      </div>

      {/* Signal circle */}
      <div className="flex justify-center mb-5">
        <motion.button
          onClick={handleClick}
          animate={shake ? { x: [-6, 6, -4, 4, 0] } : {}}
          transition={{ duration: 0.35 }}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl
            border-4 cursor-pointer transition-all duration-200 select-none ${
            signal === "go"
              ? "bg-[#C8F7D4] border-[#3DBE6E]"
              : "bg-[#FDECEA] border-[#E05050] scale-110"
          }`}
          style={{ boxShadow: signal === "stop" ? "0 0 20px rgba(224,80,80,0.3)" : "none" }}
        >
          {signal === "go" ? "🟢" : "🔴"}
        </motion.button>
      </div>

      {/* Scores */}
      <div className="flex justify-center gap-8 mb-5">
        <div className="text-center">
          <div className="font-display text-3xl font-extrabold text-[#1A5F7A]">{scoreGood}</div>
          <div className="text-xs font-semibold text-[#7A8BA0]">✅ Bons réflexes</div>
        </div>
        <div className="text-center">
          <div className="font-display text-3xl font-extrabold text-[#E05050]">{scoreBad}</div>
          <div className="text-xs font-semibold text-[#7A8BA0]">❌ Erreurs</div>
        </div>
      </div>

      {/* Finished result */}
      {gameState === "finished" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFF3CD] rounded-2xl p-4 text-center mb-4 border border-[#FFD93D]"
        >
          <div className="font-display text-lg font-bold text-[#9C6800]">
            {accuracy >= 80 ? "🌟 Excellent contrôle !" : accuracy >= 60 ? "👍 Bien joué !" : "💪 Continue à t'entraîner !"}
          </div>
          <div className="text-sm text-[#9C6800] font-semibold mt-1">
            {scoreGood + scoreBad} signaux — {accuracy}% de précision
          </div>
        </motion.div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        {gameState !== "playing" ? (
          <button onClick={startGame} className="btn-primary btn-mint flex-1 justify-center">
            {gameState === "finished" ? "🔄 Rejouer" : "▶ Démarrer"}
          </button>
        ) : (
          <button onClick={resetGame} className="btn-primary btn-mint flex-1 justify-center opacity-80">
            ⏹ Arrêter
          </button>
        )}
      </div>
    </div>
  );
}
