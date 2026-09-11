# ADR 003 — Thème, tokens de couleur et bascule clair / sombre

## Statut

Accepté — 11/09/2026

## Contexte

L'interface est stylée par NativeWind, donc par des classes Tailwind. Mais
plusieurs API attendent une couleur en valeur JavaScript et non une classe :
les icônes `lucide-react-native` (`color`), `placeholderTextColor` d'un
`TextInput`, le thème de `@react-navigation/native`, la barre d'onglets, les
ombres d'un `StyleSheet`. Le code portait donc des couleurs en dur (`#0a7ea4`
hérité du starter Expo pour la barre d'onglets, `#9ca3af`, la palette complète
des toasts) à côté de classes thémées, et le lot 2 demande qu'aucune couleur ne
soit écrite dans un composant.

Le lot 3 ajoute une bascule clair / sombre : préférence système par défaut,
choix manuel, application globale, persistance entre deux lancements.

## Options envisagées

1. **Classes `dark:` uniquement** : NativeWind sait déjà basculer, mais rien
   n'expose les couleurs au JavaScript — les icônes et la navigation resteraient
   en dur.
2. **Un objet de thème JavaScript unique**, appliqué par `style` : on perd les
   classes Tailwind et la mécanique `dark:` sur toute l'interface.
3. **Les deux, tenus synchronisés** : les mêmes tokens en variables CSS pour les
   classes, et en objet JavaScript pour les props de couleur.

## Décision

Nous retenons l'option 3, et nous acceptons la duplication à condition qu'elle
soit vérifiée.

- **Deux déclarations, un seul jeu de valeurs** : `global.css` porte les
  variables (`--background`, `--muted-foreground`, `--success`, `--overlay`…)
  pour les classes Tailwind, `lib/theme.ts` porte les mêmes valeurs pour le
  JavaScript, lu par `useTheme()`. `lib/__test__/theme.test.ts` compare les deux
  blocs token par token dans les deux schémas : ajouter une couleur d'un seul
  côté fait échouer la suite. Le test a d'ailleurs révélé un `--radius` absent du
  bloc sombre.
- **Aucune couleur dans un composant**, garanti par une règle ESLint
  (`no-restricted-syntax`) qui refuse tout littéral `#rrggbb`, `rgb()` ou
  `hsl()` dans `app/`, `components/`, `features/`, `hooks/` et `providers/`.
  Les couleurs brutes de Tailwind (`bg-black/50`, `text-white`) ont été
  remplacées par des tokens ; un token `overlay`, noir dans les deux schémas,
  sert aux voiles de dialogue et aux ombres, là où `foreground` aurait viré au
  blanc en thème sombre.
- **Un Context détient la préférence** (`providers/theme.tsx`) :
  `system | light | dark`. Le thème résolu vaut la préférence explicite, ou le
  schéma système quand elle vaut `system` — la bascule de l'OS reste donc suivie
  en direct. Le provider pousse la préférence dans NativeWind
  (`setColorScheme`), ce qui applique les classes `dark:` à tous les écrans sans
  rechargement, et `hooks/use-theme.ts` lit ce même schéma pour les props de
  couleur.
- **La persistance est un service** (`services/storage/theme-preference.ts`) :
  AsyncStorage, valeur relue validée par zod. Une valeur absente, corrompue ou
  un storage en échec retombent sur `system` plutôt que de bloquer le démarrage.
- **Aucun verrou d'hydratation** : le provider rend ses enfants immédiatement
  avec la préférence système, puis applique le choix mémorisé dès qu'il arrive.
  Une première version bloquait l'arbre (`if (!isHydrated) return null`) pour
  éviter un scintillement ; l'export web statique rendait alors une racine vide.

## Conséquences

Positives : une seule table de couleurs à maintenir, une bascule qui touche
toute l'application d'un coup, et deux garde-fous automatiques (test de parité,
règle de lint) plutôt qu'une consigne de revue.

Négatives : les valeurs restent écrites deux fois ; le test rend la dérive
impossible mais pas la duplication.

## Limites connues

Au démarrage, un écran configuré en sombre peut afficher une frame en thème
système avant que la préférence mémorisée ne soit relue. La masquer proprement
demanderait de retenir le splash screen jusqu'à la lecture.

La bascule est binaire : une fois un choix manuel fait, aucune commande ne
ramène à « suivre le système », bien que le Context le permette
(`setPreference("system")`).
