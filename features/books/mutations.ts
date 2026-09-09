import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type Book } from "@/domain/book"
import {
  createBook,
  deleteBook,
  patchBook,
  replaceBook,
} from "@/services/api/books"
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

export const useDeleteBook = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: async (result: null, id: string) => {
      client.removeQueries({ queryKey: bookKeys.detail(id) })
      await invalidateBooks(client)
    },
  })
}
