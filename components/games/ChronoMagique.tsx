"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "ready" | "counting" | "result" | "win";

const TARGETS = [2, 3, 5, 8, 12]; // secondes

function accuracy(target: number, actual: number): number {
  const diff = Math.abs(target - actual);
  return Math.max(0, 1 - diff / target);
}

function starsFor(acc: number): number {
  if (acc >= 0.92) return 5;
  if (acc >= 0.80) return 4;
  if (acc >= 0.65) return 3;
  if (acc >= 0.45) return 2;
  return 1;
}

export default function ChronoMagique() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [roundIdx, setRoundIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [roundAcc, setRoundAcc] = useState(0);
  const [allAcc, setAllAcc] = useState<number[]>([]);

  const startRef = useRef(0);
  const rafRef = useRef(0);

  const tick = useCallback((now: number) => {
    setElapsed((now - startRef.current) / 1000);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  function startRound() {
    startRef.current = performance.now();
    setElapsed(0);
    setPhase("counting");
    rafRef.current = requestAnimationFrame(tick);
  }

  function stopTimer() {
    if (phase !== "counting") return;
    cancelAnimationFrame(rafRef.current);
    const actual = (performance.now() - startRef.current) / 1000;
    const target = TARGETS[roundIdx];
    const acc = accuracy(target, actual);
    setElapsed(actual);
    setRoundAcc(acc);
    const newAll = [...allAcc, acc];
    setAllAcc(newAll);
    setPhase("result");

    setTimeout(() => {
      const next = roundIdx + 1;
      if (next >= TARGETS.length) {
        const avg = newAll.reduce((a, b) => a + b, 0) / newAll.length;
        addStars(avg >= 0.85 ? 5 : avg >= 0.70 ? 4 : avg >= 0.55 ? 3 : 2);
        setPhase("win");
      } else {
        setRoundIdx(next);
        setPhase("ready");
      }
    }, 2000);
  }

  function startGame() {
    setRoundIdx(0);
    setAllAcc([]);
    setElapsed(0);
    setPhase("ready");
  }

  const target = TARGETS[roundIdx];
  const ringRatio = phase === "counting" ? Math.min(elapsed / target, 1.5) : 0;
  const ringColor = ringRatio > 1.1 ? "#E05050" : ringRatio > 0.85 ? "#FFD93D" : "#5CC7A0";

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">

        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
            <div className="text-6xl mb-3">⏱️</div>
            <div className="font-display text-lg font-extrabold text-[#1A5F7A] mb-2">Chrono Magique</div>
            <div className="bg-[#BFE3F5] rounded-2xl p-4 mb-3 text-sm text-[#1A5F7A] font-semibold leading-relaxed text-left">
              Tu vois une durée cible. Lance le chrono et arrête-le quand tu penses que le temps est écoulé — sans regarder les secondes !
            </div>
            <div className="text-xs text-[#7A8BA0] mb-5">
              🔬 Entraîne la perception du temps — déficit majeur du TDAH (Barkley 2011)
            </div>
            <button onClick={startGame} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #1A5F7A, #7DC4E8)", color: "white", border: "none" }}>
              ⏱️ Commencer
            </button>
          </motion.div>
        )}

        {phase === "ready" && (
          <motion.div key="ready" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A8BA0] mb-4">
              Ronde {roundIdx + 1} / {TARGETS.length}
            </div>
            <div className="font-display text-5xl font-extrabold text-[#1A5F7A] mb-2">{target}s</div>
            <div className="text-sm text-[#4A5568] font-semibold mb-6">
              Mémorise cette durée — puis arrête le chrono pile à ce moment !
            </div>
            <button onClick={startRound}
              className="w-full py-4 rounded-2xl font-display font-extrabold text-white text-lg"
              style={{ background: "linear-gradient(135deg, #5CC7A0, #1A5F7A)" }}>
              ▶️ Go !
            </button>
          </motion.div>
        )}

        {phase === "counting" && (
          <motion.div key="counting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A8BA0] mb-4">
              Cible : {target}s — Ronde {roundIdx + 1}
            </div>
            <div className="flex justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90 absolute inset-0" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#E2E8F0" strokeWidth="5" />
                  <motion.circle cx="50" cy="50" r="44" fill="none"
                    stroke={ringColor} strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 44 * Math.min(ringRatio, 1)} ${2 * Math.PI * 44}`}
                    transition={{ duration: 0 }} />
                </svg>
                <button onClick={stopTimer}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ cursor: "pointer" }}>
                  <span className="text-5xl">🛑</span>
                  <span className="text-[10px] font-extrabold text-[#7A8BA0] mt-1">TAP !</span>
                </button>
              </div>
            </div>
            <div className="text-sm font-bold text-[#7A8BA0]">
              Appuie quand tu penses que {target} secondes sont passées
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }} className="text-center py-4">
            <div className="text-5xl mb-2">
              {roundAcc >= 0.85 ? "🎯" : roundAcc >= 0.65 ? "👍" : "⏳"}
            </div>
            <div className="font-display text-lg font-extrabold text-[#1A5F7A] mb-1">
              {roundAcc >= 0.85 ? "Parfait !" : roundAcc >= 0.65 ? "Bien !" : "Pas tout à fait…"}
            </div>
            <div className="text-sm text-[#7A8BA0] mb-1">
              Cible : <b>{target}s</b> — Tu t'es arrêté à <b>{elapsed.toFixed(2)}s</b>
            </div>
            <div className="flex justify-center gap-1 mt-2">
              {[1,2,3,4,5].map((s) => (
                <span key={s} className="text-2xl"
                  style={{ opacity: s <= starsFor(roundAcc) ? 1 : 0.2 }}>⭐</span>
              ))}
            </div>
            <div className="text-xs text-[#7A8BA0] mt-2">Prochaine ronde…</div>
          </motion.div>
        )}

        {phase === "win" && (
          <motion.div key="win" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="rounded-3xl p-6 text-center"
            style={{ background: "linear-gradient(135deg, #BFE3F5, #B8EDD9)" }}>
            <div className="text-4xl mb-2">⏱️🎯</div>
            <div className="font-display text-xl font-extrabold text-[#1A5F7A] mb-1">Chrono maîtrisé !</div>
            <div className="flex justify-center gap-2 flex-wrap mb-3">
              {allAcc.map((a, i) => (
                <span key={i} className="text-xs font-bold bg-white/70 px-2 py-1 rounded-full text-[#1A5F7A]">
                  R{i+1}: {Math.round(a*100)}%
                </span>
              ))}
            </div>
            <div className="text-xs text-[#4A5568] font-semibold mb-4">
              🔬 Ton cerveau apprend à mesurer le temps — une compétence clé pour l'organisation au quotidien.
            </div>
            <button onClick={startGame}
              className="w-full py-3 rounded-2xl font-display font-extrabold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #1A5F7A, #7DC4E8)" }}>
              ⏱️ Rejouer
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
