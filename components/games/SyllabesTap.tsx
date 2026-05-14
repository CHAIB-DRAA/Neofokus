"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "playing" | "correct" | "wrong" | "win";

const MOTS = [
  { mot: "chat",        syllabes: 1, emoji: "🐱", decomp: ["chat"] },
  { mot: "nuit",        syllabes: 1, emoji: "🌙", decomp: ["nuit"] },
  { mot: "main",        syllabes: 1, emoji: "✋", decomp: ["main"] },
  { mot: "pont",        syllabes: 1, emoji: "🌉", decomp: ["pont"] },
  { mot: "lapin",       syllabes: 2, emoji: "🐰", decomp: ["la","pin"] },
  { mot: "soleil",      syllabes: 2, emoji: "☀️", decomp: ["so","leil"] },
  { mot: "maison",      syllabes: 2, emoji: "🏠", decomp: ["mai","son"] },
  { mot: "bateau",      syllabes: 2, emoji: "⛵", decomp: ["ba","teau"] },
  { mot: "nuage",       syllabes: 2, emoji: "☁️", decomp: ["nu","age"] },
  { mot: "forêt",       syllabes: 2, emoji: "🌲", decomp: ["fo","rêt"] },
  { mot: "tomate",      syllabes: 2, emoji: "🍅", decomp: ["to","mate"] },
  { mot: "fusée",       syllabes: 2, emoji: "🚀", decomp: ["fu","sée"] },
  { mot: "éléphant",    syllabes: 3, emoji: "🐘", decomp: ["é","lé","phant"] },
  { mot: "papillon",    syllabes: 3, emoji: "🦋", decomp: ["pa","pil","lon"] },
  { mot: "chocolat",    syllabes: 3, emoji: "🍫", decomp: ["cho","co","lat"] },
  { mot: "crocodile",   syllabes: 3, emoji: "🐊", decomp: ["cro","co","dile"] },
  { mot: "coccinelle",  syllabes: 3, emoji: "🐞", decomp: ["coc","ci","nelle"] },
  { mot: "cerise",      syllabes: 2, emoji: "🍒", decomp: ["ce","rise"] },
  { mot: "hippopotame", syllabes: 4, emoji: "🦛", decomp: ["hip","po","po","tame"] },
  { mot: "bibliothèque",syllabes: 4, emoji: "📚", decomp: ["bi","blio","thè","que"] },
];

