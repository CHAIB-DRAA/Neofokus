"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type BreathPhase = "idle" | "inhale" | "hold" | "exhale" | "pause";

const PATTERNS = [
  { name: "Cohérence cardiaque", inhale: 5, hold: 0, exhale: 5, pause: 0, icon: "💙", cycles: 6 },
  { name: "Relaxation 4-7-8", inhale: 4, hold: 7, exhale: 8, pause: 0, icon: "💜", cycles: 4 },
  { name: "Anti-stress rapide", inhale: 4, hold: 0, exhale: 4, pause: 2, icon: "💚", cycles: 5 },
];

const PHASE_LABELS: Record<BreathPhase, string> = {
  idle: "Prêt·e ?",
  inhale: "Inspire… 🌬️",
  hold: "Retiens… ✨",
  exhale: "Expire… 😮‍💨",
  pause: "Pause… 🌿",
};

const PHASE_COLORS: Record<BreathPhase, string> = {
  idle: "#BFE3F5",
  inhale: "#5CC7A0",
  hold: "#8E72DB",
  exhale: "#7DC4E8",
  pause: "#FFD93D",
};

export default function BulleCalme() {
  const [pattern, setPattern] = useState(PATTERNS[0]);
  const [phase, setPhase] = useState<BreathPhase>("idle");
  const [cycleCount, setCycleCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [done, setDone] = useState(false);
  const controls = useAnimation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clear = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const runCycle = (cycleNum: number) => {
    if (cycleNum >= pattern.cycles) {
      setPhase("idle");
      setRunning(false);
      useQuestStore.getState().addStars(2);
      setDone(true);
      controls.stop();
      return;
    }

    const steps: { phase: BreathPhase; dur: number }[] = [
      { phase: "inhale", dur: pattern.inhale },
      ...(pattern.hold > 0 ? [{ phase: "hold" as BreathPhase, dur: pattern.hold }] : []),
      { phase: "exhale", dur: pattern.exhale },
      ...(pattern.pause > 0 ? [{ phase: "pause" as BreathPhase, dur: pattern.pause }] : []),
    ];

    let delay = 0;
    steps.forEach(({ phase: p, dur }) => {
      timeoutRef.current = setTimeout(() => {
        setPhase(p);
        setCountdown(dur);

        // Animate circle
        if (p === "inhale") {
          controls.start({ scale: 1.55, transition: { duration: dur, ease: "easeInOut" } });
        } else if (p === "hold") {
          controls.start({ scale: 1.55, transition: { duration: dur, ease: "linear" } });
        } else if (p === "exhale") {
          controls.start({ scale: 1, transition: { duration: dur, ease: "easeInOut" } });
        } else {
          controls.start({ scale: 1, transition: { duration: dur, ease: "linear" } });
        }

        // Countdown ticker
        let c = dur;
        const tick = setInterval(() => {
          c--;
          setCountdown(c);
          if (c <= 0) clearInterval(tick);
        }, 1000);
      }, delay * 1000);
      delay += dur;
    });

    // Next cycle
    timeoutRef.current = setTimeout(() => {
      setCycleCount((n) => n + 1);
      runCycle(cycleNum + 1);
    }, delay * 1000);
  };

  const start = () => {
    clear();
    setCycleCount(0);
    setDone(false);
    setRunning(true);
    controls.set({ scale: 1 });
    runCycle(0);
  };

  const stop = () => {
    clear();
    setRunning(false);
    setPhase("idle");
    setCountdown(0);
    controls.stop();
    controls.set({ scale: 1 });
  };

  useEffect(() => () => clear(), []);

  const color = PHASE_COLORS[phase];

  return (
    <div className="space-y-5">
      {/* Pattern selector */}
      {!running && !done && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="text-xs font-bold text-[#7A8BA0] uppercase tracking-wider mb-2">
            Choisir un exercice
          </div>
          <div className="flex flex-col gap-2">
            {PATTERNS.map((p) => (
              <button
                key={p.name}
                onClick={() => setPattern(p)}
                className="flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all"
                style={{
                  borderColor: pattern.name === p.name ? "#5CC7A0" : "#E2E8F0",
                  background: pattern.name === p.name ? "#EDFBF4" : "transparent",
                }}
              >
                <span className="text-xl">{p.icon}</span>
                <div>
                  <div className="text-sm font-bold text-[#1E2A38]">{p.name}</div>
                  <div className="text-xs text-[#7A8BA0]">
                    Inspire {p.inhale}s
                    {p.hold > 0 ? ` · Retiens ${p.hold}s` : ""}
                    {" · "} Expire {p.exhale}s
                    {p.pause > 0 ? ` · Pause ${p.pause}s` : ""}
                    {" · "}{p.cycles} cycles
                  </div>
                </div>
                {pattern.name === p.name && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-[#5CC7A0] flex items-center justify-center text-white text-xs">✓</div>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Breathing circle */}
      <div className="flex flex-col items-center py-6">
        <div className="relative flex items-center justify-center mb-6" style={{ width: 180, height: 180 }}>
          {/* Outer ring pulses */}
          {running && (
            <motion.div
              className="absolute rounded-full"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ width: 180, height: 180, background: color, borderRadius: "50%" }}
            />
          )}
          {/* Main circle */}
          <motion.div
            animate={controls}
            className="rounded-full flex flex-col items-center justify-center"
            style={{
              width: 120, height: 120,
              background: `radial-gradient(circle at 40% 35%, ${color}CC, ${color}66)`,
              border: `3px solid ${color}`,
              transition: "background 0.8s, border-color 0.8s",
            }}
          >
            <div className="text-3xl mb-1">
              {phase === "idle" ? "🫧" : phase === "inhale" ? "🌬️" : phase === "hold" ? "✨" : phase === "exhale" ? "😮‍💨" : "🌿"}
            </div>
            {running && countdown > 0 && (
              <div className="font-display text-xl font-extrabold text-white">{countdown}</div>
            )}
          </motion.div>
        </div>

        {/* Phase label */}
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-lg font-bold mb-1"
          style={{ color }}
        >
          {PHASE_LABELS[phase]}
        </motion.div>

        {/* Cycle counter */}
        {(running || done) && (
          <div className="flex gap-1.5 mt-2">
            {Array.from({ length: pattern.cycles }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full transition-all duration-300"
                style={{ background: i < cycleCount ? "#5CC7A0" : "#E2E8F0" }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Done message */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-[#B8EDD9] rounded-2xl p-4"
          >
            <div className="text-2xl mb-1">🌟😌🌸</div>
            <div className="font-display text-base font-bold text-[#0F5C3A]">
              Bien joué ! Tu te sens mieux ?
            </div>
            <div className="text-xs text-[#0F5C3A] mt-1 font-semibold">
              {pattern.cycles} cycles de respiration terminés · +2 étoiles ✨
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons */}
      <div className="flex gap-3">
        {!running ? (
          <button onClick={start} className="btn-primary btn-mint flex-1 justify-center">
            {done ? "🔄 Recommencer" : "▶ Commencer"}
          </button>
        ) : (
          <button onClick={stop}
            className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-sm font-bold
              text-[#7A8BA0] hover:bg-gray-50 transition-all">
            ⏸ Pause
          </button>
        )}
      </div>
    </div>
  );
}
