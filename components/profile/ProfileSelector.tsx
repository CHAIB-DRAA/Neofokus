"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfileStore, type Profile } from "@/lib/useProfileStore";
import { useQuestStore } from "@/lib/useQuestStore";
import { useRoutineStore } from "@/lib/useRoutineStore";
import { Trash2, Plus, ArrowLeft, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

const AVATARS = [
  "🦊","🐼","🦁","🐨","🐯","🦋",
  "🚀","⭐","🌈","🎮","🎨","🏆",
  "🐸","🦄","🐬","🐉","🦖","🤖",
];

const COLORS: Array<{ bg: string; border: string; name: string }> = [
  { bg: "#BFE3F5", border: "#7DC4E8", name: "Bleu"   },
  { bg: "#B8EDD9", border: "#5CC7A0", name: "Vert"   },
  { bg: "#E8E0F8", border: "#8E72DB", name: "Violet" },
  { bg: "#FFE0B2", border: "#FF922B", name: "Orange" },
  { bg: "#FDECEA", border: "#E05050", name: "Rouge"  },
  { bg: "#FFF9C4", border: "#FFD93D", name: "Jaune"  },
];

const AGE_VALUES = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

interface Props {
  onClose?: () => void;
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
  const nextId = useProfileStore.getState().currentProfileId;
  if (nextId) switchTo(nextId);
}

export default function ProfileSelector({ onClose }: Props) {
  const t = useTranslations("profile");
  const { profiles, currentProfileId, createProfile, updateProfile } = useProfileStore();

  type Mode = "list" | "create" | "edit-age";
  const [mode, setMode]         = useState<Mode>(profiles.length === 0 ? "create" : "list");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Create form state
  const [name, setName]         = useState("");
  const [avatar, setAvatar]     = useState(AVATARS[0]);
  const [colorIdx, setColorIdx] = useState(0);
  const [age, setAge]           = useState<number | null>(null);
  const [nameError, setNameError] = useState(false);
  const [ageError, setAgeError]   = useState(false);

  const selectedColor = COLORS[colorIdx];

  function handleCreate() {
    if (!name.trim()) { setNameError(true); setTimeout(() => setNameError(false), 1200); return; }
    if (age === null) { setAgeError(true); setTimeout(() => setAgeError(false), 1200); return; }
    const id = createProfile(name.trim(), avatar, selectedColor.bg, age);
    switchTo(id);
    onClose?.();
  }

  function handleSelect(p: Profile) {
    switchTo(p.id);
    onClose?.();
  }

  function openEditAge(profileId: string) {
    setEditingId(profileId);
    const p = profiles.find((x) => x.id === profileId);
    setAge(p?.age ?? null);
    setMode("edit-age");
  }

  function saveAge() {
    if (editingId && age !== null) {
      updateProfile(editingId, { age });
    }
    setMode("list");
    setEditingId(null);
  }

  function goCreate() {
    setName(""); setAvatar(AVATARS[0]); setColorIdx(0); setAge(null);
    setMode("create");
  }

  const editingProfile = profiles.find((p) => p.id === editingId);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(30,42,56,0.55)", backdropFilter: "blur(6px)" }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden max-h-[90vh] flex flex-col"
        style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.22)" }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center gap-3 flex-shrink-0">
          {(mode === "create" && profiles.length > 0) || mode === "edit-age" ? (
            <button onClick={() => setMode("list")} className="text-[#7A8BA0] hover:text-[#1E2A38] transition-colors">
              <ArrowLeft size={18} />
            </button>
          ) : null}
          <div className="flex-1">
            <div className="font-display text-xl font-extrabold text-[#1E2A38]">
              {mode === "list" ? t("whoPlays") :
               mode === "create" ? t("newProfile") :
               t("editAge", { name: editingProfile?.name ?? "" })}
            </div>
            {mode === "list" && (
              <div className="text-xs text-[#7A8BA0] font-semibold mt-0.5">
                {t("progressKept")}
              </div>
            )}
            {mode === "edit-age" && (
              <div className="text-xs text-[#7A8BA0] font-semibold mt-0.5">
                {t("ageAdapts")}
              </div>
            )}
          </div>
          {onClose && (
            <button onClick={onClose} className="text-[#B0B8C4] hover:text-[#7A8BA0] text-xl leading-none transition-colors">✕</button>
          )}
        </div>

        <div className="px-6 pb-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">

            {/* ── LISTE ── */}
            {mode === "list" && (
              <motion.div key="list" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
                <div className="space-y-2 mb-4">
                  {profiles.map((p) => (
                    <div key={p.id} className="flex items-center gap-2 group">
                      <button
                        onClick={() => handleSelect(p)}
                        className="flex-1 flex items-center gap-3 rounded-2xl px-4 py-3 border-2 transition-all"
                        style={{
                          background: p.id === currentProfileId ? p.color : "transparent",
                          borderColor: p.id === currentProfileId ? p.color : "#E2E8F0",
                        }}>
                        <span className="text-2xl">{p.avatar}</span>
                        <div className="flex-1 text-left">
                          <div className="font-display font-extrabold text-[#1E2A38] text-base leading-tight">
                            {p.name}
                          </div>
                          {p.age !== null && p.age !== undefined ? (
                            <div className="text-xs font-bold text-[#7A8BA0]">{p.age} {t("ageUnit")}</div>
                          ) : (
                            <div className="text-xs font-bold text-[#FF922B]">{t("noAge")}</div>
                          )}
                        </div>
                        {p.id === currentProfileId && (
                          <span className="text-[10px] font-extrabold text-[#5CC7A0] uppercase tracking-wider">{t("active")}</span>
                        )}
                      </button>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditAge(p.id)}
                          className="text-[#7A8BA0] hover:text-[#5B9CF6] p-2 transition-colors"
                          title="Modifier l'âge">
                          <Pencil size={14} />
                        </button>
                        {profiles.length > 1 && (
                          <button onClick={() => deleteProfile(p.id)} className="text-[#E05050] p-2">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={goCreate}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 border-2 border-dashed border-[#E2E8F0]
                    text-sm font-bold text-[#7A8BA0] hover:border-[#5B9CF6] hover:text-[#5B9CF6] transition-all">
                  <Plus size={15} /> {t("addProfile")}
                </button>
              </motion.div>
            )}

            {/* ── CRÉATION ── */}
            {mode === "create" && (
              <motion.div key="create" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                {/* Preview */}
                <div className="flex justify-center mb-5">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl border-2"
                    style={{ background: selectedColor.bg, borderColor: selectedColor.border }}>
                    {avatar}
                  </div>
                </div>

                {/* Name */}
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder={t("namePlaceholder")} maxLength={20} autoFocus
                  className={`w-full text-base font-bold px-4 py-3 rounded-2xl border-2 outline-none mb-4
                    bg-[#F8F6F0] text-[#1E2A38] transition-all ${
                    nameError ? "border-[#E05050]" : "border-[#E2E8F0] focus:border-[#5B9CF6] focus:bg-white"
                  }`}
                />

                {/* Avatar */}
                <div className="mb-4">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A8BA0] mb-2">{t("avatarLabel")}</div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {AVATARS.map((a) => (
                      <button key={a} onClick={() => setAvatar(a)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border-2 transition-all"
                        style={{
                          borderColor: avatar === a ? selectedColor.border : "transparent",
                          background: avatar === a ? selectedColor.bg : "#F8F6F0",
                        }}>{a}</button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div className="mb-4">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A8BA0] mb-2">{t("colorLabel")}</div>
                  <div className="flex gap-2">
                    {COLORS.map((c, i) => (
                      <button key={c.name} onClick={() => setColorIdx(i)}
                        className="w-8 h-8 rounded-full border-2 transition-all"
                        style={{
                          background: c.bg, borderColor: colorIdx === i ? c.border : "transparent",
                          transform: colorIdx === i ? "scale(1.2)" : "scale(1)",
                        }} />
                    ))}
                  </div>
                </div>

                {/* Age — required */}
                <div className="mb-5">
                  <div className={`text-[10px] font-extrabold uppercase tracking-wider mb-2 ${ageError ? "text-[#E05050]" : "text-[#7A8BA0]"}`}>
                    {t("ageLabel")} {ageError && t("ageError")}
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {AGE_VALUES.map((v) => (
                      <button key={v} onClick={() => setAge(v)}
                        className="py-2 rounded-xl text-xs font-extrabold border-2 transition-all"
                        style={{
                          background: age === v ? "#5B9CF6" : "#F8F6F0",
                          borderColor: age === v ? "#5B9CF6" : ageError ? "#E05050" : "#E2E8F0",
                          color: age === v ? "white" : "#1E2A38",
                        }}>
                        {v} {t("ageUnit")}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-[#7A8BA0] font-semibold mt-2">
                    {t("ageHint")}
                  </p>
                </div>

                <button onClick={handleCreate}
                  className="w-full py-3.5 rounded-2xl font-display font-extrabold text-white text-base"
                  style={{ background: "linear-gradient(135deg, #5B9CF6, #8E72DB)" }}>
                  {t("createBtn")}
                </button>
              </motion.div>
            )}

            {/* ── ÉDITION ÂGE ── */}
            {mode === "edit-age" && editingProfile && (
              <motion.div key="edit-age" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                <div className="flex justify-center mb-5">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl border-2"
                    style={{ background: editingProfile.color, borderColor: "#E2E8F0" }}>
                    {editingProfile.avatar}
                  </div>
                </div>
                <div className="text-center font-display text-lg font-extrabold text-[#1E2A38] mb-1">
                  {editingProfile.name}
                </div>
                <div className="text-center text-xs text-[#7A8BA0] font-semibold mb-4">
                  {t("whatAge", { name: editingProfile.name })}
                </div>

                <div className="grid grid-cols-4 gap-1.5 mb-5">
                  {AGE_VALUES.map((v) => (
                    <button key={v} onClick={() => setAge(v)}
                      className="py-2.5 rounded-xl text-xs font-extrabold border-2 transition-all"
                      style={{
                        background: age === v ? "#5B9CF6" : "#F8F6F0",
                        borderColor: age === v ? "#5B9CF6" : "#E2E8F0",
                        color: age === v ? "white" : "#1E2A38",
                      }}>
                      {v} {t("ageUnit")}
                    </button>
                  ))}
                </div>

                <button onClick={saveAge} disabled={age === null}
                  className="w-full py-3.5 rounded-2xl font-display font-extrabold text-white text-base transition-all"
                  style={{
                    background: age !== null ? "linear-gradient(135deg, #5B9CF6, #8E72DB)" : "#E2E8F0",
                    color: age !== null ? "white" : "#B0B8C4",
                  }}>
                  {t("saveAge")}
                </button>

                <p className="text-[10px] text-[#7A8BA0] font-semibold mt-2 text-center">
                  {t("saveAgeHint")}
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
