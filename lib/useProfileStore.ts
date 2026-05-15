import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  color: string;
  age: number | null; // age in years, set by parent
  createdAt: string;
}

interface ProfileStore {
  profiles: Profile[];
  currentProfileId: string | null;
  createProfile: (name: string, avatar: string, color: string, age: number | null) => string;
  updateProfile: (id: string, updates: Partial<Pick<Profile, "age" | "name" | "avatar" | "color">>) => void;
  deleteProfile: (id: string) => void;
  setCurrentProfile: (id: string | null) => void;
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profiles: [],
      currentProfileId: null,

      createProfile: (name, avatar, color, age) => {
        const id = genId();
        const profile: Profile = {
          id,
          name,
          avatar,
          color,
          age,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          profiles: [...s.profiles, profile],
          currentProfileId: s.currentProfileId ?? id,
        }));
        return id;
      },

      updateProfile: (id, updates) => {
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      deleteProfile: (id) => {
        const { profiles, currentProfileId } = get();
        const remaining = profiles.filter((p) => p.id !== id);
        set({
          profiles: remaining,
          currentProfileId:
            currentProfileId === id ? (remaining[0]?.id ?? null) : currentProfileId,
        });
      },

      setCurrentProfile: (id) => set({ currentProfileId: id }),
    }),
    { name: "neofokus-profiles" }
  )
);
