import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useProfileStore } from "./useProfileStore";

export interface QuestStep {
  id: number;
  text: string;
  done: boolean;
}

export interface Quest {
  goal: string;
  steps: QuestStep[];
  completed: boolean;
  createdAt: string;
}

export interface ProfileQuestData {
  stars: number;
  badges: string[];
  weekKey: string;
  currentQuest: Quest | null;
  questHistory: Quest[];
}

function getWeekKey(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.getFullYear(), d.getMonth(), diff);
  return monday.toISOString().slice(0, 10);
}

function defaultData(): ProfileQuestData {
  return {
    stars: 0,
    badges: [],
    weekKey: getWeekKey(),
    currentQuest: null,
    questHistory: [],
  };
}

const BADGE_THRESHOLDS: Array<{ min: number; badge: string }> = [
  { min: 3,  badge: "⭐ Premier pas" },
  { min: 10, badge: "🎯 Focalisé" },
  { min: 25, badge: "✅ Persévérant" },
  { min: 50, badge: "🏆 Maître Quêteur" },
  { min: 80, badge: "🌟 Super Champion" },
];

interface QuestStore {
  // Flat properties — toujours === données du profil courant
  stars: number;
  badges: string[];
  weekKey: string;
  currentQuest: Quest | null;
  questHistory: Quest[];
  // Données de tous les profils
  data: Record<string, ProfileQuestData>;

  loadProfile: (profileId: string) => void;
  clearProfileData: (profileId: string) => void;
  addStars: (n: number) => void;
  checkWeekReset: () => void;
  setCurrentQuest: (goal: string, steps: string[]) => void;
  toggleStep: (stepId: number) => void;
  completeQuest: () => void;
  resetQuest: () => void;
}

export const useQuestStore = create<QuestStore>()(
  persist(
    (set, get) => {
      // Helper : met à jour les props plates ET data[profileId] en un seul set
      function update(partial: Partial<ProfileQuestData>) {
        const profileId = useProfileStore.getState().currentProfileId;
        const { data } = get();
        const current = data[profileId ?? ""] ?? defaultData();
        const updated = { ...current, ...partial };
        set({
          ...partial,
          data: profileId ? { ...data, [profileId]: updated } : data,
        });
      }

      return {
        stars: 0,
        badges: [],
        weekKey: getWeekKey(),
        currentQuest: null,
        questHistory: [],
        data: {},

        loadProfile: (profileId) => {
          const { data } = get();
          const raw = data[profileId] ?? defaultData();
          const currentWeek = getWeekKey();
          const pd =
            raw.weekKey !== currentWeek
              ? { ...raw, stars: 0, badges: [], weekKey: currentWeek }
              : raw;
          set({
            stars: pd.stars,
            badges: pd.badges,
            weekKey: pd.weekKey,
            currentQuest: pd.currentQuest,
            questHistory: pd.questHistory,
            data: { ...data, [profileId]: pd },
          });
        },

        clearProfileData: (profileId) => {
          const { data } = get();
          const next = { ...data };
          delete next[profileId];
          set({ data: next });
        },

        checkWeekReset: () => {
          const currentWeek = getWeekKey();
          if (get().weekKey !== currentWeek) {
            update({ stars: 0, badges: [], weekKey: currentWeek });
          }
        },

        addStars: (n) => {
          const { stars, badges, weekKey } = get();
          const currentWeek = getWeekKey();
          const baseStars  = weekKey !== currentWeek ? 0 : stars;
          const baseBadges = weekKey !== currentWeek ? [] : badges;
          const newStars   = baseStars + n;
          const earned = BADGE_THRESHOLDS
            .filter(({ min }) => newStars >= min)
            .map(({ badge }) => badge)
            .filter((b) => !baseBadges.includes(b));
          update({ stars: newStars, badges: [...baseBadges, ...earned], weekKey: currentWeek });
        },

        setCurrentQuest: (goal, stepTexts) => {
          const steps: QuestStep[] = stepTexts.map((text, i) => ({ id: i, text, done: false }));
          update({ currentQuest: { goal, steps, completed: false, createdAt: new Date().toISOString() } });
        },

        toggleStep: (stepId) => {
          const { currentQuest } = get();
          if (!currentQuest) return;
          const steps = currentQuest.steps.map((s) =>
            s.id === stepId ? { ...s, done: !s.done } : s
          );
          update({ currentQuest: { ...currentQuest, steps } });
        },

        completeQuest: () => {
          const { currentQuest, questHistory } = get();
          if (!currentQuest) return;
          const completed = { ...currentQuest, completed: true };
          update({
            currentQuest: completed,
            questHistory: [completed, ...questHistory].slice(0, 20),
          });
          get().addStars(5);
        },

        resetQuest: () => update({ currentQuest: null }),
      };
    },
    { name: "neofokus-quest-v2" }
  )
);
