import { type QueryClient } from "@tanstack/react-query"
import { bookKeys } from "./keys"

/**
 * After a write every list becomes suspect: filtering and sorting happen on
 * the server, so we cannot guess which pages changed. The affected record is
 * invalidated on top of that, when there is one.
 */
export const invalidateBooks = async (
  client: QueryClient,
  id?: string,
): Promise<void> => {
  await client.invalidateQueries({ queryKey: bookKeys.lists() })

  if (typeof id === "string") {
    await client.invalidateQueries({ queryKey: bookKeys.detail(id) })
  }
}
