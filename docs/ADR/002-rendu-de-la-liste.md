# ADR 002 — Rendu de la liste et isolation de la frappe

## Statut

Accepté — 11/09/2026

## Contexte

La liste affiche jusqu'à 500 ouvrages paginés, et chaque ligne porte deux
contrôles interactifs (coup de cœur, statut lu). Le terme de recherche vivait
dans l'écran `BooksList` : chaque frappe re-rendait l'écran entier, donc la
`FlatList`, donc les lignes. Pire, `isReloading` passait à `true` dès la
première lettre et `BookListContent` remplaçait la liste par un squelette — les
lignes n'étaient pas re-rendues, elles étaient démontées puis remontées.

Trois autres sources de rendus superflus s'y ajoutaient : `data` recalculé à
chaque rendu (`excludeDeleted(...)`), `renderItem` recréé à chaque rendu, et des
lignes sans `memo`.

Le lot 2 exige qu'une frappe ne provoque aucun rendu de ligne, vérifiable au
profileur.

## Options envisagées

1. **Tout mémoïser en laissant l'état dans l'écran** : `React.memo` sur les
   lignes suffit à bloquer leur rendu, mais l'écran, la `FlatList` et l'en-tête
   continuent de se re-rendre à chaque caractère. On traite le symptôme.
2. **Champ non contrôlé dans la barre** : la barre garde le texte en interne et
   ne remonte que le terme débattu. Simple, mais l'écran a besoin de savoir
   qu'une recherche est en cours (`isSettled`) pour afficher son état de
   chargement — l'information doit remonter d'une façon ou d'une autre.
3. **Deux contextes séparés** : un pour le texte brut, un pour le terme débattu.
   Chaque consommateur ne s'abonne qu'à ce qu'il utilise.

## Décision

Nous retenons l'option 3, complétée par la mémoïsation des lignes.

- **`BookSearchProvider`** (`services/query/books/search.tsx`) détient le texte
  et expose deux contextes : `useSearchInput()` (`term`, `setTerm`), consommé
  par la seule `BookSearchBar`, et `useSearchedTerm()` (`searchedTerm`,
  `isSettled`, `setTerm`), consommé par `useBookBrowse`. Le second ne change
  qu'au terme du debounce de 300 ms.
- Les enfants du provider sont passés par `children` : React réutilise
  l'élément, seuls les consommateurs du contexte modifié sont re-rendus.
- **`BookSearchBar` n'a plus de props** et est enveloppée dans `memo` : un rendu
  de l'écran ne la touche pas, et sa propre frappe ne touche pas l'écran.
- **Identités stables côté liste** : `keyExtractor`, `renderItem` et `openBook`
  sont des fonctions de module, `books` est calculé dans un `useMemo`, et
  `BookListItem` est un `memo` qui reçoit `onPress: (book) => void` plutôt
  qu'une closure par ligne. `BookListHeader`, `BookFilterBar` et
  `BookListFooter` sont également mémoïsés.
- **Les lignes précédentes restent montées pendant un affinage** (recherche ou
  filtre), atténuées et marquées `aria-busy`, ce que `keepPreviousData` fournit
  déjà côté cache. Le squelette complet est réservé au premier chargement
  (`status === "pending"`).

## Conséquences

Positives : une frappe ne rend plus que la barre de recherche ; l'écran ne se
re-rend qu'au début et à la fin d'une rafale (bascule de `isSettled`), et les
lignes restent intactes à ces deux rendus. La liste ne clignote plus entre deux
recherches.

Négatives : deux contextes à comprendre plutôt qu'un état local, et tout test
qui monte un écran de liste doit monter `BookSearchProvider`.

À revoir si : le React Compiler est activé au build — une partie des `memo` et
`useMemo` deviendrait redondante.

## Limites connues

Le test de non-régression (`features/books/__test__/book-list.test.tsx`) compte
les rendus de ligne en instrumentant `ReadBadge`, rendu à l'intérieur de la
frontière `memo` de `BookListItem`. Il mesure donc les rendus de ligne
indirectement : si `ReadBadge` disparaissait de la ligne, le compteur
deviendrait silencieusement aveugle.
