"use client";

import "./globals.css";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileGate from "@/components/profile/ProfileGate";
import ProfileButton from "@/components/profile/ProfileButton";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isParent = pathname?.startsWith("/parents");

  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#F8F6F0]">
        {/* TOP NAV */}
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 h-16 flex items-center justify-between px-4 md:px-8"
          style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <span className="font-display text-xl font-extrabold text-[#1A5F7A]">
              Néo<span className="text-[#5CC7A0]">Fokus</span>
            </span>
          </Link>

          {/* MODE TOGGLE */}
          <div className="flex items-center gap-1 bg-[#F8F6F0] border border-gray-200 rounded-full p-1">
            <Link href="/explorateur">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  !isParent ? "text-white shadow-md" : "text-gray-500 bg-transparent"
                }`}
                style={!isParent ? {
                  background: "linear-gradient(135deg, #7DC4E8, #5CC7A0)",
                  boxShadow: "0 2px 10px rgba(92,199,160,0.35)",
                } : {}}
              >
                <Rocket size={15} /> Explorateur
              </button>
            </Link>
            <Link href="/parents">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  isParent ? "text-white shadow-md" : "text-gray-500 bg-transparent"
                }`}
                style={isParent ? {
                  background: "linear-gradient(135deg, #8E72DB, #5B8EDB)",
                  boxShadow: "0 2px 10px rgba(142,114,219,0.35)",
                } : {}}
              >
                <Home size={15} /> Parents
              </button>
            </Link>
          </div>

          {/* PROFIL */}
          <ProfileButton />
        </nav>

        <main className="max-w-2xl mx-auto px-4 py-6">
          <ProfileGate>
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </ProfileGate>
        </main>
      </body>
    </html>
  );
}
