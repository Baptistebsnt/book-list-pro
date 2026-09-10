import {
  type InfiniteData,
  type QueryClient,
  type QueryKey,
} from "@tanstack/react-query"
import { type Book } from "@/domain/book"
import { type BookPage } from "@/services/api/books"
import { bookKeys } from "./keys"

export type BookCacheSnapshot = [QueryKey, unknown][]

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

const isInfiniteList = (value: unknown): value is InfiniteData<BookPage> =>
  isRecord(value) && Array.isArray(value.pages)

const isList = (value: unknown): value is BookPage =>
  isRecord(value) && Array.isArray(value.items)

const isBook = (value: unknown): value is Book =>
  isRecord(value) && typeof value.titre === "string"

const patchItems = (
  items: Book[],
  id: string,
  changes: Partial<Book>,
): Book[] =>
  items.some((item) => item.id === id)
    ? items.map((item) => (item.id === id ? { ...item, ...changes } : item))
    : items

const patchList = (
  list: BookPage,
  id: string,
  changes: Partial<Book>,
): BookPage => {
  const items = patchItems(list.items, id, changes)

  return items === list.items ? list : { ...list, items }
}

const patchEntry = (
  data: unknown,
  id: string,
  changes: Partial<Book>,
): unknown => {
  if (isInfiniteList(data)) {
    const pages = data.pages.map((page) => patchList(page, id, changes))

    return pages.every((page, index) => page === data.pages[index])
      ? data
      : { ...data, pages }
  }

  if (isList(data)) {
    return patchList(data, id, changes)
  }

  if (isBook(data)) {
    return data.id === id ? { ...data, ...changes } : data
  }

  return data
}

export const patchBookInCaches = (
  client: QueryClient,
  id: string,
  changes: Partial<Book>,
): BookCacheSnapshot => {
  const snapshot = client.getQueriesData({ queryKey: bookKeys.root })

  client.setQueriesData({ queryKey: bookKeys.root }, (data: unknown) =>
    patchEntry(data, id, changes),
  )

  return snapshot
}

export const restoreBookCaches = (
  client: QueryClient,
  snapshot: BookCacheSnapshot,
): void => {
  snapshot.forEach(([key, data]) => {
    client.setQueryData(key, data)
  })
}
