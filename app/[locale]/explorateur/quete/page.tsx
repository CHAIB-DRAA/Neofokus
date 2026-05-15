"use client";

import { Link } from "@/lib/navigation";
import { ArrowLeft } from "lucide-react";
import QuestPanel from "@/components/quest/QuestPanel";
import { useTranslations } from "next-intl";

export default function QuetePage() {
  const tg = useTranslations("game");
  const tq = useTranslations("quest");
  return (
    <div>
      <Link href="/explorateur" className="inline-flex items-center gap-2 text-sm font-bold
        text-[#7A8BA0] hover:text-[#1A5F7A] mb-4 transition-colors">
        <ArrowLeft size={14} /> {tg("back_short")}
      </Link>
      <h1 className="font-display text-2xl font-extrabold text-[#1E2A38] mb-5">
        🗺️ {tq("title")}
      </h1>
      <QuestPanel />
    </div>
  );
}
