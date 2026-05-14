"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "mots" | "phrases";

// Couleurs alternantes par syllabe (méthode bicolore)
const C1 = "#1A5F7A";
const C2 = "#E05050";

type Syllabe = { text: string; color: string };
type MotColore = { emoji: string; mot: string; syllabes: Syllabe[] };
type Phrase = { titre: string; lignes: { mots: MotColore[] }[] };

function bicolor(decomp: string[]): Syllabe[] {
  return decomp.map((s, i) => ({ text: s, color: i % 2 === 0 ? C1 : C2 }));
}

const MOTS_LISTE: MotColore[] = [
  { emoji: "🐱", mot: "chat",         syllabes: bicolor(["chat"]) },
  { emoji: "🐰", mot: "lapin",        syllabes: bicolor(["la","pin"]) },
  { emoji: "☀️", mot: "soleil",       syllabes: bicolor(["so","leil"]) },
  { emoji: "🏠", mot: "maison",       syllabes: bicolor(["mai","son"]) },
  { emoji: "🦋", mot: "papillon",     syllabes: bicolor(["pa","pil","lon"]) },
  { emoji: "🐘", mot: "éléphant",     syllabes: bicolor(["é","lé","phant"]) },
  { emoji: "🍫", mot: "chocolat",     syllabes: bicolor(["cho","co","lat"]) },
  { emoji: "🌲", mot: "forêt",        syllabes: bicolor(["fo","rêt"]) },
  { emoji: "🚀", mot: "fusée",        syllabes: bicolor(["fu","sée"]) },
  { emoji: "🐊", mot: "crocodile",    syllabes: bicolor(["cro","co","dile"]) },
  { emoji: "🐞", mot: "coccinelle",   syllabes: bicolor(["coc","ci","nelle"]) },
  { emoji: "🦛", mot: "hippopotame",  syllabes: bicolor(["hip","po","po","tame"]) },
  { emoji: "📚", mot: "bibliothèque", syllabes: bicolor(["bi","blio","thè","que"]) },
  { emoji: "🍒", mot: "cerise",       syllabes: bicolor(["ce","rise"]) },
  { emoji: "☁️", mot: "nuage",        syllabes: bicolor(["nu","age"]) },
];

// Phrases pré-découpées en syllabes avec couleurs alternantes
// La couleur alterne par syllabe dans chaque mot, indépendamment des autres mots
const PHRASES_LISTE: Phrase[] = [
  {
    titre: "La forêt enchantée",
    lignes: [
      { mots: [
        { emoji:"", mot:"Un",      syllabes: bicolor(["Un"]) },
        { emoji:"🐰", mot:"lapin",   syllabes: bicolor(["la","pin"]) },
        { emoji:"", mot:"gris",    syllabes: bicolor(["gris"]) },
        { emoji:"", mot:"saute",   syllabes: bicolor(["sau","te"]) },
      ]},
      { mots: [
        { emoji:"", mot:"dans",    syllabes: bicolor(["dans"]) },
        { emoji:"🌲", mot:"la forêt",syllabes: bicolor(["la","fo","rêt"]) },
        { emoji:"", mot:"verte.",  syllabes: bicolor(["ver","te"]) },
      ]},
    ],
  },
  {
    titre: "Le ciel étoilé",
    lignes: [
      { mots: [
        { emoji:"🌙", mot:"La nuit",  syllabes: bicolor(["La","nuit"]) },
        { emoji:"", mot:"le",       syllabes: bicolor(["le"]) },
        { emoji:"☀️", mot:"soleil",  syllabes: bicolor(["so","leil"]) },
        { emoji:"", mot:"dort.",    syllabes: bicolor(["dort"]) },
      ]},
      { mots: [
        { emoji:"⭐", mot:"Les étoiles", syllabes: bicolor(["Les","é","toi","les"]) },
        { emoji:"", mot:"brillent",     syllabes: bicolor(["bril","lent"]) },
        { emoji:"", mot:"fort.",        syllabes: bicolor(["fort"]) },
      ]},
    ],
  },
  {
    titre: "L'aventure de Léo",
    lignes: [
      { mots: [
        { emoji:"🧒", mot:"Léo",      syllabes: bicolor(["Lé","o"]) },
        { emoji:"", mot:"ouvre",    syllabes: bicolor(["ou","vre"]) },
        { emoji:"", mot:"sa",       syllabes: bicolor(["sa"]) },
        { emoji:"📚", mot:"boîte",   syllabes: bicolor(["boî","te"]) },
        { emoji:"", mot:"magique.", syllabes: bicolor(["ma","gi","que"]) },
      ]},
      { mots: [
        { emoji:"🌈", mot:"Un arc-en-ciel", syllabes: bicolor(["Un","arc","en","ciel"]) },
        { emoji:"", mot:"en",         syllabes: bicolor(["en"]) },
        { emoji:"", mot:"sort.",       syllabes: bicolor(["sort"]) },
      ]},
    ],
  },
];

