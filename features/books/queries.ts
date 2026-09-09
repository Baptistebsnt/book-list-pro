import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query"
import { type BookFilters, normalizeFilters } from "@/domain/book-filters"
import { getBook, listBooks } from "@/services/api/books"
import { bookKeys } from "./keys"

/** `keepPreviousData` avoids emptying the list on every page change. */
export const bookListOptions = (filters: BookFilters = {}) => {
  const normalized = normalizeFilters(filters)

  return queryOptions({
    queryKey: bookKeys.list(normalized),
    queryFn: ({ signal }) => listBooks(normalized, signal),
    placeholderData: keepPreviousData,
  })
}

export const bookOptions = (id: string) =>
  queryOptions({
    queryKey: bookKeys.detail(id),
    queryFn: ({ signal }) => getBook(id, signal),
  })

export const useBooks = (filters: BookFilters = {}) =>
  useQuery(bookListOptions(filters))

export const useBook = (id: string) => useQuery(bookOptions(id))
