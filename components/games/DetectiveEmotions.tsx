"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "question" | "feedback" | "win" | "lose";

interface Scenario {
  text: string;
  face: string;
  correct: string;
  choices: string[];
}

const SCENARIOS: Scenario[] = [
  { text: "Lucas renverse son jus de fruit sur son dessin qu'il a mis 1h à faire.", face: "😮", correct: "Triste", choices: ["Triste", "Joyeux", "Fier", "Calme"] },
  { text: "Emma reçoit un cadeau surprise pour son anniversaire.", face: "🎁", correct: "Joyeux", choices: ["Joyeux", "Fâché", "Triste", "Peur"] },
  { text: "Tom se retrouve tout seul dans le noir sans lampe.", face: "🌑", correct: "Peur", choices: ["Peur", "Joyeux", "Surpris", "Calme"] },
  { text: "Léa est choisie première pour jouer au foot dans la cour.", face: "⚽", correct: "Fier", choices: ["Fier", "Triste", "Peur", "Fâché"] },
  { text: "Noah attend son tour depuis très longtemps et tout le monde passe avant lui.", face: "😤", correct: "Fâché", choices: ["Fâché", "Joyeux", "Calme", "Surpris"] },
  { text: "Chloé voit son chien pour la première fois après les vacances.", face: "🐕", correct: "Joyeux", choices: ["Joyeux", "Triste", "Peur", "Fâché"] },
  { text: "Paul reçoit une bonne note surprise alors qu'il pensait avoir raté.", face: "📝", correct: "Surpris", choices: ["Surpris", "Triste", "Calme", "Peur"] },
  { text: "Sarah oublie ses affaires chez une amie et ne peut pas faire ses devoirs.", face: "🎒", correct: "Triste", choices: ["Triste", "Joyeux", "Fier", "Surpris"] },
  { text: "Max réussit à garder son calme quand quelqu'un l'embête.", face: "😌", correct: "Calme", choices: ["Calme", "Fâché", "Peur", "Joyeux"] },
  { text: "Julie rate l'autobus et va être en retard à l'école.", face: "🚌", correct: "Fâché", choices: ["Fâché", "Joyeux", "Calme", "Fier"] },
  { text: "Marco aide un camarade qui pleurait et se sent bien après.", face: "🤝", correct: "Fier", choices: ["Fier", "Triste", "Peur", "Surpris"] },
  { text: "Inès entend un bruit bizarre la nuit dans sa chambre.", face: "🌙", correct: "Peur", choices: ["Peur", "Calme", "Joyeux", "Fier"] },
];

