import { type QueryClient } from "@tanstack/react-query"
import { noteKeys } from "./keys"

export const invalidateNotes = async (
  client: QueryClient,
  bookId: string,
): Promise<void> => {
  await client.invalidateQueries({ queryKey: noteKeys.list(bookId) })
}
