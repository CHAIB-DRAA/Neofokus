"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfileStore, type Profile } from "@/lib/useProfileStore";
import { useQuestStore } from "@/lib/useQuestStore";
import { useRoutineStore } from "@/lib/useRoutineStore";
import { Trash2, Plus, ArrowLeft } from "lucide-react";

const AVATARS = [
  "🦊","🐼","🦁","🐨","🐯","🦋",
  "🚀","⭐","🌈","🎮","🎨","🏆",
  "🐸","🦄","🐬","🐉","🦖","🤖",
];

const COLORS: Array<{ bg: string; border: string; text: string; name: string }> = [
  { bg: "#BFE3F5", border: "#7DC4E8", text: "#1A5F7A", name: "Bleu"    },
  { bg: "#B8EDD9", border: "#5CC7A0", text: "#0F5C3A", name: "Vert"    },
  { bg: "#E8E0F8", border: "#8E72DB", text: "#3D1F8A", name: "Violet"  },
  { bg: "#FFE0B2", border: "#FF922B", text: "#9C4400", name: "Orange"  },
  { bg: "#FDECEA", border: "#E05050", text: "#7A1F1F", name: "Rouge"   },
  { bg: "#FFF9C4", border: "#FFD93D", text: "#9C6800", name: "Jaune"   },
];

interface Props {
  onClose?: () => void; // si undefined → mode "gate" (pas de croix)
}

function switchTo(profileId: string) {
  useProfileStore.getState().setCurrentProfile(profileId);
  useQuestStore.getState().loadProfile(profileId);
  useRoutineStore.getState().loadProfile(profileId);
}

function deleteProfile(profileId: string) {
  useProfileStore.getState().deleteProfile(profileId);
  useQuestStore.getState().clearProfileData(profileId);
  useRoutineStore.getState().clearProfileData(profileId);
  // loadProfile is called automatically by ProfileGate via re-render
  const nextId = useProfileStore.getState().currentProfileId;
  if (nextId) switchTo(nextId);
}

export default function ProfileSelector({ onClose }: Props) {
  const { profiles, currentProfileId, createProfile } = useProfileStore();
  const [mode, setMode] = useState<"list" | "create">(
    profiles.length === 0 ? "create" : "list"
  );
  const [name, setName]         = useState("");
  const [avatar, setAvatar]     = useState(AVATARS[0]);
  const [colorIdx, setColorIdx] = useState(0);
  const [nameError, setNameError] = useState(false);

  const selectedColor = COLORS[colorIdx];

  function handleCreate() {
    if (!name.trim()) {
      setNameError(true);
      setTimeout(() => setNameError(false), 1200);
      return;
    }
    const id = createProfile(name.trim(), avatar, selectedColor.bg);
    switchTo(id);
    onClose?.();
  }

  function handleSelect(p: Profile) {
    switchTo(p.id);
    onClose?.();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(30,42,56,0.55)", backdropFilter: "blur(6px)" }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden"
        style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.22)" }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center gap-3">
          {mode === "create" && profiles.length > 0 && (
            <button onClick={() => setMode("list")}
              className="text-[#7A8BA0] hover:text-[#1E2A38] transition-colors">
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="flex-1">
            <div className="font-display text-xl font-extrabold text-[#1E2A38]">
              {mode === "list" ? "Qui joue aujourd'hui ? 👋" : "Nouveau profil"}
            </div>
            {mode === "list" && (
              <div className="text-xs text-[#7A8BA0] font-semibold mt-0.5">
                Chaque profil garde sa progression
              </div>
            )}
          </div>
          {onClose && (
            <button onClick={onClose}
              className="text-[#B0B8C4] hover:text-[#7A8BA0] text-xl leading-none transition-colors">
              ✕
            </button>
          )}
        </div>

        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">

            {/* ── LISTE ── */}
            {mode === "list" && (
              <motion.div key="list"
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}>
                <div className="space-y-2 mb-4">
                  {profiles.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 group">
                      <button
                        onClick={() => handleSelect(p)}
                        className="flex-1 flex items-center gap-3 rounded-2xl px-4 py-3 border-2 transition-all"
                        style={{
                          background: p.id === currentProfileId ? p.color : "transparent",
                          borderColor: p.id === currentProfileId ? p.color : "#E2E8F0",
                        }}
                      >
                        <span className="text-2xl">{p.avatar}</span>
                        <span className="font-display font-extrabold text-[#1E2A38] text-base">
                          {p.name}
                        </span>
                        {p.id === currentProfileId && (
                          <span className="ml-auto text-[10px] font-extrabold text-[#5CC7A0] uppercase tracking-wider">
                            Actif
                          </span>
                        )}
                      </button>
                      {profiles.length > 1 && (
                        <button
                          onClick={() => deleteProfile(p.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#E05050] p-2"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { setName(""); setAvatar(AVATARS[0]); setColorIdx(0); setMode("create"); }}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 border-2 border-dashed border-[#E2E8F0]
                    text-sm font-bold text-[#7A8BA0] hover:border-[#5B9CF6] hover:text-[#5B9CF6] transition-all"
                >
                  <Plus size={15} /> Ajouter un profil
                </button>
              </motion.div>
            )}

            {/* ── CRÉATION ── */}
            {mode === "create" && (
              <motion.div key="create"
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}>

                {/* Preview */}
                <div className="flex justify-center mb-5">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl border-2"
                    style={{ background: selectedColor.bg, borderColor: selectedColor.border }}>
                    {avatar}
                  </div>
                </div>

                {/* Name */}
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="Prénom de l'enfant…"
                  maxLength={20}
                  autoFocus
                  className={`w-full text-base font-bold px-4 py-3 rounded-2xl border-2 outline-none mb-4
                    bg-[#F8F6F0] text-[#1E2A38] transition-all ${
                    nameError ? "border-[#E05050]" : "border-[#E2E8F0] focus:border-[#5B9CF6] focus:bg-white"
                  }`}
                />

                {/* Avatar picker */}
                <div className="mb-4">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A8BA0] mb-2">
                    Avatar
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {AVATARS.map((a) => (
                      <button key={a} onClick={() => setAvatar(a)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border-2 transition-all"
                        style={{
                          borderColor: avatar === a ? selectedColor.border : "transparent",
                          background: avatar === a ? selectedColor.bg : "#F8F6F0",
                        }}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color picker */}
                <div className="mb-5">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A8BA0] mb-2">
                    Couleur
                  </div>
                  <div className="flex gap-2">
                    {COLORS.map((c, i) => (
                      <button key={c.name} onClick={() => setColorIdx(i)}
                        className="w-8 h-8 rounded-full border-2 transition-all"
                        style={{
                          background: c.bg,
                          borderColor: colorIdx === i ? c.border : "transparent",
                          transform: colorIdx === i ? "scale(1.2)" : "scale(1)",
                        }} />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCreate}
                  className="w-full py-3.5 rounded-2xl font-display font-extrabold text-white text-base"
                  style={{ background: "linear-gradient(135deg, #5B9CF6, #8E72DB)" }}
                >
                  Créer le profil ✨
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
