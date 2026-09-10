import {
  infiniteQueryOptions,
  keepPreviousData,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query"
import { type BookFilters, normalizeFilters } from "@/domain/book"
import { hasNextPage } from "@/domain/pagination"
import { getBook, listBooks } from "@/services/api/books"
import { bookKeys } from "./keys"

export const bookListOptions = (filters: BookFilters = {}) => {
  const normalized = normalizeFilters(filters)

  return queryOptions({
    queryKey: bookKeys.list(normalized),
    queryFn: ({ signal }) => listBooks(normalized, { signal }),
    placeholderData: keepPreviousData,
  })
}

export const bookInfiniteListOptions = (filters: BookFilters = {}) => {
  const normalized = normalizeFilters(filters)

  return infiniteQueryOptions({
    queryKey: bookKeys.infiniteList(normalized),
    queryFn: ({ pageParam, signal }) =>
      listBooks({ ...normalized, page: pageParam }, { signal }),
    initialPageParam: normalized.page,
    getNextPageParam: (lastPage) =>
      hasNextPage(lastPage) ? lastPage.page + 1 : null,
  })
}

export const bookOptions = (id: string) =>
  queryOptions({
    queryKey: bookKeys.detail(id),
    queryFn: ({ signal }) => getBook(id, { signal }),
  })

export const useBooks = (filters: BookFilters = {}) =>
  useQuery(bookListOptions(filters))

export const useInfiniteBooks = (filters: BookFilters = {}) =>
  useInfiniteQuery(bookInfiniteListOptions(filters))

export const useBook = (id: string) => useQuery(bookOptions(id))
