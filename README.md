# 🧠 NéoFokus — Plateforme TDAH

Plateforme web bienveillante pour les enfants avec TDAH et leurs parents, construite avec **Next.js 14**, **Tailwind CSS**, **Framer Motion** et **Zustand**.

---

## 🚀 Installation & démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

---

## 🗂️ Structure du projet

```
neofokus/
├── app/
│   ├── layout.tsx                  ← Layout global + navigation duale
│   ├── globals.css                 ← Tokens de design TDAH-friendly
│   ├── page.tsx                    ← Landing page zéro-stress
│   ├── explorateur/
│   │   ├── page.tsx                ← Dashboard enfant (étoiles, jeux)
│   │   ├── quete/page.tsx          ← Quête en 3 micro-pas
│   │   └── signal-stop/page.tsx    ← Jeu d'inhibition Signal Stop
│   └── parents/
│       ├── page.tsx                ← QG des parents
│       ├── cerveau/page.tsx        ← Module neurosciences
│       ├── communication/page.tsx  ← Communication positive
│       ├── crise/page.tsx          ← Gestion de crise
│       └── routine/page.tsx        ← Routine & structure
├── components/
│   ├── quest/
│   │   ├── QuestPanel.tsx          ← Quête interactive avec célébration
│   │   ├── StepItem.tsx            ← Micro-pas avec checkmark animé
│   │   └── StarsBar.tsx            ← Barre de progression étoiles
│   ├── games/
│   │   └── StopSignal.tsx          ← Jeu Signal Stop (inhibition)
│   └── parent/
│       ├── AdviceCard.tsx          ← Carte conseil cliquable
│       ├── ArticleLayout.tsx       ← Layout article parent
│       ├── CrisisPanel.tsx         ← Plan de crise en 3 étapes
│       └── RoutineBuilder.tsx      ← Générateur de routine visuelle
└── lib/
    ├── useQuestStore.ts            ← Zustand : progression enfant
    └── useRoutineStore.ts          ← Zustand : routine personnalisée
```

---

## 🎨 Philosophie de design (TDAH-friendly)

| Principe | Implémentation |
|----------|----------------|
| Zéro pop-up intrusif | Modales remplacées par des pages dédiées |
| Grandes zones de clic | Minimum 44px sur tous les boutons |
| Palette apaisante | Bleu ciel · Vert menthe · Crème |
| Divulgation progressive | Contenu détaillé accessible au clic |
| Typographie ronde | Baloo 2 (display) + Nunito (body) |
| Animations douces | Framer Motion — pas de flash, pas de strobe |

---

## 🧩 Fonctionnalités

### Espace Explorateur (enfant)
- ⭐ Barre de progression avec étoiles persistées (Zustand + localStorage)
- 🗺️ **Quête en 3 micro-pas** : saisie du but → 3 étapes → célébration animée
- 🛑 **Jeu Signal Stop** : entraînement à l'inhibition avec score en temps réel
- 🎮 4 tuiles d'activités (extensibles)

### QG des Parents
- 📚 4 modules éducatifs (neurosciences, communication, crise, routine)
- 🌊 Plan de crise express en 3 étapes toujours visible
- 📅 **Générateur de routine** : lignes personnalisables avec emoji + heure + tâche + impression

---

## 🔧 Stack technique

- **Framework** : Next.js 14 (App Router)
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **State** : Zustand (avec persistance localStorage)
- **Icons** : Lucide React
- **Fonts** : Baloo 2 + Nunito (Google Fonts)

---

## 📦 Prochaines étapes suggérées

- [ ] Authentification (NextAuth) pour profils multiples
- [ ] Backend (Supabase) pour synchroniser la progression
- [ ] Mode impression optimisé pour la routine (CSS `@media print`)
- [ ] Jeu "Bulle de calme" (respiration guidée avec animation)
- [ ] Jeu "Défi Minuteur" (Pomodoro adapté TDAH)
- [ ] Notifications douces pour les rappels de routine
- [ ] Mode sombre optionnel
