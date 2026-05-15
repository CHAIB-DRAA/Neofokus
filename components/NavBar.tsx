"use client";

import { useState } from "react";
import { Rocket, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/navigation";
import ProfileButton from "@/components/profile/ProfileButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { AnimatePresence, motion } from "framer-motion";

export default function NavBar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isParent = pathname?.startsWith("/parents");

  return (
    <nav
      className="bg-white border-b border-gray-100 sticky top-0 z-50 h-16 flex items-center justify-between px-4 md:px-8"
      style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
    >
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
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-all duration-200 ${
              !isParent ? "text-white shadow-md" : "text-gray-500 bg-transparent"
            }`}
            style={
              !isParent
                ? { background: "linear-gradient(135deg, #7DC4E8, #5CC7A0)", boxShadow: "0 2px 10px rgba(92,199,160,0.35)" }
                : {}
            }
          >
            <Rocket size={14} />
            <span className="hidden sm:inline">{t("explorer")}</span>
          </button>
        </Link>
        <Link href="/parents">
          <button
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-all duration-200 ${
              isParent ? "text-white shadow-md" : "text-gray-500 bg-transparent"
            }`}
            style={
              isParent
                ? { background: "linear-gradient(135deg, #8E72DB, #5B8EDB)", boxShadow: "0 2px 10px rgba(142,114,219,0.35)" }
                : {}
            }
          >
            <Home size={14} />
            <span className="hidden sm:inline">{t("parents")}</span>
          </button>
        </Link>
      </div>

      {/* RIGHT: lang switcher + profile */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ProfileButton />
      </div>
    </nav>
  );
}
