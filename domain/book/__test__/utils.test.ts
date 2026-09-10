import { describe, expect, it } from "vitest"
import { bookFiltersSchema } from "../filters"
import { type Book } from "../schema"
import {
  EMPTY_DRAFT,
  diffDraft,
  hasActiveFilter,
  normalizeFilters,
  toDraft,
} from "../utils"

const book: Book = {
  id: "book-1",
  titre: "Fahrenheit 451",
  auteur: "Ray Bradbury",
  editeur: "Ballantine Books",
  annee: 1953,
  lu: true,
  favori: true,
  note: 4,
  couverture: null,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-02T00:00:00.000Z",
  version: 1,
}

describe("EMPTY_DRAFT", () => {
  it("defaults the year to the current year", () => {
    expect(EMPTY_DRAFT.annee).toBe(new Date().getFullYear())
  })
})

describe("toDraft", () => {
  it("keeps only the editable fields of a book", () => {
    expect(toDraft(book)).toEqual({
      titre: "Fahrenheit 451",
      auteur: "Ray Bradbury",
      editeur: "Ballantine Books",
      annee: 1953,
      lu: true,
      favori: true,
      note: 4,
    })
  })
})

describe("diffDraft", () => {
  it("returns an empty object when nothing changed", () => {
    const draft = toDraft(book)

    expect(diffDraft(draft, draft)).toEqual({})
  })

  it("returns only the fields that changed", () => {
    const original = toDraft(book)
    const next = { ...original, titre: "New title", lu: false }

    expect(diffDraft(original, next)).toEqual({ titre: "New title", lu: false })
  })
})

describe("normalizeFilters", () => {
  it("produces the same output as the schema", () => {
    expect(normalizeFilters({ q: "  orwell  " })).toEqual(
      bookFiltersSchema.parse({ q: "  orwell  " }),
    )
  })
})

describe("hasActiveFilter", () => {
  it("is false when no filter is set", () => {
    expect(hasActiveFilter(normalizeFilters())).toBe(false)
  })

  it("is true when a query is set", () => {
    expect(hasActiveFilter(normalizeFilters({ q: "dune" }))).toBe(true)
  })

  it("is true when a status is set", () => {
    expect(hasActiveFilter(normalizeFilters({ status: "lu" }))).toBe(true)
  })

  it("is true when the favourite flag is set", () => {
    expect(hasActiveFilter(normalizeFilters({ favori: true }))).toBe(true)
  })
})
