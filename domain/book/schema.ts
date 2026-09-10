import { z } from "zod"

export const MIN_YEAR = 1450

export const MAX_RATING = 5

const bookYearSchema = z
  .number()
  .finite("L'annee doit etre un nombre")
  .int("L'annee doit etre un nombre entier")
  .min(MIN_YEAR, `L'annee doit etre posterieure a ${MIN_YEAR}`)
  .max(
    new Date().getFullYear() + 1,
    "L'annee ne peut pas etre aussi loin dans le futur",
  )

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
  titre: z.string().trim().min(1, "Le titre est requis"),
  auteur: z.string().trim().min(1, "L'auteur est requis"),
  editeur: z.string().trim().min(1, "L'editeur est requis"),
  annee: bookYearSchema,
  lu: z.boolean(),
  favori: z.boolean(),
  note: z.number().int().min(0).max(MAX_RATING).nullable(),
})

export type BookDraft = z.infer<typeof bookDraftSchema>
