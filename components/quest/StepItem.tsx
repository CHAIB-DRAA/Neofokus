"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepItemProps {
  index: number;
  text: string;
  done: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}

export default function StepItem({ index, text, done, onChange, onToggle }: StepItemProps) {
  const labels = ["Micro-pas 1", "Micro-pas 2", "Micro-pas 3"];
  const placeholders = [
    "Première petite action…",
    "Deuxième petite action…",
    "Dernière petite action…",
  ];

  return (
    <motion.div
      layout
      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-250 ${
        done
          ? "bg-[#EDFBF4] border-[#5CC7A0]"
          : "bg-[#F8F6F0] border-gray-100"
      }`}
    >
      {/* Step number */}
      <div className="w-6 h-6 rounded-full bg-[#BFE3F5] text-[#1A5F7A] text-xs font-extrabold
        flex items-center justify-center flex-shrink-0">
        {index + 1}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold text-[#7A8BA0] uppercase tracking-wider mb-0.5">
          {labels[index]}
        </div>
        <input
          type="text"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholders[index]}
          disabled={done}
          className={`w-full bg-transparent text-sm font-semibold text-[#1E2A38] outline-none
            placeholder-gray-300 ${done ? "line-through text-[#7A8BA0]" : ""}`}
        />
      </div>

      {/* Checkmark */}
      <button
        onClick={onToggle}
        aria-label={`Valider le micro-pas ${index + 1}`}
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0
          transition-all duration-200 cursor-pointer ${
          done
            ? "bg-[#5CC7A0] border-[#5CC7A0]"
            : "bg-white border-[#5CC7A0] hover:bg-[#B8EDD9]"
        }`}
      >
        {done && <Check size={14} className="text-white" strokeWidth={3} />}
      </button>
    </motion.div>
  );
}
