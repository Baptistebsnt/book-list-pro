import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useMemo, useState } from "react"
import {
  type BookOrder,
  type BookSort,
  type BookStatus,
  normalizeFilters,
} from "@/domain/book"
import { bookKeys } from "./keys"
import { useInfiniteBooks } from "./queries"
import { useSearchTerm } from "./search"

export type BookControls = {
  status: BookStatus | null
  favori: boolean | null
  sort: BookSort
  order: BookOrder
}

const DEFAULT_CONTROLS: BookControls = {
  status: null,
  favori: null,
  sort: "titre",
  order: "asc",
}

/**
 * Single source of truth for everything the list asks the server: the
 * debounced search term, the two filters and the sort. They all land in the
 * query key, so changing one starts a fresh infinite query at page 1 instead
 * of filtering the pages already loaded.
 */
export const useBookBrowse = () => {
  const client = useQueryClient()
  const search = useSearchTerm()
  const [controls, setControls] = useState<BookControls>(DEFAULT_CONTROLS)

  const apply = useCallback(
    (changes: Partial<BookControls>) => {
      void client.cancelQueries({ queryKey: bookKeys.lists() })
      setControls((current) => ({ ...current, ...changes }))
    },
    [client],
  )

  const reset = useCallback(() => {
    search.setTerm("")
    apply(DEFAULT_CONTROLS)
  }, [apply, search])

  const filters = useMemo(
    () => normalizeFilters({ ...controls, q: search.searchedTerm }),
    [controls, search.searchedTerm],
  )

  const query = useInfiniteBooks(filters)

  return {
    term: search.term,
    setTerm: search.setTerm,
    searchedTerm: search.searchedTerm,
    controls,
    apply,
    reset,
    filters,
    isReloading: !search.isSettled || query.isPlaceholderData,
    query,
  }
}
