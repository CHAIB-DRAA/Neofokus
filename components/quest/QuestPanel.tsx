"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, RefreshCw, Sparkles } from "lucide-react";
import StepItem from "./StepItem";
import { useQuestStore } from "@/lib/useQuestStore";

export default function QuestPanel() {
  const { currentQuest, setCurrentQuest, toggleStep, completeQuest, resetQuest } = useQuestStore();
  const [goalInput, setGoalInput] = useState("");
  const [stepInputs, setStepInputs] = useState(["", "", ""]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [goalError, setGoalError] = useState(false);

  const allDone = currentQuest?.steps.every((s) => s.done) && currentQuest.steps.length === 3;

  useEffect(() => {
    if (allDone && !currentQuest?.completed && !showCelebration) {
      setTimeout(() => {
        completeQuest();
        setShowCelebration(true);
      }, 300);
    }
  }, [allDone]);

  const handleStart = () => {
    if (!goalInput.trim()) {
      setGoalError(true);
      setTimeout(() => setGoalError(false), 1200);
      return;
    }
    setCurrentQuest(goalInput.trim(), ["", "", ""]);
    setStepInputs(["", "", ""]);
  };

  const handleStepChange = (index: number, value: string) => {
    const updated = [...stepInputs];
    updated[index] = value;
    setStepInputs(updated);
    if (currentQuest) {
      const updatedSteps = currentQuest.steps.map((s, i) =>
        i === index ? { ...s, text: value } : s
      );
      useQuestStore.setState({
        currentQuest: { ...currentQuest, steps: updatedSteps },
      });
    }
  };

  const handleToggle = (stepId: number) => {
    if (!currentQuest) return;
    const step = currentQuest.steps[stepId];
    if (!step.text.trim()) return;
    toggleStep(stepId);
  };

  const handleNewQuest = () => {
    setShowCelebration(false);
    setGoalInput("");
    setStepInputs(["", "", ""]);
    resetQuest();
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border-2 border-[#5CC7A0]"
      style={{ boxShadow: "0 4px 20px rgba(92,199,160,0.15)" }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4"
        style={{ background: "linear-gradient(135deg, #5CC7A0, #7DC4E8)" }}>
        <span className="text-2xl">🗺️</span>
        <h2 className="font-display text-lg font-extrabold text-white">Quête en 3 Micro-Pas</h2>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {!currentQuest ? (
            /* INPUT PHASE */
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <label className="block text-sm font-bold text-[#4A5568] mb-2">
                🎯 Quel est ton grand défi aujourd'hui ?
              </label>
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                placeholder="Ex : Ranger ma chambre, Faire mes devoirs…"
                maxLength={80}
                className={`w-full text-base font-semibold px-4 py-3 rounded-2xl border-2 outline-none
                  bg-[#F8F6F0] text-[#1E2A38] transition-all mb-4 ${
                  goalError ? "border-red-400" : "border-gray-100 focus:border-[#5CC7A0] focus:bg-white"
                }`}
              />
              <button onClick={handleStart} className="btn-primary btn-mint w-full justify-center text-base">
                <Sparkles size={16} /> Créer ma quête
              </button>
            </motion.div>
          ) : showCelebration ? (
            /* CELEBRATION */
            <motion.div
              key="celebration"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="text-center py-4"
            >
              <div className="text-4xl mb-2 tracking-widest">🎉🌟🎊⭐🏆</div>
              <h3 className="font-display text-2xl font-extrabold text-[#FF922B] mb-1">
                Bravo, Explorateur·rice !
              </h3>
              <p className="text-sm font-semibold text-[#9C6800] mb-5">
                Tu as terminé ta quête ! +5 étoiles gagnées ✨
              </p>
              <button onClick={handleNewQuest} className="btn-primary btn-mint mx-auto">
                <Map size={15} /> Nouvelle quête
              </button>
            </motion.div>
          ) : (
            /* STEPS PHASE */
            <motion.div
              key="steps"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              {/* Goal header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[10px] font-bold text-[#7A8BA0] uppercase tracking-wider">Mission</div>
                  <div className="font-display text-base font-extrabold text-[#1A5F7A]">
                    {currentQuest.goal}
                  </div>
                </div>
                <button
                  onClick={handleNewQuest}
                  className="flex items-center gap-1 text-xs font-bold text-[#7A8BA0] border
                    border-gray-200 rounded-xl px-3 py-1.5 hover:bg-gray-50 transition-all"
                >
                  <RefreshCw size={11} /> Changer
                </button>
              </div>

              {/* Steps */}
              <div className="flex flex-col gap-2.5 mb-3">
                {currentQuest.steps.map((step, i) => (
                  <StepItem
                    key={step.id}
                    index={i}
                    text={step.text}
                    done={step.done}
                    onChange={(v) => handleStepChange(i, v)}
                    onToggle={() => handleToggle(step.id)}
                  />
                ))}
              </div>

              <p className="text-xs text-center text-[#7A8BA0] font-semibold">
                Coche chaque pas une fois terminé ✅
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
