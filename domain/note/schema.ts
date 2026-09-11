import { z } from "zod"

export const noteSchema = z.object({
  id: z.string().min(1),
  livreId: z.string().min(1),
  contenu: z.string().min(1),
  createdAt: z.string().min(1),
})

export type Note = z.infer<typeof noteSchema>

export const noteDraftSchema = z.object({
  contenu: z.string().trim().min(1, "validation.note.contentRequired"),
})

export type NoteDraft = z.infer<typeof noteDraftSchema>
