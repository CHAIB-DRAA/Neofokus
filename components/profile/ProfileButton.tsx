"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useProfileStore } from "@/lib/useProfileStore";
import ProfileSelector from "./ProfileSelector";

export default function ProfileButton() {
  const [open, setOpen] = useState(false);
  const { profiles, currentProfileId } = useProfileStore();
  const current = profiles.find((p) => p.id === currentProfileId);

  if (!current) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full px-3 py-1.5 border-2 transition-all hover:shadow-sm"
        style={{ background: current.color, borderColor: current.color }}
      >
        <span className="text-lg leading-none">{current.avatar}</span>
        <span className="font-display font-extrabold text-[#1E2A38] text-sm max-w-[80px] truncate">
          {current.name}
        </span>
        <span className="text-[#7A8BA0] text-xs">▾</span>
      </button>

      <AnimatePresence>
        {open && <ProfileSelector onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
