import {
  type Book,
  type BookDraft,
  type NormalizedBookFilters,
  bookSchema,
} from "@/domain/book"
import { type Page, pageSchemaOf } from "@/domain/pagination"
import { apiClient } from "./client"
import { parseResponse } from "./validate"

const bookPageSchema = pageSchemaOf(bookSchema)

export type BookPage = Page<Book>

const versionHeaders = (version: number): Record<string, string> => ({
  "If-Match": String(version),
})

const listParams = (
  filters: NormalizedBookFilters,
): Record<string, string | number | boolean> => {
  const params: Record<string, string | number | boolean> = {
    page: filters.page,
    limit: filters.limit,
    sort: filters.sort,
    order: filters.order,
  }

  if (filters.q !== null) {
    params.q = filters.q
  }

  if (filters.status !== null) {
    params.status = filters.status
  }

  if (filters.favori !== null) {
    params.favori = filters.favori
  }

  return params
}

export const listBooks = async (
  filters: NormalizedBookFilters,
): Promise<BookPage> => {
  const data = await apiClient.get<unknown>("/books", {
    params: listParams(filters),
  })

  return parseResponse(bookPageSchema, data, "GET /books")
}

export const getBook = async (id: string): Promise<Book> => {
  const data = await apiClient.get<unknown>(`/books/${id}`)

  return parseResponse(bookSchema, data, "GET /books/:id")
}

export const createBook = async (draft: BookDraft): Promise<Book> => {
  const data = await apiClient.post<unknown>("/books", draft)

  return parseResponse(bookSchema, data, "POST /books")
}

export type BookReplacement = {
  id: string
  version: number
  draft: BookDraft
}

export const replaceBook = async (input: BookReplacement): Promise<Book> => {
  const data = await apiClient.put<unknown>(`/books/${input.id}`, input.draft, {
    headers: versionHeaders(input.version),
  })

  return parseResponse(bookSchema, data, "PUT /books/:id")
}

export type BookPatch = {
  id: string
  version: number
  changes: Partial<BookDraft>
}

export const patchBook = async (input: BookPatch): Promise<Book> => {
  const data = await apiClient.patch<unknown>(
    `/books/${input.id}`,
    input.changes,
    { headers: versionHeaders(input.version) },
  )

  return parseResponse(bookSchema, data, "PATCH /books/:id")
}

export const deleteBook = async (id: string): Promise<void> => {
  await apiClient.delete(`/books/${id}`)
}
