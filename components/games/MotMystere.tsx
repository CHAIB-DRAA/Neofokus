"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "show" | "recall" | "feedback" | "win";

const WORDS = [
  { word: "SOLEIL", hint: "☀️ Il brille dans le ciel" },
  { word: "JARDIN", hint: "🌿 On y fait pousser des fleurs" },
  { word: "REQUIN", hint: "🦈 Poisson des grands fonds" },
  { word: "BALLON", hint: "⚽ On le lance et on l'attrape" },
  { word: "FLECHE", hint: "🏹 Pointe vers une direction" },
  { word: "CASQUE", hint: "⛑️ Protège la tête" },
  { word: "MOUTON", hint: "🐑 Animal à laine" },
  { word: "NUAGE",  hint: "☁️ Flotte dans le ciel" },
  { word: "TIGRE",  hint: "🐯 Grand félin rayé" },
  { word: "OISEAU", hint: "🐦 Il vole et chante" },
];

const SHOW_DURATION = 2500;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MotMystere() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [queue, setQueue] = useState<typeof WORDS>([]);
  const [idx, setIdx] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(true);

  const showTimer = useRef(0);

  function startGame() {
    const q = shuffle(WORDS).slice(0, 8);
    setQueue(q);
    setIdx(0);
    setScore(0);
    showWord(0, q);
  }

  function showWord(i: number, q: typeof WORDS) {
    setPhase("show");
    setSelected([]);
    setSelectedIndices([]);
    setLastCorrect(true);

    showTimer.current = window.setTimeout(() => {
      const word = q[i].word;
      setLetters(shuffle(word.split("")));
      setPhase("recall");
    }, SHOW_DURATION);
  }

  function tapLetter(letter: string, pos: number) {
    if (phase !== "recall") return;
    if (selectedIndices.includes(pos)) return;
    const newSelected = [...selected, letter];
    const newIndices = [...selectedIndices, pos];
    setSelected(newSelected);
    setSelectedIndices(newIndices);

    const target = queue[idx].word;
    if (newSelected.join("") === target.slice(0, newSelected.length)) {
      if (newSelected.length === target.length) {
        // Correct!
        setLastCorrect(true);
        const newScore = score + 1;
        setScore(newScore);
        setPhase("feedback");
        showTimer.current = window.setTimeout(() => {
          const next = idx + 1;
          if (next >= queue.length) {
            addStars(newScore >= 7 ? 5 : newScore >= 5 ? 4 : newScore >= 3 ? 3 : 2);
            setPhase("win");
          } else {
            setIdx(next);
            showWord(next, queue);
          }
        }, 1000);
      }
    } else {
      // Wrong tap
      setLastCorrect(false);
      setTimeout(() => {
        setSelected([]);
        setSelectedIndices([]);
        setLastCorrect(true);
      }, 500);
    }
  }

  const item = queue[idx];
  const target = item?.word ?? "";
  const pct = target ? (selected.length / target.length) * 100 : 0;

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">

        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
            <div className="text-6xl mb-3">🔤</div>
            <div className="font-display text-lg font-extrabold text-[#0F5C3A] mb-2">Mot Mystère</div>
            <div className="bg-[#B8EDD9] rounded-2xl p-4 mb-3 text-sm text-[#0F5C3A] font-semibold leading-relaxed text-left">
              Un mot s'affiche brièvement. Mémorise-le ! Ensuite, retape ses lettres dans le bon ordre depuis les lettres mélangées.
            </div>
            <div className="text-xs text-[#7A8BA0] mb-5">
              🔬 Entraîne la mémoire visuelle des mots — aide pour la lecture et l'orthographe
            </div>
            <button onClick={startGame} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #5CC7A0, #0F5C3A)", color: "white", border: "none" }}>
              🔤 Jouer
            </button>
          </motion.div>
        )}

        {phase === "show" && item && (
          <motion.div key={`show-${idx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} className="text-center py-6">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A8BA0] mb-4">
              Mot {idx + 1} / {queue.length} — Mémorise !
            </div>
            <div className="text-sm text-[#4A5568] font-semibold mb-4">{item.hint}</div>
            <motion.div
              initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              className="rounded-2xl px-6 py-5 mx-4 font-display text-4xl font-extrabold tracking-[0.3em] text-[#0F5C3A]"
              style={{ background: "#B8EDD9", border: "2px solid #5CC7A0" }}>
              {item.word}
            </motion.div>
            <div className="text-xs text-[#7A8BA0] mt-4">Disparaît dans 2,5 secondes…</div>
          </motion.div>
        )}

        {(phase === "recall" || phase === "feedback") && item && (
          <motion.div key={`recall-${idx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A8BA0]">
                Mot {idx + 1} / {queue.length}
              </div>
              <div className="text-xs font-extrabold text-[#5CC7A0]">Score: {score}</div>
            </div>

            <div className="text-sm text-[#4A5568] font-semibold text-center mb-3">{item.hint}</div>

            {/* Answer boxes */}
            <div className="flex justify-center gap-2 mb-5">
              {Array.from({ length: target.length }).map((_, i) => (
                <motion.div key={i}
                  animate={{ scale: selected[i] ? 1 : 0.9,
                    backgroundColor: phase === "feedback" ? "#B8EDD9" : !lastCorrect && i >= selected.length ? "#FDECEA" : selected[i] ? "#FFF9C4" : "#F8F6F0" }}
                  className="w-10 h-12 rounded-xl flex items-center justify-center font-display text-xl font-extrabold border-2"
                  style={{ borderColor: phase === "feedback" ? "#5CC7A0" : selected[i] ? "#FFD93D" : "#E2E8F0",
                    color: "#1E2A38" }}>
                  {selected[i] ?? ""}
                  {phase === "feedback" && <span>{target[i]}</span>}
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-[#E2E8F0] rounded-full mb-5 overflow-hidden">
              <motion.div className="h-full rounded-full bg-[#5CC7A0]"
                animate={{ width: `${pct}%` }} />
            </div>

            {/* Letter buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              {letters.map((letter, pos) => {
                const used = selectedIndices.includes(pos);
                return (
                  <motion.button key={pos}
                    onClick={() => tapLetter(letter, pos)}
                    disabled={used || phase === "feedback"}
                    whileTap={{ scale: 0.85 }}
                    className="w-12 h-12 rounded-xl font-display text-xl font-extrabold border-2 transition-all"
                    style={{
                      background: used ? "#E2E8F0" : "#FFF9C4",
                      borderColor: used ? "#E2E8F0" : "#FFD93D",
                      color: used ? "#B0B8C4" : "#1E2A38",
                      opacity: used ? 0.5 : 1,
                    }}>
                    {letter}
                  </motion.button>
                );
              })}
            </div>

            {!lastCorrect && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center text-xs text-[#E05050] font-bold mt-3">
                Ce n'est pas la bonne lettre — recommence !
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === "win" && (
          <motion.div key="win" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="rounded-3xl p-6 text-center"
            style={{ background: "linear-gradient(135deg, #B8EDD9, #FFF9C4)" }}>
            <div className="text-4xl mb-2">🔤🏆</div>
            <div className="font-display text-xl font-extrabold text-[#0F5C3A] mb-1">Mots décodés !</div>
            <div className="text-lg font-extrabold text-[#5CC7A0] mb-3">{score} / {queue.length}</div>
            <div className="text-xs text-[#4A5568] font-semibold mb-4">
              🔬 La mémoire visuelle des mots soutient la lecture et l'orthographe.
            </div>
            <button onClick={startGame}
              className="w-full py-3 rounded-2xl font-display font-extrabold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #5CC7A0, #0F5C3A)" }}>
              🔤 Rejouer
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