function MotColoreView({ mot, showSplit }: { mot: MotColore; showSplit: boolean }) {
  return (
    <span className="inline-block mx-1">
      {showSplit ? (
        mot.syllabes.map((s, i) => (
          <span key={i} className="font-display font-extrabold" style={{ color: s.color, fontSize: 22 }}>
            {s.text}
            {i < mot.syllabes.length - 1 && (
              <span style={{ color: "#CBD5E0", fontSize: 18 }}>·</span>
            )}
          </span>
        ))
      ) : (
        <span className="font-display font-extrabold" style={{ color: C1, fontSize: 22 }}>
          {mot.mot}
        </span>
      )}
    </span>
  );
}

export default function LectureCouleurs() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [idx, setIdx] = useState(0);
  const [showSplit, setShowSplit] = useState(false);

  const totalMots = MOTS_LISTE.length;
  const totalPhrases = PHRASES_LISTE.length;

  function next() {
    setShowSplit(false);
    if (mode === "mots") setIdx((i) => Math.min(i + 1, totalMots - 1));
    else setIdx((i) => Math.min(i + 1, totalPhrases - 1));
  }
  function prev() {
    setShowSplit(false);
    setIdx((i) => Math.max(i - 1, 0));
  }
  function restart() { setIdx(0); setShowSplit(false); setMode(null); }

  const isLastMot = mode === "mots" && idx === totalMots - 1;
  const isLastPhrase = mode === "phrases" && idx === totalPhrases - 1;

  if (!mode) {
    return (
      <div className="space-y-4">
        <div className="text-center py-2">
          <div className="text-5xl mb-3">🌈</div>
          <div className="font-display text-lg font-bold text-[#1E2A38] mb-1">Lecture Couleurs</div>
          <div className="text-sm text-[#7A8BA0] mb-4 max-w-xs mx-auto">
            Les syllabes de chaque mot s'affichent en <strong style={{ color: C1 }}>bleu</strong> et <strong style={{ color: C2 }}>rouge</strong> — lis à voix haute !
          </div>
          <div className="bg-[#E8F7FF] rounded-2xl p-3 mb-5 text-xs text-[#1A5F7A] font-semibold">
            🔬 La méthode bicolore renforce la conscience syllabique et facilite le décodage chez les enfants TDAH (Snowling, 2000).
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={() => { setMode("mots"); setIdx(0); }}
            className="w-full py-4 rounded-2xl border-2 border-[#5B9CF6] font-display text-base font-extrabold"
            style={{ background: "#DBEAFE", color: "#1A4FA0" }}>
            📝 Mots isolés
            <div className="text-xs font-semibold text-[#5B9CF6] mt-0.5">Un mot à la fois — commencer ici</div>
          </button>
          <button onClick={() => { setMode("phrases"); setIdx(0); }}
            className="w-full py-4 rounded-2xl border-2 border-[#5CC7A0] font-display text-base font-extrabold"
            style={{ background: "#B8EDD9", color: "#0F5C3A" }}>
            📖 Petites phrases
            <div className="text-xs font-semibold text-[#5CC7A0] mt-0.5">Phrases courtes avec découpage</div>
          </button>
        </div>
      </div>
    );
  }

  if (mode === "mots") {
    const mot = MOTS_LISTE[idx];
    return (
      <div className="space-y-4">
        {/* Progress */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-[#5B9CF6]"
              style={{ width: `${((idx + 1) / totalMots) * 100}%`, transition: "width 0.4s" }} />
          </div>
          <div className="text-xs font-bold text-[#7A8BA0]">{idx + 1}/{totalMots}</div>
        </div>

        {/* Carte mot */}
        <AnimatePresence mode="wait">
          <motion.div key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex flex-col items-center py-8 rounded-3xl border-2 border-gray-100 bg-white"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
          >
            <div className="text-7xl mb-5">{mot.emoji}</div>
            <div className="text-3xl mb-4">
              <MotColoreView mot={mot} showSplit={showSplit} />
            </div>
            {showSplit && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-sm font-bold text-[#7A8BA0] mt-1">
                {mot.syllabes.length} syllabe{mot.syllabes.length > 1 ? "s" : ""}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bouton découper */}
        <button onClick={() => setShowSplit(!showSplit)}
          className="w-full py-3 rounded-2xl border-2 text-sm font-extrabold transition-all"
          style={{
            borderColor: showSplit ? C2 : "#E2E8F0",
            background: showSplit ? "#FDECEA" : "#F8F6F0",
            color: showSplit ? C2 : "#7A8BA0",
          }}>
          {showSplit ? "🔡 Cacher le découpage" : "🔡 Voir les syllabes"}
        </button>

        {/* Navigation */}
        <div className="flex gap-2">
          <button onClick={prev} disabled={idx === 0}
            className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-sm font-bold text-[#7A8BA0]
              disabled:opacity-40 transition-all">
            ← Précédent
          </button>
          {!isLastMot ? (
            <button onClick={next}
              className="flex-1 py-3 rounded-2xl text-sm font-extrabold text-white"
              style={{ background: "linear-gradient(135deg, #5B9CF6, #8E72DB)" }}>
              Suivant →
            </button>
          ) : (
            <button onClick={restart}
              className="flex-1 py-3 rounded-2xl text-sm font-extrabold text-white"
              style={{ background: "linear-gradient(135deg, #5CC7A0, #3A9FD4)" }}>
              🎉 Terminé !
            </button>
          )}
        </div>
        <button onClick={restart} className="w-full text-xs font-bold text-[#7A8BA0]">← Changer de mode</button>
      </div>
    );
  }

  // Mode phrases
  const phrase = PHRASES_LISTE[idx];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-[#5CC7A0]"
            style={{ width: `${((idx + 1) / totalPhrases) * 100}%`, transition: "width 0.4s" }} />
        </div>
        <div className="text-xs font-bold text-[#7A8BA0]">{idx + 1}/{totalPhrases}</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
          className="bg-white rounded-3xl p-6 border-2 border-gray-100"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#7A8BA0] mb-4">
            📖 {phrase.titre}
          </div>
          <div className="space-y-3">
            {phrase.lignes.map((ligne, li) => (
              <div key={li} className="flex flex-wrap gap-y-1 leading-loose">
                {ligne.mots.map((mot, mi) => (
                  <MotColoreView key={mi} mot={mot} showSplit={showSplit} />
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <button onClick={() => setShowSplit(!showSplit)}
        className="w-full py-3 rounded-2xl border-2 text-sm font-extrabold transition-all"
        style={{
          borderColor: showSplit ? C2 : "#E2E8F0",
          background: showSplit ? "#FDECEA" : "#F8F6F0",
          color: showSplit ? C2 : "#7A8BA0",
        }}>
        {showSplit ? "🔡 Cacher le découpage" : "🔡 Voir les syllabes"}
      </button>

      <div className="flex gap-2">
        <button onClick={prev} disabled={idx === 0}
          className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-sm font-bold text-[#7A8BA0] disabled:opacity-40">
          ← Précédent
        </button>
        {!isLastPhrase ? (
          <button onClick={next}
            className="flex-1 py-3 rounded-2xl text-sm font-extrabold text-white"
            style={{ background: "linear-gradient(135deg, #5CC7A0, #3A9FD4)" }}>
            Suivant →
          </button>
        ) : (
          <button onClick={restart}
            className="flex-1 py-3 rounded-2xl text-sm font-extrabold text-white"
            style={{ background: "linear-gradient(135deg, #5CC7A0, #3A9FD4)" }}>
            🎉 Bravo !
          </button>
        )}
      </div>
      <button onClick={restart} className="w-full text-xs font-bold text-[#7A8BA0]">← Changer de mode</button>
    </div>
  );
}