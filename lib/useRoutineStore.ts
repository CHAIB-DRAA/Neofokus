import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useProfileStore } from "./useProfileStore";

export interface RoutineItem {
  id: string;
  time: string;
  task: string;
  emoji: string;
}

interface RoutineStore {
  items: RoutineItem[];
  data: Record<string, RoutineItem[]>;
  loadProfile: (profileId: string) => void;
  clearProfileData: (profileId: string) => void;
  addItem: () => void;
  updateItem: (id: string, field: keyof RoutineItem, value: string) => void;
  removeItem: (id: string) => void;
  resetToDefaults: () => void;
}

const DEFAULTS: RoutineItem[] = [
  { id: "1", time: "07:00", task: "Se lever et s'étirer",  emoji: "🌅" },
  { id: "2", time: "07:10", task: "Se laver / s'habiller", emoji: "🚿" },
  { id: "3", time: "07:25", task: "Petit déjeuner calme",  emoji: "🥣" },
  { id: "4", time: "07:45", task: "Préparer le cartable",  emoji: "🎒" },
  { id: "5", time: "08:00", task: "Partir à l'école",      emoji: "🏫" },
];

const EMOJIS = ["🎵", "📖", "🌿", "🧸", "🖍️", "🏃", "🎨", "💧", "🌟", "🍎", "🎯", "🌈"];

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set, get) => {
      function updateItems(items: RoutineItem[]) {
        const profileId = useProfileStore.getState().currentProfileId;
        const { data } = get();
        set({
          items,
          data: profileId ? { ...data, [profileId]: items } : data,
        });
      }

      return {
        items: DEFAULTS,
        data: {},

        loadProfile: (profileId) => {
          const { data } = get();
          set({ items: data[profileId] ?? DEFAULTS });
        },

        clearProfileData: (profileId) => {
          const { data } = get();
          const next = { ...data };
          delete next[profileId];
          set({ data: next });
        },

        addItem: () => {
          const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
          const newItem: RoutineItem = { id: Date.now().toString(), time: "00:00", task: "", emoji };
          updateItems([...get().items, newItem]);
        },

        updateItem: (id, field, value) => {
          updateItems(get().items.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
          ));
        },

        removeItem: (id) => {
          updateItems(get().items.filter((item) => item.id !== id));
        },

        resetToDefaults: () => updateItems(DEFAULTS),
      };
    },
    { name: "neofokus-routine-v2" }
  )
);