const EMOTION_COLORS: Record<string, string> = {
  "Joyeux":  "#FFD93D",
  "Triste":  "#7DC4E8",
  "Fâché":   "#E05050",
  "Peur":    "#8E72DB",
  "Surpris": "#FF922B",
  "Fier":    "#5CC7A0",
  "Calme":   "#B8EDD9",
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DetectiveEmotions() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [queue, setQueue] = useState<Scenario[]>([]);
  const [idx, setIdx] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState("");

  function startGame() {
    setQueue(shuffle(SCENARIOS).slice(0, 10));
    setIdx(0);
    setLives(3);
    setScore(0);
    setChosen("");
    setPhase("question");
  }

  function answer(choice: string) {
    if (phase !== "question") return;
    setChosen(choice);
    const current = queue[idx];
    const correct = choice === current.correct;
    const newLives = lives - (correct ? 0 : 1);
    const newScore = score + (correct ? 1 : 0);
    setLives(newLives);
    setScore(newScore);
    setPhase("feedback");

    setTimeout(() => {
      setChosen("");
      const next = idx + 1;
      if (newLives <= 0) { setPhase("lose"); return; }
      if (next >= queue.length) {
        addStars(newScore >= 9 ? 5 : newScore >= 7 ? 4 : newScore >= 5 ? 3 : 2);
        setPhase("win");
      } else {
        setIdx(next);
        setPhase("question");
      }
    }, 1400);
  }

  const scenario = queue[idx];

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">

        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
            <div className="text-6xl mb-3">🔍</div>
            <div className="font-display text-lg font-extrabold text-[#0F5C3A] mb-2">Détective des Émotions</div>
            <div className="bg-[#B8EDD9] rounded-2xl p-4 mb-3 text-sm text-[#0F5C3A] font-semibold leading-relaxed text-left">
              Lis chaque situation et devine l'émotion ressentie par le personnage. Mets-toi dans sa peau !
            </div>
            <div className="text-xs text-[#7A8BA0] mb-5">
              🔬 Entraîne la reconnaissance émotionnelle — compétence sociale clé pour les enfants TDAH
            </div>
            <button onClick={startGame} className="btn-primary mx-auto"
              style={{ background: "linear-gradient(135deg, #5CC7A0, #0F5C3A)", color: "white", border: "none" }}>
              🔍 Devenir détective
            </button>
          </motion.div>
        )}

        {(phase === "question" || phase === "feedback") && scenario && (
          <motion.div key={`q${idx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A8BA0]">
                {idx + 1} / {queue.length}
              </div>
              <div className="flex gap-1">
                {[1,2,3].map((i) => (
                  <span key={i} className="text-base" style={{ opacity: i <= lives ? 1 : 0.2 }}>❤️</span>
                ))}
              </div>
            </div>

            {/* Scenario */}
            <div className="rounded-2xl p-4 mb-3 text-center"
              style={{ background: "#F8F6F0", border: "2px solid #E2E8F0" }}>
              <div className="text-4xl mb-2">{scenario.face}</div>
              <div className="text-sm font-semibold text-[#1E2A38] leading-relaxed">{scenario.text}</div>
            </div>

            <div className="text-xs font-extrabold uppercase tracking-wider text-[#7A8BA0] mb-2 text-center">
              Comment se sent-il/elle ?
            </div>

            <div className="grid grid-cols-2 gap-2">
              {scenario.choices.map((c) => {
                const isFeedback = phase === "feedback";
                const isChosen = chosen === c;
                const isCorrect = c === scenario.correct;
                let bg = "#F8F6F0";
                let border = "#E2E8F0";
                if (isFeedback && isCorrect) { bg = "#B8EDD9"; border = "#5CC7A0"; }
                if (isFeedback && isChosen && !isCorrect) { bg = "#FDECEA"; border = "#E05050"; }

                return (
                  <motion.button key={c}
                    onClick={() => answer(c)}
                    disabled={isFeedback}
                    animate={{ scale: isFeedback && isChosen ? 1.05 : 1 }}
                    className="py-3 px-2 rounded-2xl font-display font-extrabold text-sm border-2 transition-all"
                    style={{ background: bg, borderColor: border, color: "#1E2A38" }}>
                    <span className="text-lg mr-1" style={{ color: EMOTION_COLORS[c] }}>●</span>
                    {c}
                    {isFeedback && isCorrect && " ✓"}
                    {isFeedback && isChosen && !isCorrect && " ✗"}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {phase === "lose" && (
          <motion.div key="lose" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }} className="text-center py-6">
            <div className="text-5xl mb-3">🔍</div>
            <div className="font-display text-lg font-extrabold text-[#E05050] mb-2">L'enquête est close…</div>
            <div className="text-sm text-[#7A8BA0] mb-4">{score} / {idx} bonnes réponses — réessaie !</div>
            <button onClick={startGame}
              className="w-full py-3 rounded-2xl font-display font-extrabold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #5CC7A0, #0F5C3A)" }}>
              🔍 Réessayer
            </button>
          </motion.div>
        )}

        {phase === "win" && (
          <motion.div key="win" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="rounded-3xl p-6 text-center"
            style={{ background: "linear-gradient(135deg, #B8EDD9, #FFF9C4)" }}>
            <div className="text-4xl mb-2">🔍🏆</div>
            <div className="font-display text-xl font-extrabold text-[#0F5C3A] mb-1">Super détective !</div>
            <div className="text-sm text-[#7A8BA0] mb-3">{score} / {queue.length} — super empathie !</div>
            <div className="text-xs text-[#4A5568] font-semibold mb-4">
              🔬 Comprendre les émotions des autres aide à mieux gérer les siennes.
            </div>
            <button onClick={startGame}
              className="w-full py-3 rounded-2xl font-display font-extrabold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #5CC7A0, #0F5C3A)" }}>
              🔍 Rejouer
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
