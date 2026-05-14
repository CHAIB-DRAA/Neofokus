"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket, Home, Star, Heart } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-7xl mb-4">🧠</div>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-[#1E2A38] mb-3">
          Bienvenue sur{" "}
          <span className="text-[#1A5F7A]">Néo</span>
          <span className="text-[#5CC7A0]">Fokus</span>
        </h1>
        <p className="text-[#4A5568] text-lg font-medium max-w-md mx-auto mb-10 leading-relaxed">
          Une plateforme bienveillante pour les enfants avec TDAH et leurs parents. 
          Ensemble, on avance, un petit pas à la fois.
        </p>
      </motion.div>

      {/* Two entry cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <Link href="/explorateur">
          <div className="group cursor-pointer bg-white rounded-3xl p-7 border-2 border-transparent
            hover:border-[#5CC7A0] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg text-left"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
              style={{ background: "linear-gradient(135deg, #BFE3F5, #B8EDD9)" }}>
              🚀
            </div>
            <h2 className="font-display text-xl font-bold text-[#1E2A38] mb-2">L'Espace Explorateur</h2>
            <p className="text-sm text-[#7A8BA0] leading-relaxed">
              Pour les enfants. Des jeux, des quêtes et des étoiles pour avancer chaque jour !
            </p>
            <div className="mt-4 flex items-center gap-1 text-[#5CC7A0] text-sm font-bold">
              <Rocket size={14} /> Entrer dans l'espace →
            </div>
          </div>
        </Link>

        <Link href="/parents">
          <div className="group cursor-pointer bg-white rounded-3xl p-7 border-2 border-transparent
            hover:border-[#8E72DB] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg text-left"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
              style={{ background: "linear-gradient(135deg, #E8E0F8, #E0EDFF)" }}>
              🏠
            </div>
            <h2 className="font-display text-xl font-bold text-[#1E2A38] mb-2">Le QG des Parents</h2>
            <p className="text-sm text-[#7A8BA0] leading-relaxed">
              Pour les parents. Outils, conseils et stratégies pour accompagner avec sérénité.
            </p>
            <div className="mt-4 flex items-center gap-1 text-[#8E72DB] text-sm font-bold">
              <Home size={14} /> Accéder au QG →
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Reassurance footer */}
      <motion.div
        className="mt-10 flex flex-wrap justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {[
          { icon: <Star size={13} />, text: "Zéro pub, zéro distraction" },
          { icon: <Heart size={13} />, text: "Conçu par des spécialistes TDAH" },
          { icon: <Rocket size={13} />, text: "Approche neuroscientifique" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-xs
            font-semibold text-[#4A5568] border border-gray-100">
            <span className="text-[#5CC7A0]">{item.icon}</span>
            {item.text}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
