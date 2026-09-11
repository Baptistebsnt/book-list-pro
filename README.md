# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Configuration de l'API

L'application ne contient aucune URL en dur : le client HTTP lit
`EXPO_PUBLIC_API_URL`.

```bash
cp .env.example .env   # http://localhost:3000 par défaut
```

Lancer l'API fournie (`api-books-v2/`) avant l'application :

```bash
npm install && npm run seed && npm start   # dans api-books-v2/
```

## Architecture en couches

| Dossier       | Rôle                                                                  |
| ------------- | --------------------------------------------------------------------- |
| `app/`        | Écrans et routing expo-router — ni logique métier, ni réseau          |
| `components/` | Interface pure, sans dépendance à l'API ni au cache                   |
| `features/`   | Découpage par domaine (`books` : clés de cache, requêtes, mutations)  |
| `services/`   | Réseau, plateforme, `QueryClient` — seul endroit qui connaît l'API    |
| `domain/`     | Schémas zod, types et erreurs applicatives, sans dépendance technique |

Décisions d'architecture : [`docs/ADR/`](docs/ADR).
Notes de performance : [`docs/perf/`](docs/perf).

## Tests

Le socle de tests utilise [Vitest](https://vitest.dev/) et
[Testing Library](https://testing-library.com/). Les composants React Native
sont rendus via `react-native-web` dans un environnement `jsdom`, et les hooks
de données sont testés contre une API simulée avec [MSW](https://mswjs.io/).

| Script                  | Commande                | Usage                                                                                                                                      |
| ----------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm test`              | `vitest run`            | Exécute toute la suite **une seule fois** puis rend la main (code de sortie ≠ 0 si un test échoue). C'est la commande utilisée en CI.      |
| `npm run test:watch`    | `vitest`                | Lance Vitest en **mode watch** : le process reste ouvert et ré-exécute uniquement les tests impactés à chaque sauvegarde. Pour développer. |
| `npm run test:coverage` | `vitest run --coverage` | Comme `npm test`, mais génère en plus un **rapport de couverture** (terminal + dossier `coverage/`) sur `domain/` et `services/`.          |

```bash
npm test             # toute la suite, une fois (CI)
npm run test:watch   # mode watch, pour développer
npm run test:coverage # une fois + rapport de couverture
```

Les tests sont co-localisés avec le code (`*.test.ts` / `*.test.tsx`). Ils
couvrent la validation zod du domaine (`domain/`), le mapping d'erreurs et la
validation des réponses (`services/`), un composant d'état de données
(`ErrorState`) et le hook de liste paginée. La configuration vit dans
`vitest.config.ts` ; les stubs de modules natifs (SVG, nativewind) sont dans
`test/stubs/`.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
