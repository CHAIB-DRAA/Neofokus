"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface AdviceCardProps {
  href: string;
  emoji: string;
  tag: string;
  tagStyle: string;
  title: string;
  preview: string;
  accentColor: string;
  index?: number;
}

export default function AdviceCard({
  href, emoji, tag, tagStyle, title, preview, accentColor, index = 0,
}: AdviceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
    >
      <Link href={href}>
        <div
          className="group bg-white rounded-2xl p-5 border-2 border-transparent
            hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          style={{
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = accentColor;
            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 6px 20px ${accentColor}30`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "transparent";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
          }}
        >
          <span
            className="inline-block text-[10px] font-extrabold uppercase tracking-wider
              px-2.5 py-1 rounded-full mb-3"
            style={tagStyle as any}
          >
            {tag}
          </span>
          <h3 className="font-display text-sm font-bold text-[#1E2A38] mb-2 leading-tight">
            {emoji} {title}
          </h3>
          <p className="text-xs text-[#7A8BA0] leading-relaxed">{preview}</p>
          <div className="mt-3 text-xs font-bold" style={{ color: accentColor }}>
            Lire →
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
