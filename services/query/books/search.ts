import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { bookKeys } from "./keys"
import { useInfiniteBooks } from "./queries"

export const SEARCH_DEBOUNCE_MS = 300

export const useBookSearch = () => {
  const client = useQueryClient()
  const [term, setTerm] = useState("")
  const debouncedTerm = useDebouncedValue(term, SEARCH_DEBOUNCE_MS)
  const searchedTerm = debouncedTerm.trim()
  const isSettled = term.trim() === searchedTerm

  useEffect(() => {
    if (isSettled) {
      return
    }

    void client.cancelQueries({ queryKey: bookKeys.lists() })
  }, [client, isSettled, term])

  const query = useInfiniteBooks({ q: searchedTerm })

  return {
    term,
    setTerm,
    searchedTerm,
    isSearching: !isSettled || query.isPlaceholderData,
    query,
  }
}
