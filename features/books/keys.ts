import { type NormalizedBookFilters } from "@/domain/book-filters"

/**
 * Hierarchical keys: ["books"] > ["books","list"] > filters.
 * Invalidating one level invalidates everything below it, which lets us target
 * "every list" without dropping the records already loaded.
 */
export const bookKeys = {
  root: ["books"] as const,

  lists: () => [...bookKeys.root, "list"] as const,

  list: (filters: NormalizedBookFilters) =>
    [...bookKeys.lists(), filters] as const,

  details: () => [...bookKeys.root, "detail"] as const,

  detail: (id: string) => [...bookKeys.details(), id] as const,
}
