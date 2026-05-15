"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "playing" | "win";

const DURATION = 60; // secondes
const INTERVAL = 1100; // ms entre chaque emoji
const TARGET_RATIO = 0.3; // 30% d'étoiles dans le flux

const DISTRACTORS = ["🍕","🎈","🐸","🌈","🎯","🦊","🍦","🎨","🐬","⚡","🎪","🏀","🦋","🍀","🎭","🌸","🐉","🎸"];

function generateStream(count: number): string[] {
  return Array.from({ length: count }, () =>
    Math.random() < TARGET_RATIO ? "⭐" : DISTRACTORS[Math.floor(Math.random() * DISTRACTORS.length)]
  );
}

export default function VigilanceStar() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [current, setCurrent] = useState("");
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const [totalTargets, setTotalTargets] = useState(0);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);

  const streamRef = useRef<string[]>([]);
  const streamIdxRef = useRef(0);
  const currentRef = useRef("");
  const hitsRef = useRef(0);
  const missesRef = useRef(0);
  const falseAlarmsRef = useRef(0);
  const totalTargetsRef = useRef(0);
  const timerRef = useRef(0);
  const streamTimerRef = useRef(0);

  function endGame() {
    clearInterval(timerRef.current);
    clearInterval(streamTimerRef.current);
    const h = hitsRef.current;
    const t = totalTargetsRef.current;
    const fa = falseAlarmsRef.current;
    setHits(h);
    setMisses(t - h);
    setFalseAlarms(fa);
    setTotalTargets(t);
    const score = t > 0 ? (h / t) - (fa / Math.max(1, streamRef.current.length - t)) * 0.5 : 0;
    addStars(score >= 0.8 ? 5 : score >= 0.65 ? 4 : score >= 0.5 ? 3 : score >= 0.3 ? 2 : 1);
    setPhase("win");
  }

  function startGame() {
    const count = Math.floor(DURATION * 1000 / INTERVAL);
    const stream = generateStream(count);
    streamRef.current = stream;
    streamIdxRef.current = 0;
    hitsRef.current = 0;
    missesRef.current = 0;
    falseAlarmsRef.current = 0;
    totalTargetsRef.current = stream.filter((e) => e === "⭐").length;
    currentRef.current = "";
    setHits(0); setMisses(0); setFalseAlarms(0); setFlash(null);
    setTotalTargets(stream.filter((e) => e === "⭐").length);
    setTimeLeft(DURATION);
    setPhase("playing");

    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { endGame(); return 0; }
        return t - 1;
      });
    }, 1000);

    streamTimerRef.current = window.setInterval(() => {
      // Check if previous target was missed
      if (currentRef.current === "⭐") {
        missesRef.current++;
      }
      const i = streamIdxRef.current;
      if (i >= stream.length) { clearInterval(streamTimerRef.current); return; }
      const emoji = stream[i];
      currentRef.current = emoji;
      setCurrent(emoji);
      streamIdxRef.current++;
    }, INTERVAL);
  }

  function tap() {
    if (phase !== "playing") return;
    if (currentRef.current === "⭐") {
      hitsRef.current++;
      currentRef.current = ""; // consumed
      setCurrent((c) => (c === "⭐" ? "✅" : c));
      setFlash("correct");
      setTimeout(() => setFlash(null), 300);
    } else {
      falseAlarmsRef.current++;
      setFlash("wrong");
      setTimeout(() => setFlash(null), 300);
    }
  }

  useEffect(() => () => { clearInterval(timerRef.current); clearInterval(streamTimerRef.current); }, []);

  const pct = Math.round((timeLeft / DURATION) * 100);

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">

        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
            <div className="text-6xl mb-3">🎯</div>
            <div className="font-display text-lg font-extrabold text-[#1A4FA0] mb-2">Vigilance ⭐</div>
            <div className="bg-[#DBEAFE] rounded-2xl p-4 mb-3 text-sm text-[#1A4FA0] font-semibold leading-relaxed text-left">
              Des émojis défilent un par un. Appuie <b>uniquement</b> quand tu vois une étoile ⭐.
              Laisse passer tous les autres sans appuyer !
            </div>
            <div className="text-xs text-[#7A8BA0] mb-5">
              🔬 Test d'attention soutenue — le déficit le plus documenté dans le TDAH
            </div>
            <button onClick={startGame} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #5B9CF6, #1A4FA0)", color: "white", border: "none" }}>
              🎯 Commencer
            </button>
          </motion.div>
        )}

        {phase === "playing" && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Timer bar */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full"
                  animate={{ width: `${pct}%` }}
                  style={{ background: pct > 50 ? "#5B9CF6" : pct > 20 ? "#FFD93D" : "#E05050" }}
                  transition={{ duration: 0 }} />
              </div>
              <span className="text-xs font-extrabold text-[#7A8BA0] w-8">{timeLeft}s</span>
            </div>

            {/* Score row */}
            <div className="flex justify-center gap-4 mb-4 text-xs font-extrabold">
              <span className="text-[#5CC7A0]">✅ {hitsRef.current}</span>
              <span className="text-[#E05050]">❌ {falseAlarmsRef.current}</span>
            </div>

            {/* Emoji display */}
            <motion.div
              onClick={tap}
              animate={{ backgroundColor: flash === "correct" ? "#B8EDD9" : flash === "wrong" ? "#FDECEA" : "#F8F6F0" }}
              transition={{ duration: 0.15 }}
              className="rounded-3xl flex items-center justify-center cursor-pointer select-none"
              style={{ height: 180, border: "2px solid #E2E8F0" }}>
              <AnimatePresence mode="wait">
                <motion.span key={current + streamIdxRef.current}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.3, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontSize: 80, lineHeight: 1 }}>
                  {current}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            <div className="text-center text-xs font-bold text-[#7A8BA0] mt-3">
              Appuie sur la zone quand tu vois ⭐
            </div>
          </motion.div>
        )}

        {phase === "win" && (
          <motion.div key="win" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="rounded-3xl p-6 text-center"
            style={{ background: "linear-gradient(135deg, #DBEAFE, #B8EDD9)" }}>
            <div className="text-4xl mb-2">🎯⭐</div>
            <div className="font-display text-xl font-extrabold text-[#1A4FA0] mb-3">Mission accomplie !</div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-white/70 rounded-xl p-2">
                <div className="text-2xl font-extrabold text-[#5CC7A0]">{hits}</div>
                <div className="text-[10px] font-bold text-[#7A8BA0]">Étoiles trouvées</div>
              </div>
              <div className="bg-white/70 rounded-xl p-2">
                <div className="text-2xl font-extrabold text-[#E05050]">{misses}</div>
                <div className="text-[10px] font-bold text-[#7A8BA0]">Ratées</div>
              </div>
              <div className="bg-white/70 rounded-xl p-2">
                <div className="text-2xl font-extrabold text-[#FF922B]">{falseAlarms}</div>
                <div className="text-[10px] font-bold text-[#7A8BA0]">Fausses alarmes</div>
              </div>
            </div>
            <div className="text-xs text-[#4A5568] font-semibold mb-4">
              🔬 Chaque session entraîne ton attention soutenue et ton inhibition des distracteurs.
            </div>
            <button onClick={startGame}
              className="w-full py-3 rounded-2xl font-display font-extrabold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #5B9CF6, #1A4FA0)" }}>
              🎯 Rejouer
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
