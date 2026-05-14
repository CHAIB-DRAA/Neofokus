"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "memorise" | "ecris" | "correct" | "wrong" | "win";

const MOTS = [
  { mot: "chat",    emoji: "🐱" },
  { mot: "lapin",   emoji: "🐰" },
  { mot: "soleil",  emoji: "☀️" },
  { mot: "maison",  emoji: "🏠" },
  { mot: "forêt",   emoji: "🌲" },
  { mot: "bateau",  emoji: "⛵" },
  { mot: "nuage",   emoji: "☁️" },
  { mot: "fusée",   emoji: "🚀" },
  { mot: "étoile",  emoji: "⭐" },
  { mot: "jardin",  emoji: "🌸" },
  { mot: "ballon",  emoji: "🎈" },
  { mot: "cerise",  emoji: "🍒" },
  { mot: "école",   emoji: "🏫" },
  { mot: "livre",   emoji: "📚" },
  { mot: "cheval",  emoji: "🐴" },
];

const SHOW_TIME = 3000;
const TOTAL = 8;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function shuffleLetters(mot: string): string[] {
  return shuffle(mot.split(""));
}

export default function DicteeEclair() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [queue, setQueue] = useState<typeof MOTS>([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [letters, setLetters] = useState<{ char: string; used: boolean }[]>([]);
  const [answer, setAnswer] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(SHOW_TIME / 1000);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const current = queue[roundIdx] ?? MOTS[0];

  const startMemorize = useCallback((mot: string) => {
    setPhase("memorise");
    setAnswer([]);
    const shuffled = shuffleLetters(mot);
    setLetters(shuffled.map((c) => ({ char: c, used: false })));
    setCountdown(SHOW_TIME / 1000);

    let c = SHOW_TIME / 1000;
    timerRef.current = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(timerRef.current!);
        setPhase("ecris");
      }
    }, 1000);
  }, []);

  function start() {
    const q = shuffle(MOTS).slice(0, TOTAL);
    setQueue(q);
    setRoundIdx(0);
    setScore(0);
    startMemorize(q[0].mot);
  }

  function handleLetterClick(i: number) {
    if (phase !== "ecris") return;
    if (letters[i].used) return;
    const newLetters = [...letters];
    newLetters[i] = { ...newLetters[i], used: true };
    setLetters(newLetters);
    const newAnswer = [...answer, letters[i].char];
    setAnswer(newAnswer);

    if (newAnswer.length === current.mot.length) {
      const correct = newAnswer.join("") === current.mot;
      if (correct) {
        setScore((s) => s + 15);
        setPhase("correct");
        const next = roundIdx + 1;
        if (next >= TOTAL) {
          addStars(3);
          setTimeout(() => setPhase("win"), 1000);
        } else {
          setTimeout(() => {
            setRoundIdx(next);
            startMemorize(queue[next].mot);
          }, 1000);
        }
      } else {
        setPhase("wrong");
        setTimeout(() => {
          setAnswer([]);
          setLetters((prev) => prev.map((l) => ({ ...l, used: false })));
          setPhase("ecris");
        }, 1200);
      }
    }
  }

  function handleErase() {
    if (answer.length === 0 || phase !== "ecris") return;
    const lastChar = answer[answer.length - 1];
    const newAnswer = answer.slice(0, -1);
    setAnswer(newAnswer);
    // unmark last used
    const idx = letters.findLastIndex((l) => l.used && l.char === lastChar);
    if (idx !== -1) {
      const newLetters = [...letters];
      newLetters[idx] = { ...newLetters[idx], used: false };
      setLetters(newLetters);
    }
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
            <div className="text-5xl mb-3">✨</div>
            <div className="font-display text-lg font-bold text-[#1E2A38] mb-1">Dictée Éclair</div>
            <div className="text-sm text-[#7A8BA0] mb-4 max-w-xs mx-auto">
              Un mot s'affiche 3 secondes — mémorise-le, puis reconstitue-le avec les lettres mélangées !
            </div>
            <div className="bg-[#B8EDD9] rounded-2xl p-3 mb-5 text-xs text-[#0F5C3A] font-semibold">
              🔬 <strong>Méthode Orton-Gillingham :</strong> voir, dire, mémoriser, écrire — entraîne la mémoire orthographique visuelle.
            </div>
            <button onClick={start} className="btn-primary btn-mint mx-auto">✨ Commencer !</button>
          </motion.div>
        )}

        {phase === "memorise" && (
          <motion.div key="memorise" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center py-6 gap-4">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#7A8BA0]">
              Mémorise ce mot ! ({roundIdx + 1}/{TOTAL})
            </div>
            {/* Countdown ring */}
            <div className="relative w-10 h-10">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="16" fill="none" stroke="#F0F4F8" strokeWidth="4"/>
                <circle cx="20" cy="20" r="16" fill="none" stroke="#5CC7A0" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 16}
                  strokeDashoffset={2 * Math.PI * 16 * (1 - countdown / (SHOW_TIME / 1000))}
                  style={{ transition: "stroke-dashoffset 1s linear" }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-display font-extrabold text-sm text-[#5CC7A0]">
                {countdown}
              </div>
            </div>

            <motion.div
              className="flex flex-col items-center bg-white rounded-3xl p-8 border-2 w-full"
              style={{ borderColor: "#5CC7A0", boxShadow: "0 4px 20px rgba(92,199,160,0.2)" }}
            >
              <div className="text-7xl mb-4">{current.emoji}</div>
              <div className="font-display text-4xl font-extrabold text-[#1E2A38] tracking-wide">
                {current.mot}
              </div>
              <div className="text-xs text-[#7A8BA0] font-semibold mt-2">
                {current.mot.length} lettre{current.mot.length > 1 ? "s" : ""}
              </div>
            </motion.div>

            <div className="text-sm font-semibold text-[#7A8BA0] text-center">
              👀 Regarde bien chaque lettre et dis le mot à voix haute…
            </div>
          </motion.div>
        )}

        {(phase === "ecris" || phase === "correct" || phase === "wrong") && (
          <motion.div key="ecris" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center text-xs font-bold">
              <div className="text-[#7A8BA0]">{roundIdx + 1}/{TOTAL}</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{current.emoji}</span>
                <span className="text-[#7A8BA0] font-semibold">{current.mot.length} lettres</span>
              </div>
              <div className="text-[#FF922B]">⭐ {score}</div>
            </div>

            {/* Status */}
            <div className="text-center text-sm font-extrabold py-2 rounded-2xl"
              style={{
                background: phase === "correct" ? "#B8EDD9" : phase === "wrong" ? "#FDECEA" : "#FFF9C4",
                color: phase === "correct" ? "#0F5C3A" : phase === "wrong" ? "#C02020" : "#9C6800",
              }}>
              {phase === "correct" ? `✅ Bravo ! "${current.mot}" !` :
               phase === "wrong" ? `❌ Pas tout à fait… Le mot : "${current.mot}"` :
               "✏️ Reconstitue le mot dans l'ordre !"}
            </div>

            {/* Zone réponse */}
            <div className="flex justify-center gap-2 flex-wrap min-h-[56px] items-center
              bg-[#F8F6F0] rounded-2xl p-3">
              {Array.from({ length: current.mot.length }).map((_, i) => (
                <div key={i}
                  className="w-10 h-10 rounded-xl border-2 flex items-center justify-center font-display text-xl font-extrabold"
                  style={{
                    borderColor: i < answer.length
                      ? (phase === "correct" ? "#5CC7A0" : phase === "wrong" ? "#E05050" : "#5B9CF6")
                      : "#E2E8F0",
                    background: i < answer.length ? "white" : "transparent",
                    color: phase === "correct" ? "#5CC7A0" : phase === "wrong" ? "#E05050" : "#1E2A38",
                  }}>
                  {answer[i] ?? ""}
                </div>
              ))}
            </div>

            {/* Lettres mélangées */}
            <div className="flex flex-wrap justify-center gap-2">
              {letters.map((l, i) => (
                <motion.button key={i} whileTap={!l.used ? { scale: 0.85 } : {}}
                  onClick={() => handleLetterClick(i)}
                  disabled={l.used || phase !== "ecris"}
                  className="w-12 h-12 rounded-xl font-display text-xl font-extrabold border-2 transition-all"
                  style={{
                    background: l.used ? "#F0F4F8" : "white",
                    borderColor: l.used ? "#E2E8F0" : "#5B9CF6",
                    color: l.used ? "#CBD5E0" : "#1E2A38",
                    opacity: l.used ? 0.4 : 1,
                    cursor: l.used ? "default" : "pointer",
                  }}>
                  {l.char}
                </motion.button>
              ))}
            </div>

            {/* Effacer */}
            {phase === "ecris" && (
              <button onClick={handleErase} disabled={answer.length === 0}
                className="w-full py-3 rounded-2xl border-2 border-gray-200 text-sm font-bold text-[#7A8BA0]
                  disabled:opacity-40 hover:bg-gray-50 transition-all">
                ⌫ Effacer la dernière lettre
              </button>
            )}
          </motion.div>
        )}

        {phase === "win" && (
          <motion.div key="win" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }} className="text-center py-4">
            <div className="text-4xl mb-3">🏆✨📚</div>
            <div className="font-display text-xl font-extrabold text-[#5CC7A0] mb-1">
              Mémoire orthographique au top !
            </div>
            <div className="text-sm text-[#7A8BA0] mb-4">Score : {score} pts · {TOTAL} mots réussis !</div>
            <div className="bg-[#B8EDD9] rounded-2xl p-3 mb-5 text-xs font-semibold text-[#0F5C3A]">
              📖 Tu as entraîné ta <strong>mémoire orthographique visuelle</strong> — la capacité à retenir l'image d'un mot. C'est la base de l'écriture sans fautes !
            </div>
            <button onClick={start} className="btn-primary btn-mint mx-auto">🔄 Rejouer</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}