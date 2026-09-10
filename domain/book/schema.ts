import { z } from "zod"

export const MIN_YEAR = 1450

export const MAX_RATING = 5

export const bookSchema = z.object({
  id: z.string().min(1),
  titre: z.string().min(1),
  auteur: z.string().min(1),
  editeur: z.string(),
  annee: z.number().int().min(MIN_YEAR),
  lu: z.boolean(),
  favori: z.boolean(),
  note: z.number().min(0).max(MAX_RATING).nullable(),
  couverture: z.string().nullable(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  version: z.number().int().nonnegative(),
})

export type Book = z.infer<typeof bookSchema>

export const bookDraftSchema = z.object({
  titre: z.string().trim().min(1, "Title is required"),
  auteur: z.string().trim().min(1, "Author is required"),
  editeur: z.string().trim().min(1, "Publisher is required"),
  annee: z
    .number()
    .int("Year must be a whole number")
    .min(MIN_YEAR, `Year must be after ${MIN_YEAR}`)
    .max(new Date().getFullYear() + 1, "Year cannot be that far in the future"),
  lu: z.boolean(),
  favori: z.boolean(),
  note: z.number().int().min(0).max(MAX_RATING).nullable(),
})

export type BookDraft = z.infer<typeof bookDraftSchema>
