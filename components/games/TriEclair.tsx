"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Category = { name: string; emoji: string; color: string; bg: string; items: string[] };

const CATEGORIES: Category[] = [
  { name: "Animaux", emoji: "🐾", color: "#5CC7A0", bg: "#B8EDD9", items: ["🐶","🐱","🐸","🦊","🐼","🐨","🦁","🐯","🐻","🦋","🐬","🦄"] },
  { name: "Nourriture", emoji: "🍽️", color: "#FF922B", bg: "#FFE0B2", items: ["🍎","🍕","🍦","🍇","🥕","🍩","🌮","🍜","🥗","🍰","🥑","🍓"] },
  { name: "Nature", emoji: "🌿", color: "#3A9FD4", bg: "#BFE3F5", items: ["🌸","⭐","🌙","☀️","❄️","🌊","🔥","🌈","🍀","🌺","🌻","🌴"] },
  { name: "Objets", emoji: "🎒", color: "#8E72DB", bg: "#E8E0F8", items: ["🎈","⚽","📚","🎸","🏆","🎨","🚀","🎮","💡","🔑","🎁","🌟"] },
];

const ROUND_TIME = 20;

type GamePhase = "idle" | "playing" | "feedback" | "levelup" | "gameover";

export default function TriEclair() {
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [currentItem, setCurrentItem] = useState("");
  const [correctCat, setCorrectCat] = useState<Category>(CATEGORIES[0]);
  const [options, setOptions] = useState<Category[]>([]);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };

  const generateQuestion = useCallback(() => {
    const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const item = cat.items[Math.floor(Math.random() * cat.items.length)];
    setCorrectCat(cat);
    setCurrentItem(item);
    // Pick 3 other categories as distractors
    const others = CATEGORIES.filter((c) => c.name !== cat.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const opts = [cat, ...others].sort(() => Math.random() - 0.5);
    setOptions(opts);
    setLastCorrect(null);
  }, []);

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(ROUND_TIME);
    setTotalAnswered(0);
    setPhase("playing");
    generateQuestion();

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTimer();
          useQuestStore.getState().addStars(2);
          setPhase("gameover");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleAnswer = (cat: Category) => {
    if (phase !== "playing") return;
    const correct = cat.name === correctCat.name;
    setLastCorrect(correct);
    setTotalAnswered((n) => n + 1);

    if (correct) {
      const pts = 10 + streak * 2;
      setScore((s) => s + pts);
      setStreak((s) => {
        const ns = s + 1;
        setBestStreak((b) => Math.max(b, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }

    setPhase("feedback");
    setTimeout(() => {
      setPhase("playing");
      generateQuestion();
    }, 600);
  };

  useEffect(() => () => clearTimer(), []);

  const accuracy = totalAnswered > 0 ? Math.round(((score / 10) / totalAnswered) * 100) : 0;
  const timePct = (timeLeft / ROUND_TIME) * 100;

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
            <div className="text-5xl mb-3">⚡</div>
            <div className="font-display text-lg font-bold text-[#1E2A38] mb-1">Tri Éclair</div>
            <div className="text-sm text-[#7A8BA0] mb-4 max-w-xs mx-auto">
              Un émoji apparaît — classe-le dans la bonne catégorie aussi vite que possible ! 
              Tu as {ROUND_TIME} secondes.
            </div>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {CATEGORIES.map((c) => (
                <div key={c.name} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
                  style={{ background: c.bg, color: c.color }}>
                  <span>{c.emoji}</span> {c.name}
                </div>
              ))}
            </div>
            <button onClick={startGame} className="btn-primary btn-mint mx-auto">
              ⚡ C'est parti !
            </button>
          </motion.div>
        )}

        {(phase === "playing" || phase === "feedback") && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Timer bar */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full rounded-full"
                style={{ width: `${timePct}%`, background: timePct > 50 ? "#5CC7A0" : timePct > 25 ? "#FFD93D" : "#E05050" }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Stats row */}
            <div className="flex justify-between items-center mb-4 text-xs">
              <div className="font-bold text-[#FF922B]">⚡ Série : {streak}</div>
              <div className="font-bold text-[#7DC4E8]">⏱️ {timeLeft}s</div>
              <div className="font-bold text-[#5CC7A0]">🏆 {score} pts</div>
            </div>

            {/* Current emoji */}
            <div className="flex justify-center mb-6">
              <motion.div
                key={currentItem}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
                className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl"
                style={{
                  background: lastCorrect === true ? "#B8EDD9" :
                               lastCorrect === false ? "#FDECEA" : "#F0F4F8",
                  border: `3px solid ${lastCorrect === true ? "#5CC7A0" : lastCorrect === false ? "#E05050" : "#E2E8F0"}`,
                }}
              >
                {currentItem}
              </motion.div>
            </div>

            {/* Category buttons */}
            <div className="grid grid-cols-2 gap-2">
              {options.map((cat) => (
                <motion.button
                  key={cat.name}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleAnswer(cat)}
                  disabled={phase === "feedback"}
                  className="flex items-center gap-2 py-3 px-4 rounded-2xl border-2 text-sm font-bold
                    transition-all text-left"
                  style={{
                    background: phase === "feedback" && cat.name === correctCat.name ? cat.bg : "white",
                    borderColor: phase === "feedback" && cat.name === correctCat.name ? cat.color : "#E2E8F0",
                    color: "#1E2A38",
                    opacity: phase === "feedback" ? 0.85 : 1,
                  }}
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <span style={{ color: cat.color }}>{cat.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Streak bonus */}
            <AnimatePresence>
              {streak >= 3 && phase === "playing" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center mt-3 text-xs font-bold text-[#FF922B]"
                >
                  🔥 Série x{streak} ! Bonus +{streak * 2} pts par réponse
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {phase === "gameover" && (
          <motion.div
            key="gameover"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-3"
          >
            <div className="text-4xl mb-3">⏰</div>
            <div className="font-display text-xl font-extrabold text-[#1E2A38] mb-1">Temps écoulé !</div>

            <div className="grid grid-cols-3 gap-2 my-4">
              {[
                { label: "Score", value: score + " pts", color: "#FF922B" },
                { label: "Précision", value: accuracy + "%", color: "#5CC7A0" },
                { label: "Meilleure série", value: "x" + bestStreak, color: "#8E72DB" },
              ].map((s) => (
                <div key={s.label} className="bg-[#F8F6F0] rounded-2xl p-3">
                  <div className="font-display text-lg font-extrabold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[10px] font-bold text-[#7A8BA0]">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-[#E8E0F8] rounded-2xl p-3 mb-4 text-xs font-semibold text-[#3D1F8A]">
              💡 Ce jeu entraîne ta flexibilité cognitive — la capacité à changer rapidement d'idée. Superstar !
            </div>

            <button onClick={startGame} className="btn-primary btn-mint mx-auto">
              🔄 Rejouer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
