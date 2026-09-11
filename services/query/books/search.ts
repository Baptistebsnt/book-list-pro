import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { bookKeys } from "./keys"

export const SEARCH_DEBOUNCE_MS = 300

export const useSearchTerm = () => {
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

  return { term, setTerm, searchedTerm, isSettled }
}
