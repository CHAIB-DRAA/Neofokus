"use client";

import ArticleLayout from "@/components/parent/ArticleLayout";

export default function CrisePage() {
  return (
    <ArticleLayout
      emoji="🌊"
      tag="Gestion de crise"
      tagStyle={{ background: "#FDECEA", color: "#7A1F1F" }}
      title="Protocole de crise complet"
    >
      <p>
        En cas de débordement émotionnel, votre calme est le premier outil thérapeutique. 
        Quand votre enfant est en crise, son cortex préfrontal est temporairement "hors-ligne".
      </p>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-5 mb-2">
        Signaux d'alerte à surveiller
      </h2>
      <ul className="space-y-1.5 list-none pl-0">
        {[
          "Agitation motrice accrue (se tortille, bouge sans s'arrêter)",
          "Voix qui monte ou se tend progressivement",
          "Refus répétitifs sur des demandes simples",
          "Isolement soudain ou regard vide",
        ].map((s) => (
          <li key={s} className="flex items-start gap-2 text-sm">
            <span className="text-[#FF922B]">⚠️</span> {s}
          </li>
        ))}
      </ul>

      <div className="bg-[#E8E0F8] rounded-2xl p-4 my-4">
        <p className="text-[#3D1F8A] font-semibold text-sm">
          🛡️ Créez ensemble un <strong>"plan de calme"</strong> : un lieu, un objet sensoriel, 
          un mot-code que votre enfant peut utiliser avant de déborder.
        </p>
      </div>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-5 mb-3">
        Pendant la crise — ce qu'il faut éviter
      </h2>
      <div className="bg-[#FDECEA] rounded-2xl p-4 space-y-1.5">
        {[
          "Les arguments logiques (le cerveau n'est pas accessible)",
          "Les conséquences annoncées dans l'urgence",
          "Les ultimatums et les négociations complexes",
          "Répéter la même demande plusieurs fois",
        ].map((a) => (
          <div key={a} className="flex items-start gap-2 text-xs text-[#7A1F1F] font-semibold">
            <span>❌</span> {a}
          </div>
        ))}
      </div>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-5 mb-2">
        Après la crise
      </h2>
      <p className="text-sm">
        Attendez 20 à 30 minutes minimum. Dans la douceur, parlez de ce qui s'est passé — 
        sans punir, mais en cherchant à comprendre ensemble. Ce moment de débrief est crucial 
        pour que votre enfant construise sa propre régulation émotionnelle.
      </p>
    </ArticleLayout>
  );
}
