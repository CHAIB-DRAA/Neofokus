"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";
import { useTranslations } from "next-intl";

type Phase = "idle" | "growing" | "result" | "win";

const ROUNDS = [4000, 6000, 9000, 12000, 16000];

const STAGE_EMOJIS = ["🌱", "🌿", "🪴", "🌺", "🌸", "🌻"];
const STAGE_MINS =   [0,    0.2,  0.4,  0.6,  0.8,  1.0];

function getStageIdx(r: number) {
  for (let i = STAGE_EMOJIS.length - 1; i >= 0; i--)
    if (r >= STAGE_MINS[i]) return i;
  return 0;
}

function starsFor(r: number): number {
  if (r >= 1.0) return 5;
  if (r >= 0.8) return 4;
  if (r >= 0.6) return 3;
  if (r >= 0.4) return 2;
  if (r >= 0.2) return 1;
  return 0;
}

export default function JardinZen() {
  const t = useTranslations("g");
  const stageLabels = t.raw("sabr.stageLabels") as string[];
  const tips = t.raw("sabr.tips") as string[];

  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [roundIdx, setRoundIdx] = useState(0);
  const [ratio, setRatio] = useState(0);
  const [harvestRatio, setHarvestRatio] = useState(0);
  const [earned, setEarned] = useState<number[]>([]);

  const startRef  = useRef(0);
  const rafRef    = useRef(0);
  const totalRef  = useRef(ROUNDS[0]);
  const earnedRef = useRef<number[]>([]);

  const tick = useCallback((now: number) => {
    const r = Math.min((now - startRef.current) / totalRef.current, 1);
    setRatio(r);
    if (r < 1) rafRef.current = requestAnimationFrame(tick);
  }, []);

  function beginRound(idx: number) {
    totalRef.current = ROUNDS[idx];
    startRef.current = performance.now();
    setRatio(0);
    setRoundIdx(idx);
    setPhase("growing");
    rafRef.current = requestAnimationFrame(tick);
  }

  function start() {
    earnedRef.current = [];
    setEarned([]);
    beginRound(0);
  }

  function harvest() {
    if (phase !== "growing") return;
    cancelAnimationFrame(rafRef.current);
    const r = Math.min((performance.now() - startRef.current) / totalRef.current, 1);
    setHarvestRatio(r);
    const s = starsFor(r);
    const newEarned = [...earnedRef.current, s];
    earnedRef.current = newEarned;
    setEarned(newEarned);
    setPhase("result");

    setTimeout(() => {
      const next = roundIdx + 1;
      if (next >= ROUNDS.length) {
        const avg = newEarned.reduce((a, b) => a + b, 0) / newEarned.length;
        addStars(avg >= 4 ? 5 : avg >= 3 ? 4 : avg >= 2 ? 3 : 2);
        setPhase("win");
      } else {
        beginRound(next);
      }
    }, 1800);
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const stageIdx = getStageIdx(ratio);
  const previewStars = starsFor(ratio);

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">

        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-2">
            <div className="text-6xl mb-3">🌱</div>
            <div className="font-display text-lg font-extrabold text-[#0F5C3A] mb-2">
              Patience Garden
            </div>
            <div className="bg-[#B8EDD9] rounded-2xl p-4 mb-3 text-sm text-[#0F5C3A] font-semibold leading-relaxed text-left">
              {t("sabr.idle")}
            </div>
            <div className="text-xs text-[#7A8BA0] mb-5">
              {t("sabr.science")}
            </div>
            <button onClick={start} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #5CC7A0, #3A9FD4)", color: "white", border: "none" }}>
              {t("sabr.plantBtn")}
            </button>
          </motion.div>
        )}

        {phase === "growing" && (
          <motion.div key="growing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A8BA0] mb-1">
              {t("sabr.round", { current: roundIdx + 1, total: ROUNDS.length })}
            </div>
            <div className="text-xs font-semibold text-[#4A5568] italic mb-5 h-8 flex items-center justify-center px-4">
              {tips[roundIdx]}
            </div>

            <div className="flex justify-center mb-3">
              <div className="relative w-44 h-44">
                <svg className="w-full h-full -rotate-90 absolute inset-0" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#E2E8F0" strokeWidth="5" />
                  <motion.circle cx="50" cy="50" r="44" fill="none"
                    stroke={ratio >= 1 ? "#FFD93D" : "#5CC7A0"} strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 44 * ratio} ${2 * Math.PI * 44}`}
                  />
                </svg>
                <motion.button
                  onClick={harvest}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  animate={{ scale: 1 + ratio * 0.25 }}
                  transition={{ type: "spring", stiffness: 120 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span style={{ fontSize: 56 }}>{STAGE_EMOJIS[stageIdx]}</span>
                </motion.button>
              </div>
            </div>

            <div className="font-display text-sm font-bold text-[#0F5C3A] mb-2">{stageLabels[stageIdx]}</div>

            <div className="flex justify-center gap-1 mb-5">
              {[1,2,3,4,5].map((s) => (
                <motion.span key={s} animate={{ scale: s <= previewStars ? 1.1 : 0.9 }}
                  className="text-xl" style={{ opacity: s <= previewStars ? 1 : 0.2 }}>
                  ⭐
                </motion.span>
              ))}
            </div>

            <button onClick={harvest}
              className="w-full py-3.5 rounded-2xl font-display font-extrabold border-2 transition-all text-sm"
              style={{
                background: ratio >= 1 ? "linear-gradient(135deg,#5CC7A0,#3A9FD4)" : "#F8F6F0",
                borderColor: ratio >= 1 ? "#5CC7A0" : "#E2E8F0",
                color: ratio >= 1 ? "white" : "#7A8BA0",
              }}>
              {ratio >= 1 ? t("sabr.harvestFull") : t("sabr.harvestNow", { stars: previewStars })}
            </button>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }} className="text-center py-6">
            <div className="text-6xl mb-3">
              {starsFor(harvestRatio) >= 4 ? "🌻" : starsFor(harvestRatio) >= 2 ? "🌸" : "🌿"}
            </div>
            <div className="flex justify-center gap-1 mb-2">
              {[1,2,3,4,5].map((s) => (
                <motion.span key={s} initial={{ scale: 0 }}
                  animate={{ scale: s <= starsFor(harvestRatio) ? 1 : 0.6 }}
                  transition={{ delay: s * 0.1, type: "spring" }}
                  className="text-2xl" style={{ opacity: s <= starsFor(harvestRatio) ? 1 : 0.2 }}>⭐</motion.span>
              ))}
            </div>
            <div className="font-display text-base font-extrabold text-[#0F5C3A]">
              {starsFor(harvestRatio) >= 4 ? t("sabr.great") :
               starsFor(harvestRatio) >= 2 ? t("sabr.good") : t("sabr.keep")}
            </div>
            <div className="text-xs text-[#7A8BA0] mt-1">{t("sabr.nextRound")}</div>
          </motion.div>
        )}

        {phase === "win" && (
          <motion.div key="win" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="rounded-3xl p-6 text-center"
            style={{ background: "linear-gradient(135deg, #B8EDD9, #DBEAFE)" }}>
            <div className="text-4xl mb-2">🌻🌸🌺🌿🌱</div>
            <div className="font-display text-xl font-extrabold text-[#0F5C3A] mb-2">
              {t("sabr.winTitle")}
            </div>
            <div className="flex justify-center gap-2 flex-wrap mb-3">
              {earned.map((s, i) => (
                <span key={i} className="text-xs font-bold bg-white/70 px-2 py-1 rounded-full text-[#0F5C3A]">
                  R{i+1}: {s}⭐
                </span>
              ))}
            </div>
            <div className="text-xs text-[#4A5568] font-semibold mb-4">
              {t("sabr.winScience")}
            </div>
            <button onClick={start}
              className="w-full py-3 rounded-2xl font-display font-extrabold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #5CC7A0, #3A9FD4)" }}>
              {t("sabr.replant")}
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
