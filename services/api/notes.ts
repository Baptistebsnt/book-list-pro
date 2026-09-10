import { z } from "zod"
import { type Note, type NoteDraft, noteSchema } from "@/domain/note"
import { type ReadOptions } from "./books"
import { apiClient } from "./client"
import { parseResponse } from "./validate"

const noteListSchema = z.array(noteSchema)

export const listNotes = async (
  bookId: string,
  options: ReadOptions = {},
): Promise<Note[]> => {
  const data = await apiClient.get<unknown>(`/books/${bookId}/notes`, {
    signal: options.signal,
  })

  return parseResponse(noteListSchema, data, "GET /books/:id/notes")
}

export type NoteCreation = {
  bookId: string
  draft: NoteDraft
}

export const createNote = async ({
  bookId,
  draft,
}: NoteCreation): Promise<Note> => {
  const data = await apiClient.post<unknown>(`/books/${bookId}/notes`, draft)

  return parseResponse(noteSchema, data, "POST /books/:id/notes")
}

export type NoteDeletion = {
  bookId: string
  noteId: string
}

export const deleteNote = async ({
  bookId,
  noteId,
}: NoteDeletion): Promise<void> => {
  await apiClient.delete(`/books/${bookId}/notes/${noteId}`)
}
