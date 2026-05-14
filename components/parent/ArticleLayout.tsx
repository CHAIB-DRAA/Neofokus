"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ArticleLayoutProps {
  emoji: string;
  tag: string;
  tagStyle: React.CSSProperties;
  title: string;
  children: ReactNode;
}

export default function ArticleLayout({ emoji, tag, tagStyle, title, children }: ArticleLayoutProps) {
  return (
    <div>
      <Link href="/parents" className="inline-flex items-center gap-2 text-sm font-bold
        text-[#7A8BA0] hover:text-[#3D1F8A] mb-4 transition-colors">
        <ArrowLeft size={14} /> Retour au QG
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
      >
        <div className="p-6">
          <div className="text-4xl mb-3">{emoji}</div>
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider
            px-2.5 py-1 rounded-full mb-3" style={tagStyle}>
            {tag}
          </span>
          <h1 className="font-display text-2xl font-extrabold text-[#1E2A38] mb-5">{title}</h1>
          <div className="prose-custom text-sm text-[#4A5568] leading-relaxed space-y-4">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
