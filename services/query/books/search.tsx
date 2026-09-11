import { useQueryClient } from "@tanstack/react-query"
import {
  type Context,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { bookKeys } from "./keys"

export const SEARCH_DEBOUNCE_MS = 300

type SetTerm = (value: string) => void

type SearchInputValue = {
  term: string
  setTerm: SetTerm
}

type SearchedTermValue = {
  searchedTerm: string
  isSettled: boolean
  setTerm: SetTerm
}

const SearchInputContext = createContext<SearchInputValue | null>(null)

const SearchedTermContext = createContext<SearchedTermValue | null>(null)

type BookSearchProviderProps = {
  children: ReactNode
}

export const BookSearchProvider = ({ children }: BookSearchProviderProps) => {
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

  const input = useMemo(() => ({ term, setTerm }), [term])

  const searched = useMemo(
    () => ({ searchedTerm, isSettled, setTerm }),
    [isSettled, searchedTerm],
  )

  return (
    <SearchInputContext.Provider value={input}>
      <SearchedTermContext.Provider value={searched}>
        {children}
      </SearchedTermContext.Provider>
    </SearchInputContext.Provider>
  )
}

const useSearchContext = <T,>(context: Context<T | null>, hook: string): T => {
  const value = useContext(context)

  if (value === null) {
    throw new Error(`${hook} must be used inside a BookSearchProvider`)
  }

  return value
}

export const useSearchInput = (): SearchInputValue =>
  useSearchContext(SearchInputContext, "useSearchInput")

export const useSearchedTerm = (): SearchedTermValue =>
  useSearchContext(SearchedTermContext, "useSearchedTerm")
