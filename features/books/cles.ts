import { type FiltresOuvragesNormalises } from "@/domain/filtres-ouvrages"

/**
 * Clés hiérarchiques : ["ouvrages"] > ["ouvrages","liste"] > filtres.
 * Invalider un niveau invalide tout ce qui est en dessous, ce qui permet de
 * cibler « toutes les listes » sans toucher aux fiches déjà chargées.
 */
export const clesOuvrages = {
  racine: ["ouvrages"] as const,

  listes: () => [...clesOuvrages.racine, "liste"] as const,

  liste: (filtres: FiltresOuvragesNormalises) =>
    [...clesOuvrages.listes(), filtres] as const,

  details: () => [...clesOuvrages.racine, "detail"] as const,

  detail: (id: string) => [...clesOuvrages.details(), id] as const,
}
