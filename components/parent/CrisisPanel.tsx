"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    num: 1,
    title: "Pause & présence",
    desc: "Mettez-vous à sa hauteur. Voix basse, posture ouverte. Dites : \"Je suis là. Tu es en sécurité.\"",
  },
  {
    num: 2,
    title: "Ancrage sensoriel",
    desc: "Proposez 3 respirations lentes ensemble. Ou : \"Nomme 3 choses que tu vois.\" Cela active le cortex préfrontal.",
  },
  {
    num: 3,
    title: "Micro-accord",
    desc: "Une seule demande simple et concrète. Pas de négociation complexe dans l'urgence. \"Viens t'asseoir 2 minutes.\"",
  },
];

export default function CrisisPanel() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border-2 border-[#8E72DB]"
      style={{ boxShadow: "0 4px 20px rgba(142,114,219,0.12)" }}>
      <div className="flex items-center gap-3 px-5 py-4"
        style={{ background: "linear-gradient(135deg, #8E72DB, #5B8EDB)" }}>
        <span className="text-2xl">🌊</span>
        <h2 className="font-display text-lg font-extrabold text-white">Quand ça déborde…</h2>
      </div>
      <div className="p-5 flex flex-col gap-4">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex gap-3 items-start ${i < STEPS.length - 1 ? "pb-4 border-b border-gray-100" : ""}`}
          >
            <div className="w-8 h-8 rounded-full bg-[#E8E0F8] text-[#3D1F8A] font-display
              text-sm font-extrabold flex items-center justify-center flex-shrink-0">
              {step.num}
            </div>
            <div>
              <div className="text-sm font-bold text-[#1E2A38] mb-1">{step.title}</div>
              <div className="text-xs text-[#4A5568] leading-relaxed">{step.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
