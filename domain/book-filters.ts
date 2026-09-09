import { z } from "zod"

export const DEFAULT_LIMIT = 20

/**
 * Query parameters of GET /books. Defaults are applied here so that two
 * equivalent filter sets produce the very same cache key.
 */
export const bookFiltersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(DEFAULT_LIMIT),
  q: z
    .string()
    .trim()
    .transform((value) => (value.length === 0 ? null : value))
    .nullable()
    .default(null),
  status: z.enum(["lu", "nonlu"]).nullable().default(null),
  favori: z.boolean().nullable().default(null),
  sort: z
    .enum(["titre", "auteur", "annee", "note", "updatedAt"])
    .default("titre"),
  order: z.enum(["asc", "desc"]).default("asc"),
})

export type BookFilters = z.input<typeof bookFiltersSchema>

export type NormalizedBookFilters = z.output<typeof bookFiltersSchema>

export const normalizeFilters = (
  filters: BookFilters = {},
): NormalizedBookFilters => bookFiltersSchema.parse(filters)

/** True as soon as a search or a filter narrows the catalogue. */
export const hasActiveFilter = (filters: NormalizedBookFilters): boolean =>
  filters.q !== null || filters.status !== null || filters.favori !== null
