import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type Book, type BookDraft } from "@/domain/book"
import {
  createBook,
  deleteBook,
  patchBook,
  replaceBook,
} from "@/services/api/books"
import { restoreCover, uploadCover } from "@/services/api/covers"
import { type CoverImage } from "@/services/media/cover-image"
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

type PatchInput = {
  id: string
  version: number
}

type OptimisticContext = {
  snapshot: BookCacheSnapshot
}

const useOptimisticFieldPatch = <TInput extends PatchInput>(
  toChanges: (input: TInput) => Partial<BookDraft>,
) => {
  const client = useQueryClient()

  return useMutation<Book, Error, TInput, OptimisticContext>({
    mutationFn: (input: TInput) =>
      patchBook({
        id: input.id,
        version: input.version,
        changes: toChanges(input),
      }),

    onMutate: async (input: TInput) => {
      await client.cancelQueries({ queryKey: bookKeys.root })

      return { snapshot: patchBookInCaches(client, input.id, toChanges(input)) }
    },

    onError: (
      error: Error,
      input: TInput,
      context: OptimisticContext | undefined,
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
      input: TInput,
    ) => {
      await invalidateBooks(client, input.id)
    },
  })
}

export type FavoriteChange = PatchInput & {
  favori: boolean
}

export const useToggleFavorite = () =>
  useOptimisticFieldPatch<FavoriteChange>(({ favori }) => ({ favori }))

export type ReadStatusToggle = PatchInput & {
  lu: boolean
}

export const useToggleReadStatus = () =>
  useOptimisticFieldPatch<ReadStatusToggle>(({ lu }) => ({ lu }))

export type NoteChange = PatchInput & {
  note: number | null
}

export const useSetNote = () =>
  useOptimisticFieldPatch<NoteChange>(({ note }) => ({ note }))

export const useReplaceCover = (bookId: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (image: CoverImage) => uploadCover(bookId, image),
    onSuccess: () => invalidateBooks(client, bookId),
  })
}

export const useRestoreCover = (bookId: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: () => restoreCover(bookId),
    onSuccess: () => invalidateBooks(client, bookId),
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
