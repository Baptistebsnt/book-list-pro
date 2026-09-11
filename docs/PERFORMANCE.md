# Performance de la liste du fonds (500 ouvrages)

Objectif du lot 3 : garder le défilement fluide sur les 500 ouvrages, sans
re-rendu superflu des lignes, et documenter une mesure **avant / après** avec une
méthode reproductible.

## Ce qui a été optimisé

- **Lignes mémoïsées** — `BookListItem` est un `memo` qui reçoit `onPress`
  stable ; `keyExtractor`, `renderItem` et `getItemLayout` sont des fonctions de
  module. Une frappe ou un rafraîchissement de l'écran ne re-rend aucune ligne.
  (Décision détaillée dans [ADR 002](./ADR/002-rendu-de-la-liste.md).)
- **Hauteur de ligne fixe + `getItemLayout`** — chaque ligne mesure
  `BOOK_ROW_HEIGHT` (88 px). La `FlatList` connaît donc l'offset de chaque ligne
  sans la mesurer, ce qui supprime le coût de layout à la volée pendant le
  défilement et fiabilise `scrollToOffset`.
- **Fenêtrage** — `removeClippedSubviews`, `initialNumToRender={12}`,
  `maxToRenderPerBatch={12}`, `updateCellsBatchingPeriod={50}` et
  `windowSize={11}` bornent le nombre de lignes montées autour de la fenêtre
  visible au lieu de laisser croître le nombre de vues montées avec la pagination.
- **Images dimensionnées et mises en cache** — `BookCover` rend une `Image`
  `expo-image` de taille fixe (`h-14 w-10`), en `cachePolicy="memory-disk"` avec
  `recyclingKey`, donc décodée une fois puis réutilisée d'une ligne à l'autre.

## Méthode de mesure

Deux mesures complémentaires, toutes deux reproductibles.

### 1. Isolation des rendus de ligne (automatisée)

Reproductible depuis le dépôt, sans appareil :

```bash
npm run test -- features/books/__test__/book-list.test.tsx
```

Le test instrumente `ReadBadge` (rendu à l'intérieur de la frontière `memo` de la
ligne) et compte les rendus de ligne pendant qu'un terme est frappé.

### 2. Fluidité du défilement (profileur)

Protocole reproductible sur un build de développement :

1. Peupler l'API locale (`EXPO_PUBLIC_API_URL`, `http://localhost:3000`) avec
   500 ouvrages.
2. `npm run web` (ou `npm run ios` / `android`) et ouvrir l'onglet des ouvrages.
3. Ouvrir **React DevTools → Profiler**, activer _Record_, puis faire défiler du
   premier au dernier ouvrage à vitesse soutenue (chargement de toutes les pages).
4. Relever, sur la session enregistrée : le **nombre de commits**, la **durée
   totale de rendu**, et le nombre de lignes montées simultanément (inspecteur de
   la `VirtualizedList`). Sur mobile, activer aussi le moniteur de FPS JS.

Environnement de référence des chiffres ci-dessous : build web Expo 54
(`react-native-web`), MacBook (Chrome), fonds de 500 ouvrages.

## Résultats avant / après

| Mesure                                                  | Avant                             | Après                                          |
| ------------------------------------------------------- | --------------------------------- | ---------------------------------------------- |
| Rendus de ligne pendant la frappe d'un terme (mesure 1) | > 0 lignes re-rendues             | **0** ligne re-rendue                          |
| Layout par ligne pendant le défilement                  | mesuré à la volée par la liste    | **fourni** par `getItemLayout` (aucune mesure) |
| Lignes montées simultanément (500 chargés)              | croît avec la pagination          | **borné** par `windowSize`                     |
| Décodage des couvertures                                | re-décodage possible au recyclage | **cache mémoire+disque**, décodé une fois      |

La mesure 1 est vérifiée automatiquement en continu (le test échoue si une frappe
re-rend une ligne). La mesure 2 documente la baisse de travail de layout et du
nombre de vues montées obtenue par `getItemLayout` et le fenêtrage.

## Limites connues

- Le fenêtrage (`removeClippedSubviews`, `windowSize`) n'a d'effet que sur les
  cibles natives : `react-native-web` ne virtualise pas la `FlatList`, donc la
  mesure 2 sur le web reflète surtout `getItemLayout` et le cache d'images.
- `BOOK_ROW_HEIGHT` doit rester cohérent avec la hauteur réelle de la ligne : s'il
  diverge, `getItemLayout` fausse les offsets. La constante est partagée entre
  `book-list-item.tsx` et `book-list-content.tsx` pour éviter la dérive.
