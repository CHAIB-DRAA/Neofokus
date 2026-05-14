"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "get-ready" | "move" | "done" | "finish";

const MOVES = [
  { emoji: "🙌", text: "Frappe dans tes mains", count: 3, unit: "fois" },
  { emoji: "🦵", text: "Tape tes genoux", count: 4, unit: "fois" },
  { emoji: "⬆️", text: "Lève les bras bien haut", count: null, unit: null },
  { emoji: "🦶", text: "Tape des pieds", count: 5, unit: "fois" },
  { emoji: "🔄", text: "Tourne sur toi-même", count: 2, unit: "tours" },
  { emoji: "🤸", text: "Saute sur place", count: 4, unit: "sauts" },
  { emoji: "👃", text: "Respire fort par le nez", count: 3, unit: "fois" },
  { emoji: "🤗", text: "Fais semblant de te serrer dans tes bras", count: null, unit: null },
  { emoji: "👀", text: "Cligne des yeux", count: 5, unit: "fois" },
  { emoji: "😁", text: "Fais le plus grand sourire possible", count: null, unit: null },
  { emoji: "🐘", text: "Marche comme un éléphant", count: 4, unit: "pas" },
  { emoji: "🐸", text: "Saute comme une grenouille", count: 3, unit: "bonds" },
  { emoji: "🤜", text: "Frappe doucement ta poitrine", count: 2, unit: "fois" },
  { emoji: "🌀", text: "Tourne la tête à gauche et à droite", count: 3, unit: "fois" },
  { emoji: "🦷", text: "Claque des dents doucement", count: 5, unit: "fois" },
  { emoji: "✊", text: "Serre les poings fort, puis relâche", count: 3, unit: "fois" },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const ROUNDS_PER_SESSION = 6;
const GET_READY_TIME = 3;

export default function BougeCompte() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [queue, setQueue] = useState<typeof MOVES>([]);
  const [current, setCurrent] = useState(MOVES[0]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [countdown, setCountdown] = useState(GET_READY_TIME);
  const [score, setScore] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  function start() {
    const q = shuffle(MOVES).slice(0, ROUNDS_PER_SESSION);
    setQueue(q);
    setCurrent(q[0]);
    setRoundIdx(0);
    setScore(0);
    startGetReady();
  }

  function startGetReady() {
    setPhase("get-ready");
    setCountdown(GET_READY_TIME);
    let c = GET_READY_TIME;
    timerRef.current = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(timerRef.current!);
        setPhase("move");
      }
    }, 1000);
  }

  function handleDone() {
    if (phase !== "move") return;
    setScore((s) => s + 10);
    setPhase("done");
    const next = roundIdx + 1;
    if (next >= queue.length) {
      addStars(2);
      setTimeout(() => setPhase("finish"), 800);
    } else {
      setTimeout(() => {
        setRoundIdx(next);
        setCurrent(queue[next]);
        startGetReady();
      }, 800);
    }
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
            <div className="text-5xl mb-3">🤸</div>
            <div className="font-display text-lg font-bold text-[#1E2A38] mb-1">Bouge & Compte</div>
            <div className="text-sm text-[#7A8BA0] mb-4 max-w-xs mx-auto">
              Des défis de mouvement vont apparaître — lis l'instruction, fais le geste, puis appuie sur <strong>"Fait !"</strong>
            </div>
            <div className="bg-[#B8EDD9] rounded-2xl p-4 mb-5 text-sm font-semibold text-[#0F5C3A]">
              🏃 Lève-toi, fais de la place, et prépare ton corps ! {ROUNDS_PER_SESSION} défis t'attendent.
            </div>
            <button onClick={start}
              className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #5CC7A0, #3A9FD4)", color: "white", border: "none" }}>
              🤸 C'est parti !
            </button>
          </motion.div>
        )}

        {phase === "get-ready" && (
          <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 gap-5">
            <div className="text-xs font-bold text-[#7A8BA0] uppercase tracking-wider">
              Défi {roundIdx + 1}/{ROUNDS_PER_SESSION}
            </div>
            <motion.div
              key={countdown}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-display text-8xl font-extrabold"
              style={{ color: countdown === 1 ? "#5CC7A0" : "#1E2A38" }}
            >
              {countdown}
            </motion.div>
            <div className="text-sm font-semibold text-[#7A8BA0]">Prépare-toi…</div>
          </motion.div>
        )}

        {(phase === "move" || phase === "done") && (
          <motion.div key="move" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-5 py-4">
            {/* Progress */}
            <div className="w-full flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-400"
                  style={{ width: `${(roundIdx / ROUNDS_PER_SESSION) * 100}%`, background: "#5CC7A0" }} />
              </div>
              <div className="text-xs font-bold text-[#7A8BA0]">{roundIdx + 1}/{ROUNDS_PER_SESSION}</div>
            </div>

            {/* Move card */}
            <motion.div
              key={current.emoji}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 14 }}
              className="w-full rounded-3xl p-6 flex flex-col items-center gap-3 border-3"
              style={{
                background: phase === "done" ? "#B8EDD9" : "linear-gradient(135deg, #E8F7FF, #DFFFEF)",
                border: `3px solid ${phase === "done" ? "#5CC7A0" : "#7DC4E8"}`,
              }}
            >
              <div className="text-6xl">{current.emoji}</div>
              <div className="font-display text-xl font-extrabold text-center text-[#1E2A38]">
                {current.text}
              </div>
              {current.count && (
                <div className="flex gap-2">
                  {Array.from({ length: current.count }).map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-white text-sm"
                      style={{ background: "#5CC7A0" }}>
                      {i + 1}
                    </div>
                  ))}
                </div>
              )}
              {phase === "done" && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-2xl">
                  ✅
                </motion.div>
              )}
            </motion.div>

            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={handleDone}
              disabled={phase !== "move"}
              className="w-full py-5 rounded-3xl font-display text-xl font-extrabold text-white transition-all"
              style={{
                background: phase === "move"
                  ? "linear-gradient(135deg, #5CC7A0, #3A9FD4)"
                  : "#CBD5E0",
              }}>
              {phase === "done" ? "✅ Fait !" : "👆 J'ai fait !"}
            </motion.button>

            <div className="text-xs font-bold text-[#7A8BA0]">⭐ {score} points gagnés</div>
          </motion.div>
        )}

        {phase === "finish" && (
          <motion.div key="finish" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }} className="text-center py-6">
            <div className="text-5xl mb-4">🎉🤸🌟</div>
            <div className="font-display text-2xl font-extrabold text-[#5CC7A0] mb-2">
              Bien bougé !
            </div>
            <div className="text-sm text-[#7A8BA0] mb-2">
              {ROUNDS_PER_SESSION} défis complétés · {score} points !
            </div>
            <div className="bg-[#B8EDD9] rounded-2xl p-4 mb-5 text-sm font-semibold text-[#0F5C3A]">
              🧠 Le mouvement aide ton cerveau à mieux se concentrer ensuite. Bravo !
            </div>
            <button onClick={start}
              className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #5CC7A0, #3A9FD4)", color: "white", border: "none" }}>
              🔄 Nouveau tour
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}