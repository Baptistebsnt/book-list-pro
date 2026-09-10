import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type Note } from "@/domain/note"
import { type NoteDeletion, createNote, deleteNote } from "@/services/api/notes"
import { invalidateNotes } from "./invalidation"

export const useCreateNote = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: createNote,
    onSuccess: async (note: Note) => {
      await invalidateNotes(client, note.livreId)
    },
  })
}

export const useDeleteNote = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: async (result: void, variables: NoteDeletion) => {
      await invalidateNotes(client, variables.bookId)
    },
  })
}
