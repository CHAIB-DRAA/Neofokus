"use client";

import ArticleLayout from "@/components/parent/ArticleLayout";

export default function CerveauPage() {
  return (
    <ArticleLayout
      emoji="🧠"
      tag="Neurosciences"
      tagStyle={{ background: "#E8E0F8", color: "#3D1F8A" }}
      title="Comprendre le cerveau TDAH"
    >
      <p>
        Le TDAH n'est pas un manque de volonté — c'est un cerveau câblé différemment,
        avec des forces remarquables et des défis spécifiques liés à la neurologie, pas au caractère.
      </p>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-5 mb-2">
        Le rôle de la dopamine
      </h2>
      <p className="text-sm">
        Chez les enfants avec TDAH, le circuit dopaminergique fonctionne différemment.
        La dopamine — le neurotransmetteur de la motivation — est libérée moins efficacement
        face aux tâches ordinaires. C'est pourquoi les activités à forte récompense immédiate
        captent facilement l'attention, et les tâches "plates" semblent insurmontables.
      </p>

      <div className="bg-[#B8EDD9] rounded-2xl p-4 my-4">
        <p className="text-[#0F5C3A] font-semibold text-sm">
          💡 <strong>Ce que ça change :</strong> Associez chaque tâche ennuyeuse à une mini-récompense
          immédiate et prévisible. La prévisibilité de la récompense active le circuit dopaminergique
          même avant l'acte — c'est ce qu'on appelle l'anticipation dopaminergique.
        </p>
      </div>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-5 mb-2">
        Les fonctions exécutives
      </h2>
      <p className="text-sm">
        Le cortex préfrontal — chef d'orchestre du cerveau — mature plus lentement
        dans le TDAH (<strong>environ 3 ans de décalage</strong>). Il gère la planification,
        l'inhibition des impulsions, la mémoire de travail et la régulation émotionnelle.
      </p>
      <p className="text-sm mt-2">
        Un enfant de 8 ans avec TDAH a des fonctions exécutives proches d'un enfant de 5 ans.
        Ce n'est pas de la mauvaise volonté — son cerveau a besoin de plus de structure externe
        pour compenser ce que d'autres font instinctivement.
      </p>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-5 mb-3">
        La cécité temporelle — souvent ignorée
      </h2>
      <p className="text-sm mb-3">
        La <strong>cécité temporelle</strong> est l'un des symptômes les plus handicapants
        du TDAH mais le moins connu. Votre enfant ne perçoit que deux temps : <em>maintenant</em> et
        <em> pas maintenant</em>. Le futur n'est pas réel pour son cerveau.
      </p>
      <div className="space-y-2">
        {[
          { symptome: "\"Dans 5 minutes\"", realite: "Peut vouloir dire 1 ou 45 minutes — il ne ressent pas la durée." },
          { symptome: "Retards chroniques", realite: "Pas du manque de respect — le temps ne s'écoule pas de façon linéaire pour lui." },
          { symptome: "\"J'ai le temps\"", realite: "Il croit vraiment avoir le temps — il ne simule pas." },
        ].map((s, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-[#E8E0F8]">
            <div className="bg-[#FDECEA] px-4 py-2 text-xs text-[#7A1F1F] font-semibold">
              ⚠️ {s.symptome}
            </div>
            <div className="bg-[#F8F6F0] px-4 py-2 text-xs text-[#4A5568] font-semibold">
              ℹ️ {s.realite}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#E8E0F8] rounded-2xl p-4 mt-3">
        <p className="text-[#3D1F8A] font-semibold text-sm">
          🛠️ <strong>Solutions pratiques :</strong> Minuteurs visuels (type Time Timer), horloges
          à aiguilles visibles, annonces "dans 5 minutes" avec un signal physique, et routines
          fixes qui externalisent la gestion du temps.
        </p>
      </div>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-5 mb-2">
        La dysrégulation émotionnelle
      </h2>
      <p className="text-sm">
        Les enfants avec TDAH ressentent les émotions avec une intensité 30% supérieure
        (Shaw et al., 2014) et ont plus de mal à les réguler. Ce n'est pas du caprice —
        leur amygdale réagit plus fort et leur cortex préfrontal peine à moduler la réaction.
      </p>
      <p className="text-sm mt-2">
        Un enfant qui "explose" pour une petite chose n'est pas manipulateur —
        il est dépassé par une vague émotionnelle qu'il ne sait pas encore gérer.
      </p>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-5 mb-2">
        Les forces du cerveau TDAH
      </h2>
      <ul className="space-y-2 list-none pl-0">
        {[
          { icon: "🎯", f: "Hyperfocus", d: "Concentration extrême sur les sujets passionnants" },
          { icon: "🎨", f: "Créativité", d: "Pensée divergente, connexions inattendues entre idées" },
          { icon: "⚡", f: "Énergie & enthousiasme", d: "Passion contagieuse quand engagé" },
          { icon: "💙", f: "Empathie profonde", d: "Sensibilité émotionnelle aux autres" },
          { icon: "💪", f: "Résilience", d: "Avoir surmonté des défis forge une force rare" },
          { icon: "🚀", f: "Spontanéité", d: "Prise d'initiative, adaptabilité, audace" },
        ].map((f) => (
          <li key={f.f} className="flex items-start gap-3">
            <span className="text-xl">{f.icon}</span>
            <div className="text-sm">
              <span className="font-bold text-[#1E2A38]">{f.f}</span>
              <span className="text-[#7A8BA0]"> — {f.d}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="bg-[#E8E0F8] rounded-2xl p-4 mt-5">
        <p className="text-[#3D1F8A] font-semibold text-sm">
          🌟 <strong>À retenir :</strong> Votre enfant n'a pas un cerveau cassé — il a un cerveau
          qui a besoin d'un environnement adapté. Avec le bon support, les mêmes traits qui
          créent des difficultés aujourd'hui deviennent des atouts demain.
        </p>
      </div>
    </ArticleLayout>
  );
}