import { z } from "zod"

export const MIN_YEAR = 1450

export const MAX_RATING = 5

const bookYearSchema = z
  .number({
    // eslint-disable-next-line camelcase
    invalid_type_error: "validation.book.yearRequired",
  })
  .finite("validation.book.yearNumber")
  .int("validation.book.yearInteger")
  .min(MIN_YEAR, "validation.book.yearMin")
  .max(new Date().getFullYear() + 1, "validation.book.yearMax")

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
  titre: z.string().trim().min(1, "validation.book.titleRequired"),
  auteur: z.string().trim().min(1, "validation.book.authorRequired"),
  editeur: z.string().trim().min(1, "validation.book.publisherRequired"),
  annee: bookYearSchema,
  lu: z.boolean(),
  favori: z.boolean(),
  note: z.number().int().min(0).max(MAX_RATING).nullable(),
})

export type BookDraft = z.infer<typeof bookDraftSchema>
