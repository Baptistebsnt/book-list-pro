import { z } from "zod"

export const DEFAULT_LIMIT = 20

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

export type BookStatus = NonNullable<NormalizedBookFilters["status"]>

export type BookSort = NormalizedBookFilters["sort"]

export type BookOrder = NormalizedBookFilters["order"]
