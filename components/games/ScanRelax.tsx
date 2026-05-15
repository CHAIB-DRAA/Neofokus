"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "intro" | "breathing" | "zone" | "done";

interface Zone {
  id: string;
  label: string;
  emoji: string;
  tip: string;
  color: string;
}

const ZONES: Zone[] = [
  { id: "head",       label: "Tête & Mâchoire",   emoji: "😶", tip: "Desserre les dents, relâche le front",    color: "#BFE3F5" },
  { id: "shoulders",  label: "Épaules",            emoji: "🤷", tip: "Laisse tes épaules descendre doucement",  color: "#B8EDD9" },
  { id: "chest",      label: "Poitrine",           emoji: "💗", tip: "Sens ton cœur ralentir à chaque expir",  color: "#FDECEA" },
  { id: "belly",      label: "Ventre",             emoji: "🫁", tip: "Gonfle le ventre à l'inspir, dégonfle",  color: "#FFF9C4" },
  { id: "hands",      label: "Mains & Bras",       emoji: "🙌", tip: "Ouvre les mains, laisse partir la tension", color: "#E8E0F8" },
  { id: "legs",       label: "Jambes & Pieds",     emoji: "🦵", tip: "Relâche les genoux, pose tes pieds plats", color: "#FFE0B2" },
];

type BreathPhase = "inhale" | "hold" | "exhale" | "pause";

const BREATH: Record<BreathPhase, { label: string; duration: number; next: BreathPhase }> = {
  inhale: { label: "Inspire… 🌬️",   duration: 4000, next: "hold"   },
  hold:   { label: "Retiens… 🤫",    duration: 2000, next: "exhale" },
  exhale: { label: "Expire… 😮‍💨",   duration: 6000, next: "pause"  },
  pause:  { label: "Pause…",         duration: 1000, next: "inhale" },
};

