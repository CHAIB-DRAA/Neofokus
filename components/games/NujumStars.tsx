"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";
import { useTranslations } from "next-intl";

type Phase = "idle" | "watch" | "recall" | "feedback" | "win" | "lose";

interface Star {
  id: number;
  x: number;
  y: number;
}

const STARS: Star[] = [
  { id: 0,  x: 20, y: 15 },
  { id: 1,  x: 50, y: 10 },
  { id: 2,  x: 80, y: 18 },
  { id: 3,  x: 15, y: 45 },
  { id: 4,  x: 40, y: 38 },
  { id: 5,  x: 65, y: 42 },
  { id: 6,  x: 88, y: 50 },
  { id: 7,  x: 25, y: 72 },
  { id: 8,  x: 55, y: 68 },
  { id: 9,  x: 80, y: 75 },
  { id: 10, x: 10, y: 85 },
  { id: 11, x: 45, y: 88 },
];

const LEVELS = [3, 4, 5, 6, 7];

function generatePath(len: number): number[] {
  const ids = [...STARS.map((s) => s.id)];
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids.slice(0, len);
}

export default function CarteCiel() {
  const t = useTranslations("g");
  const tg = useTranslations("game");
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase]         = useState<Phase>("idle");
  const [levelIdx, setLevelIdx]   = useState(0);
  const [path, setPath]           = useState<number[]>([]);
  const [revealedUpTo, setRevealedUpTo] = useState(-1);
  const [tapped, setTapped]       = useState<number[]>([]);
  const [errors, setErrors]       = useState(0);
  const [lastOk, setLastOk]       = useState(true);

  const watchTimer = useRef(0);

  const playPath = useCallback((p: number[]) => {
    setPhase("watch");
    setRevealedUpTo(-1);
    setTapped([]);
    let i = 0;
    function step() {
      setRevealedUpTo(i);
      i++;
      if (i < p.length) {
        watchTimer.current = window.setTimeout(step, 750);
      } else {
        watchTimer.current = window.setTimeout(() => {
          setRevealedUpTo(-1);
          setPhase("recall");
        }, 900);
      }
    }
    watchTimer.current = window.setTimeout(step, 500);
  }, []);

  function startGame() {
    setLevelIdx(0);
    setErrors(0);
    const p = generatePath(LEVELS[0]);
    setPath(p);
    playPath(p);
  }

  function tapStar(id: number) {
    if (phase !== "recall") return;
    const idx = tapped.length;
    const expected = path[idx];
    const newTapped = [...tapped, id];
    setTapped(newTapped);

    if (id !== expected) {
      setLastOk(false);
      setPhase("feedback");
      const newErrors = errors + 1;
      setErrors(newErrors);
      watchTimer.current = window.setTimeout(() => {
        setLastOk(true);
        if (newErrors >= 3) {
          setPhase("lose");
        } else {
          playPath(path);
        }
      }, 1000);
      return;
    }

    if (newTapped.length === path.length) {
      setLastOk(true);
      setPhase("feedback");
      const nextLevel = levelIdx + 1;
      watchTimer.current = window.setTimeout(() => {
        if (nextLevel >= LEVELS.length) {
          const ratio = 1 - errors / (LEVELS.length * 2);
          addStars(ratio >= 0.85 ? 5 : ratio >= 0.7 ? 4 : ratio >= 0.5 ? 3 : 2);
          setPhase("win");
        } else {
          setLevelIdx(nextLevel);
          const p = generatePath(LEVELS[nextLevel]);
          setPath(p);
          playPath(p);
        }
      }, 700);
    }
  }

  const svgW = 300;
  const svgH = 220;

  function starPos(star: Star) {
    return { cx: (star.x / 100) * svgW, cy: (star.y / 100) * svgH };
  }

  const watchLit = new Set(revealedUpTo >= 0 ? path.slice(0, revealedUpTo + 1) : []);
  const tappedCorrect = new Set(tapped.filter((id, i) => path[i] === id));

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">

        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-2">
            <div className="text-6xl mb-3">🌌</div>
            <div className="font-display text-lg font-extrabold text-[#1A5F7A] mb-2">
              Sky Map
            </div>
            <div className="bg-[#BFE3F5] rounded-2xl p-4 mb-3 text-sm text-[#1A5F7A] font-semibold leading-relaxed text-left">
              {t("nujum.idle")}
            </div>
            <div className="text-xs text-[#7A8BA0] mb-5">
              {t("nujum.science")}
            </div>
            <button onClick={startGame} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #1A5F7A, #7DC4E8)", color: "white", border: "none" }}>
              {t("nujum.startBtn")}
            </button>
          </motion.div>
        )}

        {(phase === "watch" || phase === "recall" || phase === "feedback") && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A8BA0]">
                {t("nujum.level", { current: levelIdx + 1, total: LEVELS.length, n: path.length })}
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <span key={i} className="text-base" style={{ opacity: i <= (3 - errors) ? 1 : 0.2 }}>⭐</span>
                ))}
              </div>
            </div>

            <div className="text-center text-sm font-bold mb-3 h-5"
              style={{ color: phase === "feedback" ? (lastOk ? "#5CC7A0" : "#E05050") : "#1A5F7A" }}>
              {phase === "watch" && t("nujum.watch")}
              {phase === "recall" && t("nujum.recall", { current: tapped.length, total: path.length })}
              {phase === "feedback" && (lastOk ? t("nujum.correct") : t("nujum.wrong"))}
            </div>

            <div className="rounded-3xl overflow-hidden mb-4 relative"
              style={{ background: "linear-gradient(180deg, #0B1A2E 0%, #1A3358 100%)",
                border: "2px solid #2A4A78" }}>
              <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{ display: "block" }}>
                {phase === "watch" && revealedUpTo > 0 &&
                  path.slice(0, revealedUpTo + 1).map((id, i) => {
                    if (i === 0) return null;
                    const prev = STARS.find((s) => s.id === path[i - 1])!;
                    const curr = STARS.find((s) => s.id === id)!;
                    return (
                      <motion.line key={`l${i}`}
                        x1={starPos(prev).cx} y1={starPos(prev).cy}
                        x2={starPos(curr).cx} y2={starPos(curr).cy}
                        stroke="#FFD93D" strokeWidth="1.5" strokeOpacity="0.6"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
                    );
                  })
                }
                {phase === "recall" && tapped.map((id, i) => {
                  if (i === 0) return null;
                  const prev = STARS.find((s) => s.id === tapped[i - 1])!;
                  const curr = STARS.find((s) => s.id === id)!;
                  if (path[i - 1] !== tapped[i - 1] || path[i] !== tapped[i]) return null;
                  return (
                    <line key={`rl${i}`}
                      x1={starPos(prev).cx} y1={starPos(prev).cy}
                      x2={starPos(curr).cx} y2={starPos(curr).cy}
                      stroke="#5CC7A0" strokeWidth="1.5" strokeOpacity="0.7" />
                  );
                })}

                {STARS.map((star) => {
                  const { cx, cy } = starPos(star);
                  const isWatchLit = watchLit.has(star.id);
                  const isTappedOk = tappedCorrect.has(star.id);
                  const isNextToTap = phase === "recall" && path[tapped.length] === star.id;

                  return (
                    <g key={star.id} onClick={() => tapStar(star.id)}
                      style={{ cursor: phase === "recall" ? "pointer" : "default" }}>
                      <motion.circle cx={cx} cy={cy}
                        animate={{ r: isWatchLit || isTappedOk ? 12 : isNextToTap ? 10 : 6,
                          opacity: isWatchLit || isTappedOk ? 0.3 : isNextToTap ? 0.15 : 0 }}
                        fill={isTappedOk ? "#5CC7A0" : "#FFD93D"} />
                      <motion.circle cx={cx} cy={cy}
                        animate={{ r: isWatchLit || isTappedOk ? 5 : isNextToTap ? 4 : 3,
                          fill: isTappedOk ? "#5CC7A0" : isWatchLit ? "#FFD93D" : isNextToTap ? "#BFE3F5" : "#4A6FA5" }}
                        transition={{ type: "spring", stiffness: 300 }} />
                      {isWatchLit && (
                        <text x={cx} y={cy - 9} textAnchor="middle" fontSize="8"
                          fill="#FFD93D" fontWeight="bold">
                          {path.indexOf(star.id) + 1}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </motion.div>
        )}

        {phase === "lose" && (
          <motion.div key="lose" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }} className="text-center py-6">
            <div className="text-5xl mb-3">🌌</div>
            <div className="font-display text-lg font-extrabold text-[#E05050] mb-2">
              {t("nujum.loseTitle")}
            </div>
            <div className="text-sm text-[#7A8BA0] mb-4">
              {t("nujum.loseDesc", { level: levelIdx + 1 })}
            </div>
            <button onClick={startGame}
              className="w-full py-3 rounded-2xl font-display font-extrabold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #1A5F7A, #7DC4E8)" }}>
              🌌 {tg("tryAgain")}
            </button>
          </motion.div>
        )}

        {phase === "win" && (
          <motion.div key="win" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="rounded-3xl p-6 text-center"
            style={{ background: "linear-gradient(135deg, #0B1A2E, #1A3358)" }}>
            <div className="text-4xl mb-2">🌟✨🌟</div>
            <div className="font-display text-xl font-extrabold text-[#FFD93D] mb-1">
              {t("nujum.winTitle")}
            </div>
            <div className="text-sm text-[#7DC4E8] mb-3">
              {t("nujum.winDesc", { n: LEVELS[LEVELS.length - 1] })}
            </div>
            <div className="text-xs text-[#BFE3F5] font-semibold mb-4">
              {t("nujum.winScience")}
            </div>
            <button onClick={startGame}
              className="w-full py-3 rounded-2xl font-display font-extrabold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #1A5F7A, #7DC4E8)" }}>
              🌌 {tg("replay")}
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
