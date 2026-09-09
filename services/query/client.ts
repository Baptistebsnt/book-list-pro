import { QueryClient } from "@tanstack/react-query"
import { estErreurApplicative } from "@/domain/erreurs"

const NOMBRE_ESSAIS_MAX = 3

const DELAI_INITIAL_MS = 500

const DELAI_MAX_MS = 10000

const DUREE_FRAICHEUR_MS = 30000

/**
 * Le mode dégradé de l'API renvoie des 503 et de la latence : on réessaie les
 * erreurs marquées réessayables, jamais une validation, un conflit ou un 403.
 */
const doitReessayer = (nombreEchecs: number, erreur: Error): boolean => {
  if (nombreEchecs >= NOMBRE_ESSAIS_MAX) {
    return false
  }

  return estErreurApplicative(erreur) ? erreur.estReessayable : true
}

const delaiAvantEssai = (nombreEchecs: number): number =>
  Math.min(DELAI_INITIAL_MS * 2 ** nombreEchecs, DELAI_MAX_MS)

export const creerQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DUREE_FRAICHEUR_MS,
        retry: doitReessayer,
        retryDelay: delaiAvantEssai,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