export default function ScanRelax() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [zoneIdx, setZoneIdx] = useState(0);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>("inhale");
  const [breathCount, setBreathCount] = useState(0);
  const [relaxed, setRelaxed] = useState<Set<string>>(new Set());

  const breathTimer = useRef(0);

  const runBreath = useCallback((bp: BreathPhase, count: number, targetCount: number, onDone: () => void) => {
    setBreathPhase(bp);
    const { duration, next } = BREATH[bp];
    breathTimer.current = window.setTimeout(() => {
      const newCount = bp === "exhale" ? count + 1 : count;
      setBreathCount(newCount);
      if (newCount >= targetCount && bp === "pause") {
        onDone();
      } else {
        runBreath(next, newCount, targetCount, onDone);
      }
    }, duration);
  }, []);

  function startGame() {
    setZoneIdx(0);
    setRelaxed(new Set());
    setBreathCount(0);
    setPhase("intro");
    breathTimer.current = window.setTimeout(() => {
      setPhase("breathing");
      runBreath("inhale", 0, 3, () => {
        setPhase("zone");
        setZoneIdx(0);
      });
    }, 2000);
  }

  function releaseZone() {
    const zone = ZONES[zoneIdx];
    const newRelaxed = new Set(relaxed).add(zone.id);
    setRelaxed(newRelaxed);
    const next = zoneIdx + 1;

    if (next >= ZONES.length) {
      addStars(5);
      setPhase("done");
    } else {
      setPhase("breathing");
      setZoneIdx(next);
      runBreath("inhale", 0, 2, () => {
        setPhase("zone");
      });
    }
  }

  const zone = ZONES[zoneIdx];
  const bInfo = BREATH[breathPhase];
  const isExhale = breathPhase === "exhale";
  const circleScale = breathPhase === "inhale" ? 1.4 : breathPhase === "hold" ? 1.4 : 0.8;

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">

        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
            <div className="text-6xl mb-3">🌊</div>
            <div className="font-display text-lg font-extrabold text-[#1A5F7A] mb-2">Scan Relax</div>
            <div className="bg-[#BFE3F5] rounded-2xl p-4 mb-3 text-sm text-[#1A5F7A] font-semibold leading-relaxed text-left">
              Un voyage dans ton corps. On va relâcher les tensions zone par zone, en respirant doucement. 5 minutes de paix.
            </div>
            <div className="text-xs text-[#7A8BA0] mb-5">
              🔬 La relaxation musculaire progressive réduit l'hyperactivité et régule les émotions
            </div>
            <button onClick={startGame} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #7DC4E8, #1A5F7A)", color: "white", border: "none" }}>
              🌊 Commencer la relaxation
            </button>
          </motion.div>
        )}

        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <div className="text-5xl mb-4">😌</div>
            <div className="font-display text-lg font-extrabold text-[#1A5F7A]">Installe-toi confortablement…</div>
            <div className="text-sm text-[#7A8BA0] mt-2">Assois-toi ou allonge-toi. Ferme les yeux si tu veux.</div>
          </motion.div>
        )}

        {phase === "breathing" && (
          <motion.div key={`breath-${zoneIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center py-4">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A8BA0] mb-6">
              {zoneIdx === 0 ? "Préparation" : `Avant : ${zone.label}`}
            </div>
            <motion.div
              animate={{ scale: circleScale }}
              transition={{ duration: BREATH[breathPhase].duration / 1000, ease: "easeInOut" }}
              className="w-36 h-36 rounded-full flex items-center justify-center mb-6"
              style={{ background: "linear-gradient(135deg, #BFE3F5, #B8EDD9)",
                boxShadow: "0 0 40px rgba(92,199,160,0.3)" }}>
              <span className="text-4xl">🫁</span>
            </motion.div>
            <div className="font-display text-xl font-extrabold text-[#1A5F7A]">{bInfo.label}</div>
            <div className="text-xs text-[#7A8BA0] mt-2">
              {breathPhase === "inhale" ? "4 secondes" : breathPhase === "hold" ? "2 secondes" : breathPhase === "exhale" ? "6 secondes" : ""}
            </div>
          </motion.div>
        )}

        {phase === "zone" && zone && (
          <motion.div key={`zone-${zoneIdx}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center">
            <div className="flex justify-center gap-1 mb-4">
              {ZONES.map((z, i) => (
                <div key={z.id} className="w-2 h-2 rounded-full"
                  style={{ background: relaxed.has(z.id) ? "#5CC7A0" : i === zoneIdx ? "#1A5F7A" : "#E2E8F0" }} />
              ))}
            </div>

            <motion.div
              className="w-28 h-28 rounded-3xl flex items-center justify-center text-6xl mx-auto mb-4"
              style={{ background: zone.color }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
              {zone.emoji}
            </motion.div>

            <div className="font-display text-xl font-extrabold text-[#1A5F7A] mb-2">{zone.label}</div>
            <div className="text-sm text-[#4A5568] font-semibold mb-6 px-4">{zone.tip}</div>

            <button onClick={releaseZone}
              className="w-full py-4 rounded-2xl font-display font-extrabold text-white text-base"
              style={{ background: `linear-gradient(135deg, ${zone.color}, #5CC7A0)`, color: "#1E2A38" }}>
              ✅ Zone relâchée !
            </button>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div key="done" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="rounded-3xl p-6 text-center"
            style={{ background: "linear-gradient(135deg, #BFE3F5, #B8EDD9)" }}>
            <div className="text-4xl mb-2">🌊✨</div>
            <div className="font-display text-xl font-extrabold text-[#1A5F7A] mb-1">Corps relâché !</div>
            <div className="flex justify-center gap-2 flex-wrap mb-3">
              {ZONES.map((z) => (
                <span key={z.id} className="text-xs font-bold bg-white/70 px-2 py-1 rounded-full text-[#1A5F7A]">
                  {z.emoji} {z.label}
                </span>
              ))}
            </div>
            <div className="text-xs text-[#4A5568] font-semibold mb-4">
              🔬 Le système nerveux parasympathique est activé — ton corps et ton esprit sont calmés.
            </div>
            <button onClick={startGame}
              className="w-full py-3 rounded-2xl font-display font-extrabold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #7DC4E8, #1A5F7A)" }}>
              🌊 Recommencer
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
