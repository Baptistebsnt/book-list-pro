import { queryOptions, useQuery } from "@tanstack/react-query"
import { listNotes } from "@/services/api/notes"
import { noteKeys } from "./keys"

export const noteListOptions = (bookId: string) =>
  queryOptions({
    queryKey: noteKeys.list(bookId),
    queryFn: ({ signal }) => listNotes(bookId, { signal }),
  })

export const useNotes = (bookId: string) => useQuery(noteListOptions(bookId))
