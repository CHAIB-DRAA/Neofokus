"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import QuestPanel from "@/components/quest/QuestPanel";

export default function QuetePage() {
  return (
    <div>
      <Link href="/explorateur" className="inline-flex items-center gap-2 text-sm font-bold
        text-[#7A8BA0] hover:text-[#1A5F7A] mb-4 transition-colors">
        <ArrowLeft size={14} /> Retour
      </Link>
      <h1 className="font-display text-2xl font-extrabold text-[#1E2A38] mb-5">
        🗺️ Ma Quête en 3 Micro-Pas
      </h1>
      <QuestPanel />
    </div>
  );
}
