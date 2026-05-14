"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

const DURATIONS = [
  { label: "2 min", seconds: 120, color: "#5CC7A0", bg: "#B8EDD9" },
  { label: "5 min", seconds: 300, color: "#7DC4E8", bg: "#BFE3F5" },
  { label: "10 min", seconds: 600, color: "#8E72DB", bg: "#E8E0F8" },
];

const FOCUS_TASKS = [
  "Lis 1 page de ton livre 📖",
  "Fais tes exercices de maths ✏️",
  "Range 5 affaires 🧹",
  "Dessine quelque chose 🎨",
  "Écris 3 phrases 📝",
];

type Phase = "idle" | "focus" | "break" | "done";

export default function DefMinuteur() {
  const [selectedDur, setSelectedDur] = useState(DURATIONS[1]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(DURATIONS[1].seconds);
  const [task, setTask] = useState(FOCUS_TASKS[0]);
  const [customTask, setCustomTask] = useState("");
  const [rounds, setRounds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = selectedDur.seconds;
  const pct = ((total - timeLeft) / total) * 100;

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const start = () => {
    clearTimer();
    setTimeLeft(selectedDur.seconds);
    setPhase("focus");
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTimer();
          useQuestStore.getState().addStars(3);
          setPhase("done");
          setRounds((r) => r + 1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const reset = () => {
    clearTimer();
    setPhase("idle");
    setTimeLeft(selectedDur.seconds);
  };

  useEffect(() => {
    setTimeLeft(selectedDur.seconds);
  }, [selectedDur]);

  useEffect(() => () => clearTimer(), []);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div className="space-y-5">
      {/* Duration selector */}
      {phase === "idle" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="text-xs font-bold text-[#7A8BA0] uppercase tracking-wider mb-2">
            Choisir la durée
          </div>
          <div className="flex gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d.label}
                onClick={() => setSelectedDur(d)}
                className="flex-1 py-2.5 rounded-2xl text-sm font-bold border-2 transition-all"
                style={{
                  background: selectedDur.label === d.label ? d.bg : "transparent",
                  borderColor: selectedDur.label === d.label ? d.color : "#E2E8F0",
                  color: selectedDur.label === d.label ? d.color : "#7A8BA0",
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Task selector */}
      {phase === "idle" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="text-xs font-bold text-[#7A8BA0] uppercase tracking-wider mb-2">
            Ma mission
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {FOCUS_TASKS.map((t) => (
              <button
                key={t}
                onClick={() => { setTask(t); setCustomTask(""); }}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
                style={{
                  background: task === t && !customTask ? "#BFE3F5" : "transparent",
                  borderColor: task === t && !customTask ? "#7DC4E8" : "#E2E8F0",
                  color: task === t && !customTask ? "#1A5F7A" : "#7A8BA0",
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={customTask}
            onChange={(e) => { setCustomTask(e.target.value); setTask(e.target.value); }}
            placeholder="Ou tape ta propre mission…"
            className="w-full text-sm px-4 py-2.5 rounded-2xl border-2 border-gray-100
              bg-[#F8F6F0] outline-none focus:border-[#7DC4E8] text-[#1E2A38] font-semibold"
          />
        </motion.div>
      )}

      {/* Timer circle */}
      <div className="flex flex-col items-center py-4">
        <div className="relative w-36 h-36 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#F0F4F8" strokeWidth="8" />
            <motion.circle
              cx="60" cy="60" r="54"
              fill="none"
              strokeWidth="8"
              stroke={selectedDur.color}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-display text-3xl font-extrabold text-[#1E2A38]">
              {mins}:{secs}
            </div>
            <div className="text-xs font-semibold text-[#7A8BA0]">
              {phase === "focus" ? "FOCUS" : phase === "done" ? "BRAVO !" : "PRÊT"}
            </div>
          </div>
        </div>

        {/* Task label during focus */}
        <AnimatePresence>
          {phase === "focus" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm font-semibold text-[#4A5568] text-center mb-2 px-4"
            >
              🎯 {task || "Focus total !"}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Done celebration + Pause active */}
        <AnimatePresence>
          {phase === "done" && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 14 }}
              className="w-full mb-2"
            >
              <div className="text-center mb-3">
                <div className="text-3xl mb-1">🎉⭐🏆</div>
                <div className="font-display text-lg font-extrabold text-[#FF922B]">
                  Super travail !
                </div>
                <div className="text-xs text-[#9C6800] font-semibold mt-1">
                  {rounds} session{rounds > 1 ? "s" : ""} terminée{rounds > 1 ? "s" : ""} · +3 étoiles !
                </div>
              </div>

              {/* Pause active — fondée sur la recherche */}
              <div className="bg-[#E8F7FF] rounded-2xl p-4 border border-[#7DC4E8]/30">
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#1A5F7A] mb-2">
                  🔬 Pause active recommandée
                </div>
                <div className="text-xs text-[#4A5568] font-semibold mb-3">
                  10 min de mouvement = 30 min de concentration en plus (Pontifex, 2013).
                  Choisis une activité avant de relancer :
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { href: "/explorateur/bouge", icon: "🤸", label: "Bouge & Compte", desc: "2 min de mouvement" },
                    { href: "/explorateur/bulle", icon: "🧘", label: "Bulle de calme", desc: "Respiration 5-5" },
                    { icon: "💧", label: "Boire de l'eau", desc: "Regarde par la fenêtre 2 min", href: null },
                  ].map((a) =>
                    a.href ? (
                      <a key={a.label} href={a.href}
                        className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 border border-[#7DC4E8]/40 hover:shadow-sm transition-all">
                        <span className="text-lg">{a.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-[#1E2A38]">{a.label}</div>
                          <div className="text-[10px] text-[#7A8BA0] font-semibold">{a.desc}</div>
                        </div>
                      </a>
                    ) : (
                      <div key={a.label}
                        className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 border border-[#7DC4E8]/40">
                        <span className="text-lg">{a.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-[#1E2A38]">{a.label}</div>
                          <div className="text-[10px] text-[#7A8BA0] font-semibold">{a.desc}</div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rounds counter */}
        {rounds > 0 && phase !== "done" && (
          <div className="flex gap-1 mb-3">
            {Array.from({ length: Math.min(rounds, 6) }).map((_, i) => (
              <div key={i} className="w-5 h-5 rounded-full bg-[#FFD93D] flex items-center justify-center text-[10px]">⭐</div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        {phase === "idle" || phase === "done" ? (
          <button onClick={start} className="btn-primary btn-mint flex-1 justify-center text-base">
            {phase === "done" ? "🔄 Nouvelle session" : "▶ Démarrer le focus"}
          </button>
        ) : (
          <>
            <button onClick={reset}
              className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-sm font-bold
                text-[#7A8BA0] hover:bg-gray-50 transition-all">
              ⏹ Arrêter
            </button>
          </>
        )}
      </div>
    </div>
  );
}
