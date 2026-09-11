# BookList Pro

Application Expo de gestion du fonds d'une librairie : catalogue paginé,
recherche, filtres et tri côté serveur, fiches détaillées, notes de lecture,
thème clair et sombre.

## Fonctionnalités

- **Performance sur 500 ouvrages** — liste à hauteur de ligne fixe, `getItemLayout`
  et fenêtrage pour un défilement fluide sans rendu superflu ([#61](https://github.com/Baptistebsnt/book-list-pro/issues/61),
  [docs/PERFORMANCE.md](docs/PERFORMANCE.md)).
- **Note interne 0 à 5** — notation par étoiles avec mise à jour optimiste
  ([#55](https://github.com/Baptistebsnt/book-list-pro/issues/55)).
- **Thème clair / sombre** — Context, préférence système et persistance
  ([#59](https://github.com/Baptistebsnt/book-list-pro/issues/59),
  [ADR 003](docs/ADR/003-theme-et-couleurs.md)).
- **Interface bilingue FR / EN** — bascule à chaud et formats de date / nombre
  localisés ([#60](https://github.com/Baptistebsnt/book-list-pro/issues/60)).
- **Remplacement de couverture** — sélection d'image, redimensionnement, encodage
  base64, retour à la couverture d'origine et gestion des refus `413` / `415`
  ([#57](https://github.com/Baptistebsnt/book-list-pro/issues/57)).

## Prérequis

- Node 22 ou plus (Vitest 5 s'appuie sur Rolldown, qui l'exige).
- L'API `api-books-v2` démarrée à côté :

  ```bash
  npm install && npm run seed && npm start   # dans api-books-v2/
  ```

L'application ne contient aucune URL en dur : le client HTTP lit
`EXPO_PUBLIC_API_URL`.

```bash
cp .env.example .env   # http://localhost:3000 par défaut
```

## Démarrer

```bash
npm install
npx expo start
```

Puis `i` pour le simulateur iOS, `a` pour l'émulateur Android, `w` pour le
navigateur.

## Scripts

| Script                  | Usage                                                       |
| ----------------------- | ----------------------------------------------------------- |
| `npm test`              | Toute la suite, une fois. C'est la commande de la CI.       |
| `npm run test:watch`    | Mode watch pendant le développement.                        |
| `npm run test:coverage` | Suite + rapport de couverture sur `domain/` et `services/`. |
| `npm run typecheck`     | `tsc --noEmit`.                                             |
| `npm run lint`          | ESLint (`lint:fix` pour corriger).                          |
| `npm run format`        | Prettier (`format:check` en CI).                            |

Ces quatre vérifications tournent au commit via Husky, puis sur chaque pull
request.

## Architecture

| Dossier       | Rôle                                                              |
| ------------- | ----------------------------------------------------------------- |
| `app/`        | Écrans et routing expo-router — ni logique métier, ni réseau      |
| `components/` | Interface, sans dépendance à l'API ni au cache                    |
| `features/`   | Assemblage par domaine : un écran, ses données, ses états         |
| `services/`   | Réseau, cache TanStack Query, plateforme — seul à connaître l'API |
| `domain/`     | Schémas zod, types et règles, sans dépendance technique           |

Trois conventions valent dans tout le code :

- les couleurs viennent des tokens de `lib/theme.ts` et de `global.css`, jamais
  d'un littéral dans un composant ;
- les URL sont résolues dans `services/`, qui est le seul à lire l'URL de base ;
- le code est écrit en anglais, à l'exception des champs de l'API (`titre`,
  `auteur`, `annee`, `lu`, `favori`, `couverture`) qui appartiennent au contrat
  réseau, et des textes affichés.

Les deux premières sont tenues par une règle ESLint, pas par la revue.

## Tests

Vitest et Testing Library. Les composants React Native sont rendus via
`react-native-web` dans jsdom, ce qui permet de les interroger par rôle et par
libellé d'accessibilité ; l'API est simulée par MSW. Les tests sont
co-localisés avec le code, dans des dossiers `__test__`.

## Décisions d'architecture

- [ADR 001 — Gestion de l'état serveur](docs/ADR/001-gestion-etat-serveur.md)
- [ADR 002 — Rendu de la liste et isolation de la frappe](docs/ADR/002-rendu-de-la-liste.md)
- [ADR 003 — Thème, tokens de couleur et bascule clair / sombre](docs/ADR/003-theme-et-couleurs.md)
- [ADR 004 — Résolution du champ couverture](docs/ADR/004-urls-de-couverture.md)
- [ADR 005 — Socle de tests](docs/ADR/005-socle-de-tests.md)
