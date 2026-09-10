import {
  type BookFilters,
  type NormalizedBookFilters,
  bookFiltersSchema,
} from "./filters"
import { type Book, type BookDraft } from "./schema"

export const EMPTY_DRAFT: BookDraft = {
  titre: "",
  auteur: "",
  editeur: "",
  annee: new Date().getFullYear(),
  lu: false,
  favori: false,
  note: null,
}

export const toDraft = (book: Book): BookDraft => ({
  titre: book.titre,
  auteur: book.auteur,
  editeur: book.editeur,
  annee: book.annee,
  lu: book.lu,
  favori: book.favori,
  note: book.note,
})

export const normalizeFilters = (
  filters: BookFilters = {},
): NormalizedBookFilters => bookFiltersSchema.parse(filters)

export const hasActiveFilter = (filters: NormalizedBookFilters): boolean =>
  filters.q !== null || filters.status !== null || filters.favori !== null
