# Lot 2 — la frappe ne re-rend pas la liste

## Ce qui posait problème

L'état brut de la barre de recherche (`term`) vivait dans l'écran `BooksList`.
Chaque frappe re-rendait donc l'écran entier, et comme `isReloading` passait à
`true` dès la première lettre, `BookListContent` remplaçait la liste par un
squelette : les lignes étaient démontées puis remontées à chaque recherche.
S'y ajoutaient trois sources de rendus superflus : `data` (un nouveau tableau à
chaque rendu), `renderItem` (une closure recréée à chaque rendu) et des lignes
non mémoïsées.

## Ce qui a été fait

1. **Isolation de l'état de la frappe** — `BookSearchProvider`
   (`services/query/books/search.tsx`) expose deux contextes distincts :
   - `useSearchInput()` → `{ term, setTerm }`, consommé par la seule
     `BookSearchBar` ;
   - `useSearchedTerm()` → `{ searchedTerm, isSettled, setTerm }`, consommé par
     `useBookBrowse`, qui ne change qu'au terme du debounce (300 ms).

   Les enfants du provider sont passés via `children` : seuls les consommateurs
   du contexte concerné sont re-rendus. `BookSearchBar` n'a plus de props et est
   enveloppée dans `memo` : un rendu de l'écran ne la touche pas, et sa propre
   frappe ne touche pas l'écran.

2. **Mémoïsation des lignes** — `BookListItem` est un `memo`, `keyExtractor` et
   `renderItem` sont des fonctions de module (identité stable), `onPress` est la
   fonction de module `openBook` (la ligne l'appelle avec son `book`), et le
   tableau `books` est calculé dans un `useMemo`. `BookListHeader`,
   `BookFilterBar` et `BookListFooter` sont également mémoïsés.

3. **Plus de squelette pendant l'affinage** — pendant qu'une recherche ou un
   filtre est en vol, les lignes précédentes restent montées (c'est déjà ce que
   fournit `keepPreviousData`), atténuées et marquées `aria-busy`. Le squelette
   complet reste réservé au premier chargement (`status === "pending"`).

## Vérification automatisée

`features/books/__test__/book-list.test.tsx` compte les rendus de ligne en
instrumentant `ReadBadge`, rendu à l'intérieur de la frontière `memo` de
`BookListItem` :

```
✓ memoizes the rows
✓ does not render a single row while the term is typed   → 0 rendu de ligne
✓ renders the results once the debounced search lands    → rendus > 0
```

Contrôle de non-régression : en retirant `memo` de `BookListItem`, le test
tombe à `expected 2 to be +0` — le compteur détecte bien les rendus.

## Vérification au profileur React DevTools

1. `npm start`, puis ouvrir l'application avec React DevTools connecté.
2. Onglet **Profiler** → activer « Record why each component rendered ».
3. Démarrer l'enregistrement, taper `dune` dans la barre de recherche, arrêter
   l'enregistrement avant la fin du debounce (300 ms après la dernière lettre).
4. Lecture attendue, commit par commit (un commit par frappe) :
   - `BookSearchBar` : re-rendue (« Context changed »),
   - `BookListItem` : absente des composants rendus, la barre du flamegraph est
     grisée avec « Did not render »,
   - un unique commit supplémentaire après le debounce, où les lignes ne sont
     re-rendues que si les données du serveur ont changé.

Déposer la capture correspondante à côté de ce document.