const SYLLABE_COLORS = ["#5B9CF6","#E05050","#5CC7A0","#FF922B"];
const TOTAL_ROUNDS = 8;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function SyllabesTap() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [queue, setQueue] = useState<typeof MOTS>([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [taps, setTaps] = useState(0);
  const [score, setScore] = useState(0);
  const [shake, setShake] = useState(false);

  const current = queue[roundIdx] ?? MOTS[0];

  function start() {
    setQueue(shuffle(MOTS).slice(0, TOTAL_ROUNDS));
    setRoundIdx(0);
    setTaps(0);
    setScore(0);
    setPhase("playing");
  }

  function handleTap() {
    if (phase !== "playing") return;
    setTaps((t) => t + 1);
  }

  function handleValidate() {
    if (phase !== "playing" || taps === 0) return;
    if (taps === current.syllabes) {
      setScore((s) => s + 10);
      setPhase("correct");
      const next = roundIdx + 1;
      if (next >= TOTAL_ROUNDS) {
        addStars(3);
        setTimeout(() => setPhase("win"), 1200);
      } else {
        setTimeout(() => {
          setRoundIdx(next);
          setTaps(0);
          setPhase("playing");
        }, 1300);
      }
    } else {
      setShake(true);
      setPhase("wrong");
      setTimeout(() => {
        setShake(false);
        setTaps(0);
        setPhase("playing");
      }, 1400);
    }
  }

  function handleReset() {
    setTaps(0);
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
            <div className="text-5xl mb-3">🥁</div>
            <div className="font-display text-lg font-bold text-[#1E2A38] mb-1">Syllabes Tap</div>
            <div className="text-sm text-[#7A8BA0] mb-4 max-w-xs mx-auto">
              Un mot apparaît — tape autant de fois qu'il y a de syllabes, puis valide !
            </div>
            <div className="bg-[#BFE3F5] rounded-2xl p-4 mb-5 text-sm text-[#1A5F7A] font-semibold">
              💡 Dis le mot à voix haute en battant les mains : <strong>"pa — pil — lon"</strong> → 3 tapes !
            </div>
            <button onClick={start} className="btn-primary btn-mint mx-auto">
              🥁 Commencer !
            </button>
          </motion.div>
        )}

        {(phase === "playing" || phase === "correct" || phase === "wrong") && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Progress */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full bg-[#5B9CF6]"
                  style={{ width: `${(roundIdx / TOTAL_ROUNDS) * 100}%` }}
                  transition={{ duration: 0.4 }} />
              </div>
              <div className="text-xs font-bold text-[#7A8BA0]">{roundIdx + 1}/{TOTAL_ROUNDS}</div>
              <div className="text-xs font-bold text-[#FF922B]">⭐ {score}</div>
            </div>

            {/* Mot */}
            <motion.div
              key={current.mot}
              animate={shake ? { x: [-8, 8, -6, 6, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center py-5 rounded-3xl border-2"
              style={{
                background: phase === "correct" ? "#B8EDD9" : phase === "wrong" ? "#FDECEA" : "linear-gradient(135deg, #E8F7FF, #F0EBFF)",
                borderColor: phase === "correct" ? "#5CC7A0" : phase === "wrong" ? "#E05050" : "#E2E8F0",
              }}
            >
              <div className="text-6xl mb-3">{current.emoji}</div>
              <div className="font-display text-3xl font-extrabold text-[#1E2A38] mb-2">{current.mot}</div>

              {/* Décomposition (après réponse) */}
              <AnimatePresence>
                {(phase === "correct" || phase === "wrong") && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className="flex gap-1 mt-1">
                    {current.decomp.map((s, i) => (
                      <span key={i} className="font-display text-xl font-extrabold px-1"
                        style={{ color: SYLLABE_COLORS[i % SYLLABE_COLORS.length] }}>
                        {s}{i < current.decomp.length - 1 && <span className="text-gray-300 mx-0.5">·</span>}
                      </span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {phase === "correct" && (
                <div className="text-sm font-bold text-[#5CC7A0] mt-2">
                  ✅ {current.syllabes} syllabe{current.syllabes > 1 ? "s" : ""} !
                </div>
              )}
              {phase === "wrong" && (
                <div className="text-sm font-bold text-[#E05050] mt-2">
                  Il y avait {current.syllabes} syllabe{current.syllabes > 1 ? "s" : ""}
                </div>
              )}
            </motion.div>

            {/* Bulles de tapes */}
            <div className="flex justify-center gap-2 min-h-[44px] items-center flex-wrap">
              <AnimatePresence>
                {Array.from({ length: taps }).map((_, i) => (
                  <motion.div key={i}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 12 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center font-display font-extrabold text-white text-sm"
                    style={{ background: SYLLABE_COLORS[i % SYLLABE_COLORS.length] }}>
                    {i + 1}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Boutons */}
            {phase === "playing" && (
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={handleTap}
                  className="flex-1 py-5 rounded-3xl font-display text-xl font-extrabold text-white"
                  style={{ background: "linear-gradient(135deg, #5B9CF6, #8E72DB)", boxShadow: "0 4px 16px rgba(91,156,246,0.4)" }}
                >
                  👆 TAP !
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleValidate}
                  disabled={taps === 0}
                  className="px-5 py-5 rounded-3xl font-display text-base font-extrabold text-white transition-all"
                  style={{ background: taps > 0 ? "linear-gradient(135deg, #5CC7A0, #3A9FD4)" : "#CBD5E0" }}
                >
                  ✅ OK
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={handleReset}
                  className="px-4 py-5 rounded-3xl border-2 border-gray-200 text-lg font-bold text-[#7A8BA0]">
                  ↩
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {phase === "win" && (
          <motion.div key="win" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }} className="text-center py-4">
            <div className="text-4xl mb-3">🎉🥁🌟</div>
            <div className="font-display text-xl font-extrabold text-[#5B9CF6] mb-1">
              Champion des syllabes !
            </div>
            <div className="text-sm text-[#7A8BA0] mb-4">Score : {score} pts · {TOTAL_ROUNDS} mots réussis</div>
            <div className="bg-[#DBEAFE] rounded-2xl p-3 mb-5 text-xs font-semibold text-[#1A4FA0]">
              🔬 La conscience syllabique est la base de l'apprentissage de la lecture — tu la renforces à chaque partie !
            </div>
            <button onClick={start} className="btn-primary btn-mint mx-auto">🔄 Rejouer</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}