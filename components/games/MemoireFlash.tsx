"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";
import { useTranslations } from "next-intl";

type Phase = "idle" | "showing" | "input" | "correct" | "wrong" | "levelup" | "gameover";

const EMOJI_SETS = [
  ["🐶","🐱","🐸","🦊","🐼","🦁","🐨","🐯","🐻","🐰"],
  ["🍎","🍊","🍋","🍇","🍓","🍒","🥝","🍑","🍍","🥭"],
  ["⭐","🌙","☀️","🌈","❄️","🌸","🔥","💧","🌿","🌊"],
];

export default function MemoireFlash() {
  const t = useTranslations("g");
  const tg = useTranslations("game");
  const addStars = useQuestStore((s) => s.addStars);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [phase, setPhase] = useState<Phase>("idle");
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSeq, setUserSeq] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [gridEmojis, setGridEmojis] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const sequenceLength = 2 + level;

  const buildGrid = useCallback((emojis: string[]) => {
    const shuffled = [...emojis].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(6 + level, 9));
  }, [level]);

  const startRound = useCallback(() => {
    const set = EMOJI_SETS[Math.floor(Math.random() * EMOJI_SETS.length)];
    const grid = buildGrid(set);
    setGridEmojis(grid);
    const seq = Array.from({ length: sequenceLength }, () => grid[Math.floor(Math.random() * grid.length)]);
    setSequence(seq);
    setUserSeq([]);
    setPhase("showing");

    seq.forEach((_, i) => {
      setTimeout(() => setActiveIdx(i), i * 900);
    });
    setTimeout(() => {
      setActiveIdx(-1);
      setPhase("input");
    }, seq.length * 900 + 300);
  }, [sequenceLength, buildGrid]);

  const handleEmojiClick = (emoji: string) => {
    if (phase !== "input") return;
    const newSeq = [...userSeq, emoji];
    setUserSeq(newSeq);

    const pos = newSeq.length - 1;
    if (emoji !== sequence[pos]) {
      setFeedback("wrong");
      setPhase("wrong");
      const newLives = lives - 1;
      setLives(newLives);
      setTimeout(() => {
        setFeedback(null);
        if (newLives <= 0) {
          addStars(2);
          setPhase("gameover");
        } else {
          startRound();
        }
      }, 1200);
      return;
    }

    if (newSeq.length === sequence.length) {
      setFeedback("correct");
      setPhase("correct");
      const pts = level * sequenceLength;
      setScore((s) => s + pts);
      setTimeout(() => {
        setFeedback(null);
        if (newSeq.length >= 5 && level < 5) {
          setLevel((l) => l + 1);
          setPhase("levelup");
          setTimeout(() => startRound(), 1500);
        } else {
          startRound();
        }
      }, 1000);
    }
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setLives(3);
    setPhase("idle");
    setSequence([]);
    setUserSeq([]);
    setActiveIdx(-1);
  };

  return (
    <div className="space-y-4">
      {phase !== "idle" && (
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className="text-xl" style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
            ))}
          </div>
          <div className="font-display text-base font-extrabold text-[#1E2A38]">
            {score} {tg("pts")}
          </div>
          <div className="text-xs font-bold px-3 py-1 rounded-full bg-[#E8E0F8] text-[#3D1F8A]">
            {tg("level")} {level}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
            <div className="text-5xl mb-3">🧠</div>
            <div className="font-display text-lg font-bold text-[#1E2A38] mb-1">Flash Memory</div>
            <div className="text-sm text-[#7A8BA0] mb-5 max-w-xs mx-auto">
              {t("memoire.idle")}
            </div>
            <button onClick={startRound} className="btn-primary btn-mint mx-auto">
              {t("memoire.playBtn")}
            </button>
          </motion.div>
        )}

        {phase === "gameover" && (
          <motion.div
            key="gameover"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-4"
          >
            <div className="text-4xl mb-2">😅</div>
            <div className="font-display text-lg font-bold text-[#1E2A38] mb-1">
              {t("memoire.gameover")}
            </div>
            <div className="text-sm text-[#7A8BA0] mb-2">
              {t("memoire.gameoverScore", { score, level })}
            </div>
            <div className="bg-[#FFF3CD] rounded-2xl p-3 mb-4 text-xs font-semibold text-[#9C6800]">
              {t("memoire.motivation")}
            </div>
            <button onClick={resetGame} className="btn-primary btn-mint mx-auto">
              🔄 {tg("replay")}
            </button>
          </motion.div>
        )}

        {(phase === "showing" || phase === "input" || phase === "correct" || phase === "wrong") && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center mb-3">
              <div className="text-xs font-bold text-[#7A8BA0] uppercase tracking-wider mb-1">
                {phase === "showing" ? t("memoire.memorize", { n: sequenceLength }) :
                 phase === "input" ? t("memoire.reproduce", { current: userSeq.length, total: sequence.length }) :
                 phase === "correct" ? t("memoire.correct") : t("memoire.wrong")}
              </div>
              <div className="flex justify-center gap-2 mb-1 h-10 items-center">
                {sequence.map((e, i) => (
                  <motion.div
                    key={i}
                    animate={activeIdx === i ? { scale: 1.4, opacity: 1 } : { scale: 1, opacity: activeIdx === -1 ? 0 : 0.25 }}
                    className="text-2xl"
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {activeIdx >= 0 || phase !== "showing" ? e : "❓"}
                  </motion.div>
                ))}
              </div>
              {phase === "input" && (
                <div className="flex justify-center gap-1.5">
                  {sequence.map((_, i) => (
                    <div key={i}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                      style={{ background: i < userSeq.length ? "#5CC7A0" : "#E2E8F0" }}>
                      {i < userSeq.length ? userSeq[i] : ""}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <motion.div
              className="grid grid-cols-3 gap-2"
              animate={feedback === "wrong" ? { x: [-4, 4, -3, 3, 0] } : {}}
              transition={{ duration: 0.3 }}
            >
              {gridEmojis.map((e, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEmojiClick(e)}
                  disabled={phase !== "input"}
                  className="h-14 rounded-2xl text-2xl border-2 transition-all"
                  style={{
                    background: feedback === "correct" && userSeq.includes(e) ? "#B8EDD9" :
                                feedback === "wrong" ? "#FDECEA" : "#F8F6F0",
                    borderColor: feedback === "correct" && userSeq.includes(e) ? "#5CC7A0" :
                                 feedback === "wrong" ? "#E05050" : "#E2E8F0",
                    opacity: phase !== "input" ? 0.7 : 1,
                    cursor: phase !== "input" ? "default" : "pointer",
                  }}
                >
                  {e}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}

        {phase === "levelup" && (
          <motion.div
            key="levelup"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-6"
          >
            <div className="text-4xl mb-2">🚀⭐🎉</div>
            <div className="font-display text-xl font-extrabold text-[#5CC7A0]">
              {tg("level")} {level}!
            </div>
            <div className="text-sm text-[#7A8BA0] mt-1">{t("memoire.levelup")}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
