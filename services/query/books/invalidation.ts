import { type QueryClient } from "@tanstack/react-query"
import { bookKeys } from "./keys"

export const invalidateBooks = async (
  client: QueryClient,
  id?: string,
): Promise<void> => {
  await client.invalidateQueries({ queryKey: bookKeys.lists() })

  if (typeof id === "string") {
    await client.invalidateQueries({ queryKey: bookKeys.detail(id) })
  }
}
