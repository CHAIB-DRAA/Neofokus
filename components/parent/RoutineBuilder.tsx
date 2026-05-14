"use client";

import { Trash2, Plus, Printer } from "lucide-react";
import { useRoutineStore } from "@/lib/useRoutineStore";

const EMOJI_OPTIONS = ["🌅","🚿","🥣","🎒","🏫","🎵","📖","🌿","🧸","🖍️","🏃","🎨","💧","🌟","🍎","🎯","🌈","😴","🦷","👕"];

const ROW_COLORS = ["#BFE3F5","#B8EDD9","#FFF3CD","#E8E0F8","#FFE0B2","#FDECEA","#C8F7D4","#DBEAFE"];

export default function RoutineBuilder() {
  const { items, addItem, updateItem, removeItem } = useRoutineStore();

  const handlePrint = () => window.print();

  return (
    <>
      {/* ── Feuille d'impression (invisible à l'écran, visible à l'impression) ── */}
      <div id="routine-print-sheet">
        {/* En-tête */}
        <div style={{
          textAlign: "center",
          marginBottom: 28,
          paddingBottom: 16,
          borderBottom: "3px dashed #FFD93D",
        }}>
          <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 8 }}>🌅</div>
          <div style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: 32,
            fontWeight: 900,
            color: "#1E2A38",
            letterSpacing: "-0.5px",
          }}>
            Ma Routine du Matin
          </div>
          <div style={{
            fontSize: 15,
            color: "#7A8BA0",
            marginTop: 6,
            fontWeight: 700,
          }}>
            Coche chaque étape quand tu l&apos;as faite ! 🖊️
          </div>
        </div>

        {/* Tâches */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item, i) => (
            <div key={item.id} style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 16px",
              borderRadius: 18,
              background: ROW_COLORS[i % ROW_COLORS.length],
              border: "2px solid rgba(0,0,0,0.06)",
              pageBreakInside: "avoid",
            }}>
              {/* Grande case à cocher */}
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                border: "3px solid rgba(0,0,0,0.25)",
                background: "white",
                flexShrink: 0,
              }} />

              {/* Emoji */}
              <div style={{ fontSize: 36, lineHeight: 1, flexShrink: 0, width: 44, textAlign: "center" }}>
                {item.emoji}
              </div>

              {/* Contenu */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#1E2A38",
                  lineHeight: 1.2,
                }}>
                  {item.task || "—"}
                </div>
              </div>

              {/* Heure */}
              {item.time && (
                <div style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontSize: 18,
                  fontWeight: 900,
                  color: "rgba(0,0,0,0.35)",
                  flexShrink: 0,
                  minWidth: 52,
                  textAlign: "right",
                }}>
                  {item.time}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pied de page */}
        <div style={{
          marginTop: 32,
          paddingTop: 18,
          borderTop: "3px dashed #5CC7A0",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>🌟⭐🏆</div>
          <div style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: 22,
            fontWeight: 900,
            color: "#5CC7A0",
          }}>
            Bravo ! Tu as tout fait !
          </div>
          <div style={{ fontSize: 13, color: "#A0AEC0", marginTop: 4, fontWeight: 600 }}>
            neofokus
          </div>
        </div>
      </div>

      {/* ── Éditeur (visible à l'écran uniquement) ── */}
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
          style={{ background: "linear-gradient(135deg, #FFF3E0, #FFE0B2)" }}>
          <div className="font-display text-base font-extrabold text-[#7A4200] flex items-center gap-2">
            🗓️ Routine du matin
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-bold text-[#7A4200] border
              border-[#FF922B]/30 bg-white/60 rounded-xl px-3 py-1.5 hover:bg-white transition-all"
          >
            <Printer size={13} /> Imprimer pour l&apos;enfant
          </button>
        </div>

        {/* Items */}
        <div className="p-4 flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <select
                value={item.emoji}
                onChange={(e) => updateItem(item.id, "emoji", e.target.value)}
                className="w-10 h-9 text-base border border-gray-100 rounded-xl bg-[#F8F6F0]
                  text-center cursor-pointer outline-none focus:border-[#FF922B]"
                aria-label="Choisir un emoji"
              >
                {EMOJI_OPTIONS.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>

              <input
                type="text"
                value={item.time}
                onChange={(e) => updateItem(item.id, "time", e.target.value)}
                className="w-16 text-center text-sm font-bold py-2 border border-gray-100
                  rounded-xl bg-[#F8F6F0] text-[#1E2A38] outline-none focus:border-[#FF922B]"
                placeholder="07:00"
              />

              <input
                type="text"
                value={item.task}
                onChange={(e) => updateItem(item.id, "task", e.target.value)}
                className="flex-1 text-sm py-2 px-3 border border-gray-100 rounded-xl
                  bg-[#F8F6F0] text-[#1E2A38] outline-none focus:border-[#FF922B]"
                placeholder="Activité…"
              />

              <button
                onClick={() => removeItem(item.id)}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-100
                  text-gray-300 hover:text-red-400 hover:border-red-200 hover:bg-red-50 transition-all"
                aria-label="Supprimer"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}

          <button
            onClick={addItem}
            className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-2xl
              text-sm font-bold text-[#7A8BA0] hover:border-[#FF922B] hover:text-[#FF922B]
              hover:bg-[#FFF8EC] transition-all flex items-center justify-center gap-2 mt-1"
          >
            <Plus size={14} /> Ajouter une étape
          </button>
        </div>

        {/* Print preview hint */}
        <div className="px-5 pb-4">
          <div className="bg-[#FFF9C4] rounded-2xl px-4 py-3 text-xs text-[#9C6800] font-semibold flex items-center gap-2">
            <Printer size={13} />
            L&apos;impression affichera uniquement la fiche avec les grandes cases à cocher pour l&apos;enfant.
          </div>
        </div>
      </div>
    </>
  );
}
