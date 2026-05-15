"use client";
import ArticleLayout from "@/components/parent/ArticleLayout";

export default function LireEcrirePage() {
  return (
    <ArticleLayout
      emoji="📖"
      tag="Lecture & Écriture"
      tagStyle={{ background: "#DBEAFE", color: "#1A4FA0" }}
      title="Apprendre à lire et écrire avec le TDAH"
    >
      <p>
        Les enfants TDAH ne sont pas moins intelligents — ils apprennent différemment.
        Leur cerveau a besoin de méthodes <strong>multisensorielles, structurées et engageantes</strong>
        pour ancrer la lecture et l'écriture durablement.
      </p>

      <div className="bg-[#DBEAFE] rounded-2xl p-4 my-4">
        <p className="text-[#1A4FA0] font-semibold text-sm">
          🔬 <strong>Pourquoi c'est difficile :</strong> La lecture et l'écriture mobilisent
          simultanément la mémoire de travail, l'attention sélective et le traitement phonologique —
          trois fonctions fragilisées dans le TDAH. Ce n'est pas un manque d'effort, c'est de la neurologie.
        </p>
      </div>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-5 mb-3">
        1. La méthode Orton-Gillingham — La référence mondiale
      </h2>
      <p className="text-sm mb-3">
        Développée spécifiquement pour les profils dys et TDAH, la méthode Orton-Gillingham
        est <strong>multisensorielle</strong> : l'enfant voit, entend, dit et touche simultanément.
        C'est l'approche la plus validée par la recherche pour les cerveaux atypiques.
      </p>
      <div className="space-y-2">
        {[
          { icon: "👁️", principe: "Voir", detail: "La forme du mot, sa structure visuelle" },
          { icon: "👂", principe: "Entendre", detail: "Les sons, les syllabes, le rythme" },
          { icon: "👄", principe: "Dire", detail: "Prononcer à voix haute pendant l'écriture" },
          { icon: "✋", principe: "Toucher", detail: "Tracer les lettres dans le sable, sur la peau, dans l'air" },
        ].map((s) => (
          <div key={s.principe} className="flex gap-3 items-start bg-[#F8F6F0] rounded-xl px-4 py-2.5">
            <span className="text-xl">{s.icon}</span>
            <div className="text-sm">
              <span className="font-bold text-[#1E2A38]">{s.principe} : </span>
              <span className="text-[#4A5568]">{s.detail}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#B8EDD9] rounded-2xl p-4 mt-3">
        <p className="text-[#0F5C3A] font-semibold text-sm">
          💡 <strong>En pratique :</strong> Faites tracer les lettres du mot sur le dos de l'enfant
          pendant qu'il le prononce. Cette combinaison tactile-auditive-visuelle crée des connexions
          neurologiques plus solides que la simple répétition écrite.
        </p>
      </div>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-6 mb-3">
        2. La méthode bicolore — Décoder sans se perdre
      </h2>
      <p className="text-sm mb-3">
        Alterner les couleurs par syllabe (bleu/rouge) aide le cerveau à <strong>segmenter visuellement</strong>
        les mots avant de les lire. Cette technique réduit la charge cognitive du décodage
        et permet à l'enfant de se concentrer sur le sens.
      </p>
      <div className="bg-[#E8F7FF] rounded-2xl p-4">
        <div className="text-sm font-bold text-[#1A5F7A] mb-2">Exemple :</div>
        <div className="font-display text-2xl font-extrabold">
          <span style={{ color: "#1A5F7A" }}>pa</span>
          <span style={{ color: "#E05050" }}>pil</span>
          <span style={{ color: "#1A5F7A" }}>lon</span>
        </div>
        <div className="text-xs text-[#1A5F7A] font-semibold mt-2">
          → 3 syllabes clairement visibles. L'enfant lit syllabe par syllabe avant de dire le mot entier.
        </div>
      </div>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-6 mb-3">
        3. Séances courtes et fréquentes — Pas de marathons
      </h2>
      <p className="text-sm mb-3">
        Le cerveau TDAH apprend mieux en <strong>micro-sessions répétées</strong> qu'en longues séances épuisantes.
      </p>
      <div className="space-y-2">
        {[
          { label: "✅ Idéal", detail: "10–15 min par jour, tous les jours", color: "#B8EDD9", textColor: "#0F5C3A" },
          { label: "⚠️ Acceptable", detail: "20–25 min, 3–4 fois par semaine", color: "#FFF9C4", textColor: "#9C6800" },
          { label: "❌ À éviter", detail: "1h le week-end uniquement (trop espacé)", color: "#FDECEA", textColor: "#7A1F1F" },
        ].map((r) => (
          <div key={r.label} className="rounded-xl px-4 py-2.5 text-sm font-semibold"
            style={{ background: r.color, color: r.textColor }}>
            <span className="font-extrabold">{r.label}</span> — {r.detail}
          </div>
        ))}
      </div>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-6 mb-3">
        4. La lecture à voix haute partagée
      </h2>
      <p className="text-sm mb-3">
        Lire ensemble à voix haute est l'une des stratégies les plus puissantes.
        Techniques recommandées :
      </p>
      <div className="space-y-2">
        {[
          { nom: "Echo reading", desc: "Vous lisez une phrase, l'enfant la répète. Réduit la charge d'anticipation." },
          { nom: "Lecture chorale", desc: "Vous lisez ensemble en même temps. L'enfant peut \"se cacher\" dans votre voix." },
          { nom: "Doigt sous les mots", desc: "L'enfant suit avec le doigt. Ancre la direction gauche → droite." },
          { nom: "Pause et prédiction", desc: "\"Qu'est-ce qui va se passer selon toi ?\" Active la compréhension active." },
        ].map((t) => (
          <div key={t.nom} className="flex gap-3 items-start bg-[#F8F6F0] rounded-xl px-4 py-2.5">
            <span className="text-[#FF922B] font-extrabold text-sm flex-shrink-0 mt-0.5">▶</span>
            <div className="text-sm">
              <span className="font-bold text-[#1E2A38]">{t.nom} : </span>
              <span className="text-[#4A5568]">{t.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-6 mb-3">
        5. Pour l'écriture — Réduire la charge cognitive
      </h2>
      <p className="text-sm mb-3">
        Écrire mobilise simultanément la motricité fine, l'orthographe, la grammaire et les idées.
        Pour le TDAH, c'est souvent trop en même temps. Découpez le processus :
      </p>
      <div className="space-y-2">
        {[
          { step: "1", t: "D'abord les idées", d: "Dessiner, parler, enregistrer sa voix — avant d'écrire une seule lettre." },
          { step: "2", t: "Puis la structure", d: "\"Début, milieu, fin\" ou une carte mentale simple avec 3 branches." },
          { step: "3", t: "Brouillon sans peur", d: "\"On corrige après — maintenant on écrit seulement.\" Désactiver le frein de l'erreur." },
          { step: "4", t: "Révision séparée", d: "Orthographe et grammaire lors d'une relecture dédiée, pas pendant l'écriture." },
        ].map((s) => (
          <div key={s.step} className="flex gap-3 items-start rounded-2xl px-4 py-3"
            style={{ background: ["#BFE3F5","#B8EDD9","#FFE0B2","#E8E0F8"][parseInt(s.step)-1] }}>
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-display text-sm font-extrabold flex-shrink-0"
              style={{ color: ["#1A5F7A","#0F5C3A","#9C4400","#3D1F8A"][parseInt(s.step)-1] }}>
              {s.step}
            </div>
            <div className="text-sm">
              <span className="font-bold text-[#1E2A38]">{s.t} : </span>
              <span className="text-[#4A5568]">{s.d}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-6 mb-3">
        6. Outils numériques qui aident vraiment
      </h2>
      <div className="space-y-2">
        {[
          { outil: "Synthèse vocale", usage: "Faire lire le texte à haute voix pendant que l'enfant suit des yeux — double canal sensoriel." },
          { outil: "Dictée vocale", usage: "L'enfant parle, l'outil écrit. Libère la motricité fine pour se concentrer sur les idées." },
          { outil: "Livres audio + texte", usage: "Écouter ET lire simultanément. Très efficace pour la fluidité et le vocabulaire." },
          { outil: "Police OpenDyslexic", usage: "Police spécialement conçue pour réduire les confusions de lettres — utile aussi pour le TDAH." },
        ].map((o) => (
          <div key={o.outil} className="bg-[#F8F6F0] rounded-xl px-4 py-3 text-sm">
            <span className="font-extrabold text-[#1E2A38]">{o.outil} : </span>
            <span className="text-[#4A5568]">{o.usage}</span>
          </div>
        ))}
      </div>

      <div className="bg-[#E8E0F8] rounded-2xl p-4 mt-5">
        <p className="text-[#3D1F8A] font-semibold text-sm">
          🌟 <strong>Le plus important :</strong> L'enfant TDAH qui lutte en lecture n'est pas paresseux.
          Il travaille souvent <em>plus dur</em> que ses camarades pour des résultats moindres.
          Reconnaître cet effort explicitement — "Je vois à quel point tu travailles" — est aussi
          important que toute technique.
        </p>
      </div>
    </ArticleLayout>
  );
}