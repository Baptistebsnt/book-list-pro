import { z } from "zod"
import { type Book, type BookDraft, bookSchema } from "@/domain/book"
import { type NormalizedBookFilters } from "@/domain/book-filters"
import { type Page, pageSchemaOf } from "@/domain/pagination"
import { apiRequest } from "./client"

const bookPageSchema = pageSchemaOf(bookSchema)

const noContentSchema = z.null()

export type BookPage = Page<Book>

export const listBooks = (
  filters: NormalizedBookFilters,
  signal?: AbortSignal,
): Promise<BookPage> =>
  apiRequest({
    path: "/books",
    schema: bookPageSchema,
    params: {
      page: filters.page,
      limit: filters.limit,
      q: filters.q,
      status: filters.status,
      favori: filters.favori,
      sort: filters.sort,
      order: filters.order,
    },
    signal,
  })

export const getBook = (id: string, signal?: AbortSignal): Promise<Book> =>
  apiRequest({ path: `/books/${id}`, schema: bookSchema, signal })

export const createBook = (draft: BookDraft): Promise<Book> =>
  apiRequest({
    path: "/books",
    method: "POST",
    body: draft,
    schema: bookSchema,
  })

export type BookReplacement = {
  id: string
  version: number
  draft: BookDraft
}

/** PUT: full representation, guarded by If-Match (409 when stale). */
export const replaceBook = (input: BookReplacement): Promise<Book> =>
  apiRequest({
    path: `/books/${input.id}`,
    method: "PUT",
    body: input.draft,
    version: input.version,
    schema: bookSchema,
  })

export type BookPatch = {
  id: string
  version: number
  changes: Partial<BookDraft>
}

/** PATCH: partial update, used by the read and favourite toggles. */
export const patchBook = (input: BookPatch): Promise<Book> =>
  apiRequest({
    path: `/books/${input.id}`,
    method: "PATCH",
    body: input.changes,
    version: input.version,
    schema: bookSchema,
  })

export const deleteBook = (id: string): Promise<null> =>
  apiRequest({
    path: `/books/${id}`,
    method: "DELETE",
    schema: noContentSchema,
  })
