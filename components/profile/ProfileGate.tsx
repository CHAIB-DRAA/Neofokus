"use client";

import { useEffect, useState } from "react";
import { useProfileStore } from "@/lib/useProfileStore";
import { useQuestStore } from "@/lib/useQuestStore";
import { useRoutineStore } from "@/lib/useRoutineStore";
import ProfileSelector from "./ProfileSelector";

export default function ProfileGate({ children }: { children: React.ReactNode }) {
  const currentProfileId = useProfileStore((s) => s.currentProfileId);
  const [hydrated, setHydrated] = useState(false);

  // Attendre l'hydratation localStorage avant de décider quoi afficher
  useEffect(() => {
    setHydrated(true);
    // Sync stores au profil courant au démarrage
    if (currentProfileId) {
      useQuestStore.getState().loadProfile(currentProfileId);
      useRoutineStore.getState().loadProfile(currentProfileId);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-4 border-[#5B9CF6] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Pas encore de profil → forcer la création
  if (!currentProfileId) {
    return <ProfileSelector />;
  }

  return <>{children}</>;
}
