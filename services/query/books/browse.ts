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
import { useSearchedTerm } from "./search"

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

export const useBookBrowse = () => {
  const client = useQueryClient()
  const { searchedTerm, isSettled, setTerm } = useSearchedTerm()
  const [controls, setControls] = useState<BookControls>(DEFAULT_CONTROLS)

  const apply = useCallback(
    (changes: Partial<BookControls>) => {
      void client.cancelQueries({ queryKey: bookKeys.lists() })
      setControls((current) => ({ ...current, ...changes }))
    },
    [client],
  )

  const reset = useCallback(() => {
    setTerm("")
    apply(DEFAULT_CONTROLS)
  }, [apply, setTerm])

  const filters = useMemo(
    () => normalizeFilters({ ...controls, q: searchedTerm }),
    [controls, searchedTerm],
  )

  const query = useInfiniteBooks(filters)

  return {
    setTerm,
    searchedTerm,
    controls,
    apply,
    reset,
    filters,
    isReloading: !isSettled || query.isPlaceholderData,
    query,
  }
}
