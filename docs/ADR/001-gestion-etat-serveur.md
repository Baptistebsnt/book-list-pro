# ADR 001 — Gestion de l'état serveur

## Statut

Accepté — 09/09/2026

## Contexte

L'application lit et écrit un fonds de 500 ouvrages exposé par une API paginée,
versionnée et volontairement instable (mode dégradé : 1,5 s de latence, 30 %
d'échecs). Les écrans doivent afficher quatre états (chargement, erreur avec
réessai, vide, succès), consommer la pagination serveur, et rester corrects
quand plusieurs écrans lisent la même fiche.

Contraintes :

- filtrer, trier et paginer côté client est explicitement interdit ;
- une écriture doit rafraîchir les listes concernées sans rechargement manuel ;
- le lot 4 ajoutera un cache persistant et une file de mutations hors ligne ;
- les réponses doivent être validées à l'exécution, pas seulement typées.

## Options envisagées

1. **État local `useState` + `useEffect`** : aucune dépendance, mais cache,
   déduplication, annulation et invalidation sont à réécrire à la main. Coût
   caché élevé et source de conditions de concurrence.
2. **Redux Toolkit Query** : couvre le besoin, mais impose un store global dont
   nous n'avons pas l'usage pour l'état client.
3. **TanStack Query** : cache par clé, déduplication, annulation via `signal`,
   invalidation ciblée, mises à jour optimistes et persistance du cache
   (`@tanstack/query-async-storage-persister`) prévue nativement pour le lot 4.

## Décision

Nous retenons TanStack Query v5 comme unique gestionnaire de l'état serveur.

- **Clés structurées et hiérarchiques** (`features/books/keys.ts`) :
  `["books"]` > `["books","list"]` > `["books","list",filters]` et
  `["books","detail",id]`. Invalider un préfixe invalide toute sa
  descendance.
- **Filtres normalisés par zod** avant d'entrer dans la clé
  (`normalizeFilters`) : deux jeux de filtres équivalents partagent la même
  entrée de cache au lieu d'en créer deux.
- **Invalidation après mutation** centralisée dans `invalidateBooks` :
  toutes les listes plus la fiche touchée. Le tri et le filtrage étant calculés
  par le serveur, il est impossible de deviner quelles pages changent — on
  invalide donc l'ensemble des listes plutôt que d'éditer le cache à l'aveugle.
- **Réponse fraîche écrite dans le cache détail** (`setQueryData`) pour éviter
  un aller-retour immédiat après une écriture.
- **Politique de reprise adossée au domaine** : `isAppError` +
  `isRetryable` — on réessaie un 503 ou une coupure réseau, jamais une
  validation, un conflit de version ou un refus de rôle.
- **Le `QueryClient` est créé dans `app/_layout.tsx` via `useState`**, pas au
  niveau module : l'export web statique d'Expo évaluerait sinon le même cache
  entre deux rendus.

## Conséquences

Positives : les écrans ne gèrent plus ni cache ni annulation ; la déduplication
supprime les requêtes redondantes ; le socle du lot 4 (persistance, optimisme,
file de mutations) est déjà en place.

Négatives : une dépendance de plus, et une invalidation large qui refait
plusieurs requêtes après chaque écriture.

À revoir si : le coût de l'invalidation large devient visible en mode dégradé —
on passerait alors à une mise à jour ciblée du cache par page.

Note : le code est écrit en anglais ; seuls les noms de champs de l'API
(`titre`, `auteur`, `annee`, `lu`, `favori`, `couverture`...) restent en français,
car ils appartiennent au contrat réseau et ne nous appartiennent pas.
