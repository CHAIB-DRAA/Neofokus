"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/lib/useQuestStore";

type Phase = "idle" | "writing" | "done";

const PROMPTS = [
  { emoji: "🚀", text: "Tu es le premier humain à débarquer sur une planète inconnue. Décris ce que tu vois et ressens." },
  { emoji: "🤖", text: "Tu rencontres un robot qui a perdu tous ses souvenirs. Écris ce que tu lui racontes pour l'aider." },
  { emoji: "🌊", text: "Invente la suite : « L'ocean s'est mis à parler un matin... »" },
  { emoji: "🦸", text: "Tu as un super-pouvoir bizarre. Décris-le et comment tu l'utilises dans une journée normale." },
  { emoji: "🕰️", text: "Tu peux voyager dans le temps une seule fois. Où et quand vas-tu, et pourquoi ?" },
  { emoji: "🌳", text: "Un arbre centenaire pourrait parler. Quelles histoires te raconterait-il ?" },
  { emoji: "🎭", text: "Imagine ta vie si tu échangeais de place avec ton animal de compagnie (ou un animal de ton choix)." },
  { emoji: "🌙", text: "Décris un rêve bizarre qui pourrait devenir une aventure réelle." },
  { emoji: "🎨", text: "Tu es un artiste qui peint les émotions. Comment représentes-tu la joie, la tristesse, la colère ?" },
  { emoji: "🔑", text: "Tu trouves une clé mystérieuse. Elle ouvre une porte que personne d'autre ne peut voir. Qu'est-ce qu'il y a derrière ?" },
];

const DURATIONS = [
  { label: "2 min", seconds: 120 },
  { label: "5 min", seconds: 300 },
  { label: "Libre", seconds: 0 },
];

export default function DefiCreatif() {
  const addStars = useQuestStore((s) => s.addStars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const [durIdx, setDurIdx] = useState(0);
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
  }, [text]);

  function start() {
    const dur = DURATIONS[durIdx];
    setTimeLeft(dur.seconds);
    setText("");
    setPhase("writing");
    if (dur.seconds > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            useQuestStore.getState().addStars(2);
            setPhase("done");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
  }

  function finish() {
    if (timerRef.current) clearInterval(timerRef.current);
    addStars(2);
    setPhase("done");
  }

  function reset() {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("idle");
  }

  function newPrompt() {
    const others = PROMPTS.filter((p) => p.text !== prompt.text);
    setPrompt(others[Math.floor(Math.random() * others.length)]);
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const dur = DURATIONS[durIdx];
  const pct = dur.seconds > 0 ? ((dur.seconds - timeLeft) / dur.seconds) * 100 : 0;
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const urgency = timeLeft > 0 && timeLeft <= 30;

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="text-center">
              <div className="text-5xl mb-2">✍️</div>
              <div className="font-display text-lg font-bold text-[#1E2A38] mb-1">Défi Créatif</div>
              <div className="text-sm text-[#7A8BA0]">Laisse parler ton imagination !</div>
            </div>

            {/* Prompt card */}
            <motion.div
              className="bg-gradient-to-br from-[#F3F0FF] to-[#E8E0F8] rounded-3xl p-5 border-2 border-[#8E72DB]/30"
            >
              <div className="text-3xl mb-2">{prompt.emoji}</div>
              <div className="text-sm font-semibold text-[#3D1F8A] leading-relaxed">
                {prompt.text}
              </div>
            </motion.div>

            <button onClick={newPrompt}
              className="w-full text-sm font-bold text-[#8E72DB] py-2.5 rounded-2xl border-2 border-[#E8E0F8]
                hover:bg-[#F3F0FF] transition-all">
              🎲 Autre sujet
            </button>

            {/* Duration */}
            <div>
              <div className="text-xs font-bold text-[#7A8BA0] uppercase tracking-wider mb-2">
                Durée d'écriture
              </div>
              <div className="flex gap-2">
                {DURATIONS.map((d, i) => (
                  <button key={d.label} onClick={() => setDurIdx(i)}
                    className="flex-1 py-2.5 rounded-2xl text-sm font-bold border-2 transition-all"
                    style={{
                      borderColor: durIdx === i ? "#8E72DB" : "#E2E8F0",
                      background: durIdx === i ? "#E8E0F8" : "transparent",
                      color: durIdx === i ? "#8E72DB" : "#7A8BA0",
                    }}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={start}
              className="btn-primary w-full justify-center"
              style={{ background: "linear-gradient(135deg, #8E72DB, #C084FC)", color: "white", border: "none" }}>
              ✍️ C'est parti !
            </button>
          </motion.div>
        )}

        {phase === "writing" && (
          <motion.div key="writing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {/* Timer */}
            {dur.seconds > 0 && (
              <div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <motion.div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${100 - pct}%`,
                      background: urgency ? "#E05050" : "#8E72DB",
                    }} />
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span style={{ color: urgency ? "#E05050" : "#8E72DB" }}>
                    {urgency ? "⚡ " : "⏱️ "}{mins}:{secs} restantes
                  </span>
                  <span className="text-[#7A8BA0]">{wordCount} mots</span>
                </div>
              </div>
            )}
            {dur.seconds === 0 && (
              <div className="flex justify-between text-xs font-bold text-[#7A8BA0]">
                <span>✍️ Mode libre</span>
                <span>{wordCount} mots</span>
              </div>
            )}

            {/* Prompt reminder */}
            <div className="bg-[#F3F0FF] rounded-2xl px-4 py-3 text-xs font-semibold text-[#5D3FA8] leading-relaxed">
              {prompt.emoji} {prompt.text}
            </div>

            {/* Textarea */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Commence à écrire ici… il n'y a pas de mauvaise réponse ✨"
              className="w-full h-48 rounded-2xl p-4 text-sm font-medium text-[#1E2A38] leading-relaxed
                border-2 border-[#E8E0F8] bg-white outline-none resize-none
                focus:border-[#8E72DB] transition-colors"
            />

            <button onClick={finish}
              className="btn-primary w-full justify-center"
              style={{ background: "linear-gradient(135deg, #8E72DB, #C084FC)", color: "white", border: "none" }}>
              ✅ J'ai terminé !
            </button>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🌟✍️💫</div>
              <div className="font-display text-xl font-extrabold text-[#8E72DB]">
                Bien écrit !
              </div>
              <div className="text-sm text-[#7A8BA0] mt-1">
                {wordCount} mot{wordCount > 1 ? "s" : ""} écrits
              </div>
            </div>

            {/* Text review */}
            {text.trim() && (
              <div className="bg-[#F8F6F0] rounded-2xl p-4 text-sm text-[#4A5568] leading-relaxed max-h-48 overflow-y-auto">
                {text}
              </div>
            )}

            <div className="bg-[#E8E0F8] rounded-2xl p-4 text-xs font-semibold text-[#3D1F8A]">
              💡 L'écriture créative développe ton <strong>expression émotionnelle</strong>, ta
              {" "}<strong>flexibilité mentale</strong> et ton <strong>vocabulaire</strong> !
            </div>

            <div className="flex gap-2">
              <button onClick={reset}
                className="flex-1 py-3 rounded-2xl border-2 border-[#E2E8F0] text-sm font-bold text-[#7A8BA0]">
                🎲 Nouveau sujet
              </button>
              <button onClick={start}
                className="flex-1 py-3 rounded-2xl text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, #8E72DB, #C084FC)" }}>
                🔄 Réécrire
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
