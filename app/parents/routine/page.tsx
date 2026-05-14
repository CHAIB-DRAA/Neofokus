"use client";

import ArticleLayout from "@/components/parent/ArticleLayout";

export default function RoutinePage() {
  return (
    <ArticleLayout
      emoji="📅"
      tag="Routine & structure"
      tagStyle={{ background: "#FFF3E0", color: "#7A4200" }}
      title="Pourquoi la routine protège"
    >
      <p>
        Pour un cerveau TDAH, chaque décision coûte de l'énergie. La routine automatise 
        les décisions répétitives et libère de la bande passante cognitive pour ce qui compte vraiment.
      </p>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-5 mb-3">
        Les principes d'une bonne routine
      </h2>
      <ul className="space-y-2 list-none pl-0">
        {[
          { icon: "👁️", t: "Visuellement affichée", d: "Pas seulement verbale — un planning illustré est 3x plus efficace." },
          { icon: "🔄", t: "Séquence fixe", d: "Pas une liste de règles, mais un enchaînement automatique." },
          { icon: "⏰", t: "Horaires approximatifs", d: "La rigidité stresse, la structure rassure. Visez la souplesse guidée." },
          { icon: "🔔", t: "Transitions signalées", d: "Un minuteur, une chanson, un signal visuel pour prévenir le changement." },
        ].map((p) => (
          <li key={p.t} className="flex gap-3">
            <span className="text-xl">{p.icon}</span>
            <div>
              <span className="font-bold text-[#1E2A38] text-sm">{p.t}</span>
              <span className="text-[#7A8BA0] text-sm"> — {p.d}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="bg-[#FFF3E0] rounded-2xl p-4 my-4">
        <p className="text-[#7A4200] font-semibold text-sm">
          🌟 Impliquez votre enfant dans la création de la routine. Un cerveau TDAH 
          adhère bien mieux à ce qu'il a co-construit.
        </p>
      </div>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-5 mb-2">
        Quand briser la routine ?
      </h2>
      <p className="text-sm">
        Prévenez toujours à l'avance : "Demain, il n'y aura pas de routine normale parce que…". 
        L'imprévu non annoncé est une source majeure de dysrégulation. La prévisibilité du changement 
        lui-même réduit l'anxiété.
      </p>
    </ArticleLayout>
  );
}
