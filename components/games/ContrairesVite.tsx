"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";
import { useTranslations } from "next-intl";

type Phase = "idle" | "playing" | "win";

interface Pair {
  prompt: string;
  correct: string;
  wrong: string;
}

const DURATION = 60;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ContrairesVite() {
  const t = useTranslations("g");
  const tg = useTranslations("game");
  const addStars = useQuestStore((s) => s.addStars);

  const rawPairs = t.raw("contraires.pairs") as [string, string, string][];
  const PAIRS: Pair[] = rawPairs.map(([prompt, correct, wrong]) => ({ prompt, correct, wrong }));

  const [phase, setPhase] = useState<Phase>("idle");
  const [queue, setQueue] = useState<Pair[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [flash, setFlash] = useState<"ok" | "ko" | null>(null);

  const timerRef = useRef(0);
  const scoreRef = useRef(0);

  useEffect(() => () => clearInterval(timerRef.current), []);

  function startGame() {
    const q = [...shuffle(PAIRS), ...shuffle(PAIRS)].slice(0, 25);
    setQueue(q);
    setIdx(0);
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(DURATION);
    setFlash(null);
    setPhase("playing");

    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          const s = scoreRef.current;
          addStars(s >= 18 ? 5 : s >= 13 ? 4 : s >= 9 ? 3 : s >= 5 ? 2 : 1);
          setScore(s);
          setPhase("win");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function answer(isCorrect: boolean) {
    if (phase !== "playing") return;
    if (isCorrect) {
      scoreRef.current++;
      setScore(scoreRef.current);
    }
    setFlash(isCorrect ? "ok" : "ko");
    setTimeout(() => {
      setFlash(null);
      setIdx((i) => (i + 1) % queue.length);
    }, 300);
  }

  const pair = queue[idx];
  const pct = (timeLeft / DURATION) * 100;

  const leftIsCorrect = queue[idx] ? (idx % 2 === 0) : true;

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">

        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
            <div className="text-6xl mb-3">🔀</div>
            <div className="font-display text-lg font-extrabold text-[#C02020] mb-2">Opposites Express</div>
            <div className="bg-[#FDECEA] rounded-2xl p-4 mb-3 text-sm text-[#C02020] font-semibold leading-relaxed text-left">
              {t("contraires.idle")}
            </div>
            <div className="text-xs text-[#7A8BA0] mb-5">
              {t("contraires.science")}
            </div>
            <button onClick={startGame} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #E05050, #FF922B)", color: "white", border: "none" }}>
              {t("contraires.startBtn")}
            </button>
          </motion.div>
        )}

        {phase === "playing" && pair && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full"
                  style={{ background: pct > 50 ? "#5CC7A0" : pct > 20 ? "#FFD93D" : "#E05050",
                    width: `${pct}%` }} transition={{ duration: 0 }} />
              </div>
              <span className="text-sm font-extrabold text-[#1E2A38] w-8">{timeLeft}{tg("seconds")}</span>
            </div>

            <div className="text-right text-xs font-extrabold text-[#5CC7A0] mb-4">
              {tg("score")}: {score}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={idx}
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}
                className="rounded-3xl p-6 text-center mb-5 font-display text-2xl font-extrabold text-[#1E2A38]"
                style={{
                  background: flash === "ok" ? "#B8EDD9" : flash === "ko" ? "#FDECEA" : "#FFF9C4",
                  border: `2px solid ${flash === "ok" ? "#5CC7A0" : flash === "ko" ? "#E05050" : "#FFD93D"}`,
                }}>
                {pair.prompt}
                <div className="text-sm font-bold text-[#7A8BA0] mt-1">{t("contraires.opposite")}</div>
              </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => answer(leftIsCorrect)}
                className="py-4 rounded-2xl font-display font-extrabold text-base border-2 active:scale-95 transition-all"
                style={{ background: "#F8F6F0", borderColor: "#E2E8F0", color: "#1E2A38" }}>
                {leftIsCorrect ? pair.correct : pair.wrong}
              </button>
              <button
                onClick={() => answer(!leftIsCorrect)}
                className="py-4 rounded-2xl font-display font-extrabold text-base border-2 active:scale-95 transition-all"
                style={{ background: "#F8F6F0", borderColor: "#E2E8F0", color: "#1E2A38" }}>
                {leftIsCorrect ? pair.wrong : pair.correct}
              </button>
            </div>
          </motion.div>
        )}

        {phase === "win" && (
          <motion.div key="win" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="rounded-3xl p-6 text-center"
            style={{ background: "linear-gradient(135deg, #FDECEA, #FFF9C4)" }}>
            <div className="text-4xl mb-2">🔀🏆</div>
            <div className="font-display text-xl font-extrabold text-[#C02020] mb-1">{t("contraires.winTitle")}</div>
            <div className="text-5xl font-extrabold text-[#E05050] mb-1">{score}</div>
            <div className="text-sm text-[#7A8BA0] mb-3">{t("contraires.winUnit")}</div>
            <div className="text-xs text-[#4A5568] font-semibold mb-4">
              {t("contraires.winScience")}
            </div>
            <button onClick={startGame}
              className="w-full py-3 rounded-2xl font-display font-extrabold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #E05050, #FF922B)" }}>
              🔀 {tg("replay")}
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
