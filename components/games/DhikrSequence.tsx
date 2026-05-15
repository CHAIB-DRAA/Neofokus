"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";
import { useTranslations } from "next-intl";

type Phase = "idle" | "watch" | "recall" | "feedback" | "win" | "lose";

const ORB_COLORS = [
  { id: 0, color: "#FFD93D", glow: "#FFD93D60" },
  { id: 1, color: "#5CC7A0", glow: "#5CC7A060" },
  { id: 2, color: "#7DC4E8", glow: "#7DC4E860" },
];

const ORB_SYMBOLS = ["☀️", "🌿", "💧"];

const TOTAL_ROUNDS = 7;
const BASE_LEN = 3;

function generateSequence(round: number): number[] {
  const len = BASE_LEN + round;
  return Array.from({ length: len }, () => Math.floor(Math.random() * 3));
}

export default function SequenceLumiere() {
  const t = useTranslations("g");
  const tg = useTranslations("game");
  const addStars = useQuestStore((s) => s.addStars);

  const orbLabels = [t("dhikr.orbSun"), t("dhikr.orbNature"), t("dhikr.orbWater")];

  const [phase, setPhase]       = useState<Phase>("idle");
  const [round, setRound]       = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [showing, setShowing]   = useState(-1);
  const [input, setInput]       = useState<number[]>([]);
  const [errors, setErrors]     = useState(0);
  const [lastCorrect, setLastCorrect] = useState(true);

  const showTimer = useRef(0);

  useEffect(() => () => clearTimeout(showTimer.current), []);

  const playSequence = useCallback((seq: number[]) => {
    setPhase("watch");
    setShowing(-1);
    let i = 0;
    function step() {
      if (i < seq.length) {
        setShowing(seq[i]);
        i++;
        showTimer.current = window.setTimeout(() => {
          setShowing(-1);
          showTimer.current = window.setTimeout(step, 400);
        }, 700);
      } else {
        setPhase("recall");
        setInput([]);
      }
    }
    showTimer.current = window.setTimeout(step, 600);
  }, []);

  function startGame() {
    setRound(0);
    setErrors(0);
    const seq = generateSequence(0);
    setSequence(seq);
    playSequence(seq);
  }

  function tap(orbId: number) {
    if (phase !== "recall") return;
    const newInput = [...input, orbId];
    setInput(newInput);

    const idx = newInput.length - 1;
    if (newInput[idx] !== sequence[idx]) {
      setLastCorrect(false);
      setPhase("feedback");
      const newErrors = errors + 1;
      setErrors(newErrors);
      showTimer.current = window.setTimeout(() => {
        if (newErrors >= 3) {
          setPhase("lose");
        } else {
          playSequence(sequence);
        }
        setLastCorrect(true);
      }, 1000);
      return;
    }

    if (newInput.length === sequence.length) {
      setLastCorrect(true);
      setPhase("feedback");
      const nextRound = round + 1;
      showTimer.current = window.setTimeout(() => {
        if (nextRound >= TOTAL_ROUNDS) {
          const ratio = 1 - errors / (TOTAL_ROUNDS * 2);
          addStars(ratio >= 0.85 ? 5 : ratio >= 0.7 ? 4 : ratio >= 0.5 ? 3 : 2);
          setPhase("win");
        } else {
          setRound(nextRound);
          const seq = generateSequence(nextRound);
          setSequence(seq);
          playSequence(seq);
        }
      }, 700);
    }
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">

        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-2">
            <div className="text-6xl mb-3">💡</div>
            <div className="font-display text-lg font-extrabold text-[#3D1F8A] mb-2">
              Light Sequence
            </div>
            <div className="bg-[#E8E0F8] rounded-2xl p-4 mb-3 text-sm text-[#3D1F8A] font-semibold leading-relaxed text-left">
              {t("dhikr.idle")}
            </div>
            <div className="text-xs text-[#7A8BA0] mb-5">
              {t("dhikr.science")}
            </div>
            <button onClick={startGame} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #8E72DB, #5B8EDB)", color: "white", border: "none" }}>
              {t("dhikr.startBtn")}
            </button>
          </motion.div>
        )}

        {(phase === "watch" || phase === "recall" || phase === "feedback") && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A8BA0]">
                {t("dhikr.round", { current: round + 1, total: TOTAL_ROUNDS, n: sequence.length })}
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <span key={i} className="text-base" style={{ opacity: i <= (3 - errors) ? 1 : 0.2 }}>💜</span>
                ))}
              </div>
            </div>

            <div className="text-center text-sm font-bold text-[#8E72DB] mb-6 h-6">
              {phase === "watch" && t("dhikr.watch")}
              {phase === "recall" && t("dhikr.recall")}
              {phase === "feedback" && (lastCorrect ? t("dhikr.correct") : t("dhikr.wrong"))}
            </div>

            <div className="flex justify-center gap-5 mb-6">
              {ORB_COLORS.map((orb) => {
                const isLit = showing === orb.id;
                const inputActive = phase === "recall";
                return (
                  <motion.button
                    key={orb.id}
                    onClick={() => tap(orb.id)}
                    disabled={!inputActive}
                    animate={{
                      scale: isLit ? 1.25 : 1,
                      boxShadow: isLit
                        ? `0 0 32px 10px ${orb.glow}`
                        : `0 0 8px 2px ${orb.glow}`,
                    }}
                    whileTap={inputActive ? { scale: 0.88 } : {}}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="w-20 h-20 rounded-full flex flex-col items-center justify-center text-2xl border-4"
                    style={{
                      background: isLit ? orb.color : `${orb.color}44`,
                      borderColor: orb.color,
                      cursor: inputActive ? "pointer" : "default",
                    }}
                  >
                    {ORB_SYMBOLS[orb.id]}
                    <span className="text-[9px] font-bold mt-0.5"
                      style={{ color: isLit ? "#1E2A38" : orb.color }}>
                      {orbLabels[orb.id]}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex justify-center gap-1.5">
              {sequence.map((_, i) => {
                const tapped = input[i];
                return (
                  <motion.div key={i}
                    animate={{ scale: tapped !== undefined ? 1 : 0.7 }}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: tapped !== undefined ? ORB_COLORS[tapped].color : "#E2E8F0" }} />
                );
              })}
            </div>
          </motion.div>
        )}

        {phase === "lose" && (
          <motion.div key="lose" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }} className="text-center py-6">
            <div className="text-5xl mb-3">💡</div>
            <div className="font-display text-lg font-extrabold text-[#E05050] mb-2">
              {t("dhikr.loseTitle")}
            </div>
            <div className="text-sm text-[#7A8BA0] mb-4">
              {t("dhikr.loseDesc", { round: round + 1 })}
            </div>
            <button onClick={startGame}
              className="w-full py-3 rounded-2xl font-display font-extrabold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #8E72DB, #5B8EDB)" }}>
              💡 {tg("tryAgain")}
            </button>
          </motion.div>
        )}

        {phase === "win" && (
          <motion.div key="win" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="rounded-3xl p-6 text-center"
            style={{ background: "linear-gradient(135deg, #E8E0F8, #BFE3F5)" }}>
            <div className="text-4xl mb-2">💡✨</div>
            <div className="font-display text-xl font-extrabold text-[#3D1F8A] mb-1">
              {t("dhikr.winTitle")}
            </div>
            <div className="text-sm text-[#7A8BA0] mb-3">
              {t("dhikr.winDesc", { rounds: TOTAL_ROUNDS })}
            </div>
            <div className="text-xs text-[#4A5568] font-semibold mb-4">
              {t("dhikr.winScience")}
            </div>
            <button onClick={startGame}
              className="w-full py-3 rounded-2xl font-display font-extrabold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #8E72DB, #5B8EDB)" }}>
              💡 {tg("replay")}
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
