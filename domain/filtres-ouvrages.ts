import { z } from "zod"

export const LIMITE_PAR_DEFAUT = 20

/**
 * Paramètres de GET /books. Les valeurs par défaut sont appliquées ici pour
 * que deux jeux de filtres équivalents produisent la même clé de cache.
 */
export const schemaFiltresOuvrages = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(LIMITE_PAR_DEFAUT),
  q: z
    .string()
    .trim()
    .transform((valeur) => (valeur.length === 0 ? null : valeur))
    .nullable()
    .default(null),
  status: z.enum(["lu", "nonlu"]).nullable().default(null),
  favori: z.boolean().nullable().default(null),
  sort: z
    .enum(["titre", "auteur", "annee", "note", "updatedAt"])
    .default("titre"),
  order: z.enum(["asc", "desc"]).default("asc"),
})

export type FiltresOuvrages = z.input<typeof schemaFiltresOuvrages>

export type FiltresOuvragesNormalises = z.output<typeof schemaFiltresOuvrages>

export const normaliserFiltres = (
  filtres: FiltresOuvrages = {},
): FiltresOuvragesNormalises => schemaFiltresOuvrages.parse(filtres)

/** Vrai dès qu'une recherche ou un filtre restreint le fonds. */
export const estFiltreActif = (filtres: FiltresOuvragesNormalises): boolean =>
  filtres.q !== null || filtres.status !== null || filtres.favori !== null
