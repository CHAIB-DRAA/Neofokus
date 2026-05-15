"use client";

import ArticleLayout from "@/components/parent/ArticleLayout";

export default function RecompensesPage() {
  return (
    <ArticleLayout
      emoji="🏆"
      tag="Stratégies comportementales"
      tagStyle={{ background: "#FFF9C4", color: "#9C6800" }}
      title="Récompenses qui fonctionnent vraiment"
    >
      <p>
        Pour un cerveau TDAH, les récompenses ne sont pas du gâteau — elles sont du carburant neurologique.
        Bien utilisées, elles transforment les comportements durablement.
      </p>

      <div className="bg-[#FFF9C4] rounded-2xl p-4 my-4">
        <p className="text-[#9C6800] font-semibold text-sm">
          🔬 <strong>La science :</strong> Le cerveau TDAH a un déficit de dopamine basale.
          Les récompenses immédiates et prévisibles compensent ce déficit et activent
          l'apprentissage bien plus efficacement que la punition.
        </p>
      </div>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-5 mb-3">
        La règle d'or : Immédiateté
      </h2>
      <p className="text-sm">
        Pour un cerveau neurotypique, une récompense retardée de quelques heures fonctionne encore.
        Pour un cerveau TDAH, un délai de plus de <strong>30 secondes</strong> réduit drastiquement
        l'effet d'apprentissage. Plus tôt = plus efficace.
      </p>
      <div className="space-y-2 mt-3">
        {[
          { bien: "✅ Immédiat (0–30s)", ex: "\"Super, tu t'es habillé tout seul ! Voici ton jeton.\"", color: "#B8EDD9", textColor: "#0F5C3A" },
          { bien: "⚠️ Différé (quelques heures)", ex: "\"Tu auras ton temps d'écran ce soir si tu ranges.\"", color: "#FFF9C4", textColor: "#9C6800" },
          { bien: "❌ Très différé (jours)", ex: "\"Si tu te comportes bien toute la semaine…\"", color: "#FDECEA", textColor: "#7A1F1F" },
        ].map((r) => (
          <div key={r.bien} className="rounded-xl px-4 py-3"
            style={{ background: r.color }}>
            <div className="text-xs font-extrabold mb-0.5" style={{ color: r.textColor }}>{r.bien}</div>
            <div className="text-xs font-semibold" style={{ color: r.textColor }}>{r.ex}</div>
          </div>
        ))}
      </div>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-6 mb-3">
        Le ratio 5:1 — Indispensable
      </h2>
      <p className="text-sm mb-3">
        Pour chaque correction ou remarque négative, il faut <strong>5 messages positifs</strong>.
        Les enfants TDAH reçoivent en moyenne 20 000 messages négatifs de plus que les autres
        avant 10 ans — cela forge une image de soi fragile.
      </p>
      <div className="bg-[#B8EDD9] rounded-2xl p-4">
        <div className="text-sm font-bold text-[#0F5C3A] mb-2">Felicitations descriptives (les plus efficaces)</div>
        {[
          { non: "\"Bravo !\"", oui: "\"Tu as rangé tes affaires sans qu'on te le demande — c'est vraiment responsable.\"" },
          { non: "\"C'est bien.\"", oui: "\"Tu as recommencé cet exercice 3 fois — c'est de la persévérance.\"" },
        ].map((ex, i) => (
          <div key={i} className="mt-2 space-y-1">
            <div className="text-xs text-[#0F5C3A]/60 font-semibold">❌ {ex.non}</div>
            <div className="text-xs text-[#0F5C3A] font-bold">✅ {ex.oui}</div>
          </div>
        ))}
      </div>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-6 mb-3">
        L'économie de jetons — Méthode la plus validée
      </h2>
      <p className="text-sm mb-3">
        L'économie de jetons est l'intervention comportementale la mieux documentée pour le TDAH
        (DuPaul &amp; Stoner, 2014). Principe : chaque comportement positif rapporte un jeton,
        les jetons s'échangent contre des privilèges choisis par l'enfant.
      </p>

      <div className="space-y-3">
        {[
          {
            step: "1",
            titre: "Choisissez 3 à 5 comportements cibles",
            detail: "Simples, observables, positifs. Ex : \"S'habiller seul avant 7h30\", \"Faire ses devoirs sans rappel\", \"Ranger son cartable\".",
            color: "#BFE3F5",
            textColor: "#1A5F7A",
          },
          {
            step: "2",
            titre: "Définissez la valeur des récompenses",
            detail: "L'enfant choisit ! Exemples : 5 jetons = 30 min de jeu vidéo, 10 jetons = activité spéciale, 20 jetons = sortie au choix.",
            color: "#B8EDD9",
            textColor: "#0F5C3A",
          },
          {
            step: "3",
            titre: "Rendez-le visible",
            detail: "Un tableau affiché dans la cuisine. Voir les progrès est motivant en soi pour le cerveau TDAH.",
            color: "#FFE0B2",
            textColor: "#9C4400",
          },
          {
            step: "4",
            titre: "Ne retirez jamais de jetons",
            detail: "Retirer des jetons gagnés crée de la frustration intense et détruit la motivation. Ajoutez seulement.",
            color: "#FDECEA",
            textColor: "#7A1F1F",
          },
          {
            step: "5",
            titre: "Fadeout progressif",
            detail: "Après 4–6 semaines de succès, espacez les récompenses. L'objectif est l'automatisation, pas la dépendance.",
            color: "#E8E0F8",
            textColor: "#3D1F8A",
          },
        ].map((s) => (
          <div key={s.step} className="flex gap-3 rounded-2xl p-4"
            style={{ background: s.color }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center font-display text-sm font-extrabold flex-shrink-0 bg-white"
              style={{ color: s.textColor }}>
              {s.step}
            </div>
            <div>
              <div className="text-sm font-bold mb-0.5" style={{ color: s.textColor }}>{s.titre}</div>
              <div className="text-xs font-semibold" style={{ color: s.textColor, opacity: 0.85 }}>{s.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-display text-base font-bold text-[#1E2A38] mt-6 mb-2">
        Ce qui ne fonctionne pas avec le TDAH
      </h2>
      <div className="bg-[#FDECEA] rounded-2xl p-4 space-y-2">
        {[
          "Retirer des privilèges acquis (crée de la détresse, pas d'apprentissage)",
          "Punitions longues différées (trop éloignées pour le cerveau TDAH)",
          "\"Si tu continues, tu ne pourras plus jamais…\" (ultimatums non tenus)",
          "Demander de la motivation intrinsèque sans support externe",
        ].map((a) => (
          <div key={a} className="flex items-start gap-2 text-xs text-[#7A1F1F] font-semibold">
            <span>❌</span> {a}
          </div>
        ))}
      </div>
    </ArticleLayout>
  );
}