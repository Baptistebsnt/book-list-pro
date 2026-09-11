# ADR 005 — Socle de tests

## Statut

Accepté — 11/09/2026

## Contexte

Le projet doit tester trois natures de code : des règles pures (schémas zod,
tri, normalisation des filtres), des hooks de données qui parlent à une API
instable, et des composants React Native. La suite tourne à chaque commit via
un hook Husky et sur chaque pull request.

## Options envisagées

1. **`jest-expo` + React Native Testing Library** : la voie officielle, qui rend
   les composants dans un environnement React Native fidèle. Mais elle impose
   Jest à côté d'un projet déjà outillé en Vite, et un démarrage sensiblement
   plus lent à chaque commit.
2. **Ne tester que le domaine et les services**, sans rendu : rapide, mais les
   états d'écran (squelette, erreur, vide, succès) et l'accessibilité ne sont
   plus vérifiés alors qu'ils sont au cœur du cahier des charges.
3. **Vitest + `react-native-web` dans jsdom** : un seul outil, démarrage
   immédiat, et les composants rendent du DOM interrogeable par rôle et par
   libellé.

## Décision

Nous retenons l'option 3.

- **`react-native` est aliasé vers `react-native-web`** dans `vitest.config.ts`.
  Les requêtes de test passent alors par les rôles et les libellés
  d'accessibilité, ce qui aligne les tests sur les exigences d'accessibilité du
  lot 2.
- **Les modules natifs sont remplacés par des stubs** (`test/stubs/`) :
  NativeWind, `react-native-svg`, `react-native-safe-area-context`,
  `expo-router`, `expo-image`, AsyncStorage. Un stub est une bascule de
  configuration, pas un `vi.mock` répété dans chaque fichier.
- **L'API est simulée par MSW**, pas par un mock de client HTTP : les tests
  passent par axios, la validation zod des réponses et le cache TanStack Query,
  donc par le vrai chemin.
- **La couverture est mesurée sur `domain/` et `services/`** uniquement, avec un
  seuil en CI. Elle cible le code où une régression est silencieuse ; les
  composants sont couverts par des tests de comportement, pas par un
  pourcentage.

## Conséquences

Positives : une suite complète en une dizaine de secondes, exécutable à chaque
commit sans friction, et des tests d'écran écrits dans le vocabulaire de
l'accessibilité.

Négatives : ce qui est testé est le rendu web des composants. Le comportement
natif réel — dont l'application effective des classes `dark:` par NativeWind,
stubbé ici — n'est pas couvert et doit être vérifié sur simulateur.

## Limites connues

`@rn-primitives/switch` et `@rn-primitives/alert-dialog` publient du JSX non
transpilé dans leurs fichiers `.mjs` : ils ne se chargent pas sous Vitest. Les
tests qui les rencontrent remplacent le composant maison correspondant
(`components/ui/switch`) par un stub local.

Vitest 5 s'appuie sur Rolldown, qui exige **Node 22 ou plus** : sous Node 21 la
suite échoue au démarrage, avant tout test.
