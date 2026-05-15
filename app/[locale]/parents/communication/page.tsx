"use client";

import ArticleLayout from "@/components/parent/ArticleLayout";

export default function CommunicationPage() {
  return (
    <ArticleLayout
      emoji="💬"
      tag="Communication positive"
      tagStyle={{ background: "#B8EDD9", color: "#0F5C3A" }}
      title="Parler avec bienveillance"
    >
      <p>
        Les mots que vous choisissez façonnent la relation et l'estime de soi de votre enfant
        bien plus que vous ne le pensez. Les enfants avec TDAH reçoivent en moyenne
        <strong> 20 000 messages négatifs de plus</strong> que leurs pairs avant l'âge de 10 ans.
      </p>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-5 mb-3">
        Remplacer les formules qui blessent
      </h2>
      <div className="space-y-3">
        {[
          {
            avant: "Encore tu n'as pas rangé !",
            après: "Je vois que la chambre n'est pas rangée. Par quoi tu veux commencer ?",
          },
          {
            avant: "Tu ne m'écoutes jamais !",
            après: "J'ai besoin que tu regardes mes yeux quand je parle.",
          },
          {
            avant: "Pourquoi tu es si agité ?",
            après: "Je vois que ton corps a besoin de bouger. On fait 2 minutes de saut d'abord ?",
          },
          {
            avant: "Tu fais exprès !",
            après: "Je sais que ce n'est pas facile pour ton cerveau. Qu'est-ce qui t'aiderait là ?",
          },
          {
            avant: "Tout le monde y arrive sauf toi.",
            après: "Ton cerveau fonctionne différemment — pas moins bien, différemment.",
          },
        ].map((ex, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-gray-100">
            <div className="bg-[#FDECEA] px-4 py-2.5 text-xs text-[#7A1F1F] font-semibold">
              ❌ <em>"{ex.avant}"</em>
            </div>
            <div className="bg-[#EDFBF4] px-4 py-2.5 text-xs text-[#0F5C3A] font-semibold">
              ✅ <em>"{ex.après}"</em>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-6 mb-2">
        Le ratio 5:1 — la règle de base
      </h2>
      <p className="text-sm mb-3">
        Pour chaque remarque corrective, donnez <strong>5 commentaires positifs</strong>.
        Ce n'est pas de la complaisance — c'est de la neurologie. Le cerveau TDAH a besoin
        de renforcements positifs fréquents pour maintenir sa motivation.
      </p>
      <div className="bg-[#B8EDD9] rounded-2xl p-4 mb-4">
        <div className="text-sm font-bold text-[#0F5C3A] mb-2">
          Félicitations descriptives (bien plus efficaces que "Bravo !")
        </div>
        {[
          { non: "\"Bravo !\"", oui: "\"Tu as mis tes chaussures tout seul — c'est de l'autonomie.\"" },
          { non: "\"C'est bien.\"", oui: "\"Tu as recommencé cet exercice 3 fois sans abandonner — c'est de la persévérance.\"" },
          { non: "\"Super.\"", oui: "\"Tu as attendu ton tour sans interrompre — ton cerveau a bien travaillé.\"" },
        ].map((ex, i) => (
          <div key={i} className="mt-2 space-y-1">
            <div className="text-xs text-[#0F5C3A]/60 font-semibold">Vague : {ex.non}</div>
            <div className="text-xs text-[#0F5C3A] font-bold">Descriptif : {ex.oui}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#BFE3F5] rounded-2xl p-4 my-4">
        <p className="text-[#1A5F7A] font-semibold text-sm">
          💡 <strong>La phrase de confiance :</strong> "Je te fais confiance pour… [tâche précise et petite]."
          Le cerveau TDAH répond bien à la confiance explicitée — elle active la motivation intrinsèque.
        </p>
      </div>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-5 mb-2">
        Écoute active en 3 temps
      </h2>
      <ol className="space-y-2 list-none pl-0">
        {[
          { n: "1", t: "Nommez l'émotion", d: '"Je vois que tu es frustré·e."' },
          { n: "2", t: "Validez sans juger", d: '"C\'est normal de l\'être."' },
          { n: "3", t: "Ouvrez une porte", d: '"Qu\'est-ce qui t\'aiderait là ?"' },
        ].map((s) => (
          <li key={s.n} className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-[#B8EDD9] text-[#0F5C3A] text-xs font-extrabold
              flex items-center justify-center flex-shrink-0 font-display">{s.n}</div>
            <div className="text-sm">
              <span className="font-bold text-[#1E2A38]">{s.t}</span>
              <span className="text-[#7A8BA0]"> — {s.d}</span>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-5 mb-2">
        Pendant les transitions difficiles
      </h2>
      <p className="text-sm mb-3">
        Passer d'une activité à une autre est l'un des moments les plus difficiles pour un cerveau TDAH.
        Anticipez avec la règle des <strong>5 minutes avant</strong> :
      </p>
      <div className="space-y-2">
        {[
          { t: "5 min avant", m: "\"Dans 5 minutes on range les Lego.\" (pas encore, juste prévenir)" },
          { t: "2 min avant", m: "\"Dans 2 minutes.\" (rappel)" },
          { t: "Au moment", m: "\"C'est l'heure maintenant.\" + action concrète et immédiate" },
        ].map((r) => (
          <div key={r.t} className="flex gap-3 items-start bg-[#F8F6F0] rounded-xl px-4 py-2.5">
            <span className="text-xs font-extrabold text-[#FF922B] mt-0.5 flex-shrink-0">{r.t}</span>
            <span className="text-xs font-semibold text-[#4A5568]">{r.m}</span>
          </div>
        ))}
      </div>

      <div className="bg-[#FFF9C4] rounded-2xl p-4 mt-5">
        <p className="text-[#9C6800] font-semibold text-sm">
          ⚠️ <strong>À éviter :</strong> "Parce que je l'ai dit" comme seule explication.
          Les enfants TDAH ont besoin de comprendre le <em>pourquoi</em> — cela active leur
          motivation intrinsèque bien plus que l'autorité seule.
        </p>
      </div>
    </ArticleLayout>
  );
}