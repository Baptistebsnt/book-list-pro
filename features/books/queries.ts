import { type BookFilters, normalizeFilters } from "@/domain/book"
import { getBook, listBooks } from "@/services/api/books"
import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query"
import { bookKeys } from "./keys"

export const bookListOptions = (filters: BookFilters = {}) => {
  const normalized = normalizeFilters(filters)

  return queryOptions({
    queryKey: bookKeys.list(normalized),
    queryFn: () => listBooks(normalized),
    placeholderData: keepPreviousData,
  })
}

export const bookOptions = (id: string) =>
  queryOptions({
    queryKey: bookKeys.detail(id),
    queryFn: () => getBook(id),
  })

export const useBooks = (filters: BookFilters = {}) =>
  useQuery(bookListOptions(filters))

export const useBook = (id: string) => useQuery(bookOptions(id))
