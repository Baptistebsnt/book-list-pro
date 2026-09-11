# ADR 004 — Résolution du champ couverture

## Statut

Accepté — 11/09/2026

## Contexte

Le champ `couverture` d'un ouvrage arrive sous trois formes : un chemin relatif
(`/covers/<id>.svg`, `/media/<id>.png`), une URL absolue (`https://…`), ou
`null`. Deux écrans l'affichent — la liste et la fiche — et le lot 3 interdit
toute image cassée.

Sans point d'entrée commun, chaque écran aurait recollé l'URL de base à sa
façon, avec autant d'occasions de produire un double slash, d'oublier le cas
absolu ou de rendre une image vide.

## Options envisagées

1. **Résoudre dans le composant d'image** : au plus près de l'affichage, mais le
   composant devrait connaître l'URL de base de l'API — ce qui ferait remonter
   une dépendance réseau dans `components/`, et dupliquerait la logique dès le
   deuxième écran.
2. **Résoudre dans le domaine** (`domain/book`) : le domaine ne connaît ni
   réseau ni configuration, et l'URL de base n'est pas une propriété métier de
   l'ouvrage.
3. **Résoudre dans `services/`**, qui détient déjà `config.baseUrl`.

## Décision

Nous retenons l'option 3 : `services/api/covers.ts` expose `resolveCoverUrl`,
seul endroit où une valeur de couverture devient une URL affichable.

- **`new URL(valeur, config.baseUrl)` traite les deux premiers cas d'un seul
  geste** : une URL absolue ignore la base et ressort intacte, un chemin relatif
  est préfixé. Pas de concaténation de chaînes, donc ni double slash ni slash
  manquant, y compris si la valeur omet son slash initial.
- **`null` retombe sur `/covers/<id>.svg`**, la couverture générée par l'API,
  avec l'identifiant encodé.
- **Trois garde-fous** contre l'image cassée : une chaîne vide ou blanche est
  traitée comme `null` ; une valeur inanalysable (`"http://"`) retombe sur le
  repli au lieu de ressortir telle quelle ; le repli lui-même est construit sur
  une base déjà validée par zod au démarrage (`services/api/config.ts`).
- **`hasCoverSource`** accompagne la résolution : les écrans savent ainsi si la
  fiche portait réellement une couverture, et peuvent afficher une couverture
  dessinée plutôt que l'image générée par l'API.
- **Une règle ESLint** interdit dans `app/`, `components/`, `domain/`,
  `features/`, `hooks/` et `providers/` les URL en dur — littérales comme
  interpolées — ainsi que toute lecture de `EXPO_PUBLIC_API_URL`.

## Conséquences

Positives : les composants reçoivent une URL déjà résolue et n'ont plus qu'une
décision à prendre, celle du rendu. Les trois formes sont couvertes par des
tests unitaires (`services/api/__test__/covers.test.ts`).

Négatives : la fonction prend l'identifiant de l'ouvrage en plus de la valeur du
champ, puisque le repli en dépend — une signature un peu moins évidente qu'une
simple transformation de chaîne.

## Limites connues

La résolution garantit une URL bien formée, pas une image qui charge : un
serveur absent ou un 404 restent possibles. Ce cas est traité à l'affichage, où
`BookCover` bascule sur `GeneratedCover` en cas d'erreur de chargement.
