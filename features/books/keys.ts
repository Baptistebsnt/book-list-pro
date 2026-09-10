import { type NormalizedBookFilters } from "@/domain/book"

export const bookKeys = {
  root: ["books"] as const,

  lists: () => [...bookKeys.root, "list"] as const,

  list: (filters: NormalizedBookFilters) =>
    [...bookKeys.lists(), filters] as const,

  details: () => [...bookKeys.root, "detail"] as const,

  detail: (id: string) => [...bookKeys.details(), id] as const,
}
