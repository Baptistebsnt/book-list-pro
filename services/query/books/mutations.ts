import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type Book } from "@/domain/book"
import {
  createBook,
  deleteBook,
  patchBook,
  replaceBook,
} from "@/services/api/books"
import {
  type BookCacheSnapshot,
  patchBookInCaches,
  restoreBookCaches,
} from "./cache"
import { invalidateBooks } from "./invalidation"
import { bookKeys } from "./keys"

export const useCreateBook = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: createBook,
    onSuccess: async (book: Book) => {
      client.setQueryData(bookKeys.detail(book.id), book)
      await invalidateBooks(client)
    },
  })
}

export const useReplaceBook = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: replaceBook,
    onSuccess: async (book: Book) => {
      client.setQueryData(bookKeys.detail(book.id), book)
      await invalidateBooks(client, book.id)
    },
  })
}

export const usePatchBook = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: patchBook,
    onSuccess: async (book: Book) => {
      client.setQueryData(bookKeys.detail(book.id), book)
      await invalidateBooks(client, book.id)
    },
  })
}

export type FavoriteChange = {
  id: string
  version: number
  favori: boolean
}

type FavoriteContext = {
  snapshot: BookCacheSnapshot
}

export const useToggleFavorite = () => {
  const client = useQueryClient()

  return useMutation<Book, Error, FavoriteChange, FavoriteContext>({
    mutationFn: ({ id, version, favori }: FavoriteChange) =>
      patchBook({ id, version, changes: { favori } }),

    onMutate: async ({ id, favori }: FavoriteChange) => {
      await client.cancelQueries({ queryKey: bookKeys.root })

      return { snapshot: patchBookInCaches(client, id, { favori }) }
    },

    onError: (
      error: Error,
      variables: FavoriteChange,
      context: FavoriteContext | undefined,
    ) => {
      if (context) {
        restoreBookCaches(client, context.snapshot)
      }
    },

    onSuccess: (book: Book) => {
      patchBookInCaches(client, book.id, book)
    },

    onSettled: async (
      book: Book | undefined,
      error: Error | null,
      variables: FavoriteChange,
    ) => {
      await invalidateBooks(client, variables.id)
    },
  })
}

export type ReadStatusToggle = {
  id: string
  version: number
  lu: boolean
}

type ReadStatusContext = {
  snapshot: BookCacheSnapshot
}

export const useToggleReadStatus = () => {
  const client = useQueryClient()

  return useMutation<Book, Error, ReadStatusToggle, ReadStatusContext>({
    mutationFn: ({ id, version, lu }: ReadStatusToggle) =>
      patchBook({ id, version, changes: { lu } }),

    onMutate: async ({ id, lu }: ReadStatusToggle) => {
      await client.cancelQueries({ queryKey: bookKeys.root })

      return { snapshot: patchBookInCaches(client, id, { lu }) }
    },

    onError: (
      error: Error,
      variables: ReadStatusToggle,
      context: ReadStatusContext | undefined,
    ) => {
      if (context) {
        restoreBookCaches(client, context.snapshot)
      }
    },

    onSuccess: (book: Book) => {
      patchBookInCaches(client, book.id, book)
    },

    onSettled: async (
      book: Book | undefined,
      error: Error | null,
      variables: ReadStatusToggle,
    ) => {
      await invalidateBooks(client, variables.id)
    },
  })
}

export const useDeleteBook = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: async (result: void, id: string) => {
      client.removeQueries({ queryKey: bookKeys.detail(id) })
      await invalidateBooks(client)
    },
  })
}
