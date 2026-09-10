import { describe, expect, it } from "vitest"
import { MAX_RATING, MIN_YEAR, bookDraftSchema, bookSchema } from "./schema"

const validBook = {
  id: "book-1",
  titre: "Le Petit Prince",
  auteur: "Antoine de Saint-Exupéry",
  editeur: "Gallimard",
  annee: 1943,
  lu: true,
  favori: false,
  note: 5,
  couverture: null,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-02T00:00:00.000Z",
  version: 3,
}

describe("bookSchema", () => {
  it("accepts a well-formed book", () => {
    const result = bookSchema.safeParse(validBook)

    expect(result.success).toBe(true)
  })

  it("rejects an empty id", () => {
    const result = bookSchema.safeParse({ ...validBook, id: "" })

    expect(result.success).toBe(false)
  })

  it("rejects a note above the maximum rating", () => {
    const result = bookSchema.safeParse({
      ...validBook,
      note: MAX_RATING + 1,
    })

    expect(result.success).toBe(false)
  })

  it("allows a null note and a null cover", () => {
    const result = bookSchema.safeParse({
      ...validBook,
      note: null,
      couverture: null,
    })

    expect(result.success).toBe(true)
  })

  it("rejects a negative version", () => {
    const result = bookSchema.safeParse({ ...validBook, version: -1 })

    expect(result.success).toBe(false)
  })
})

describe("bookDraftSchema", () => {
  const validDraft = {
    titre: "1984",
    auteur: "George Orwell",
    editeur: "Secker & Warburg",
    annee: 1949,
    lu: false,
    favori: false,
    note: null,
  }

  it("accepts a well-formed draft", () => {
    const result = bookDraftSchema.safeParse(validDraft)

    expect(result.success).toBe(true)
  })

  it("trims whitespace-padded text fields", () => {
    const result = bookDraftSchema.parse({
      ...validDraft,
      titre: "  Dune  ",
      auteur: "  Frank Herbert  ",
    })

    expect(result.titre).toBe("Dune")
    expect(result.auteur).toBe("Frank Herbert")
  })

  it("rejects a blank title", () => {
    const result = bookDraftSchema.safeParse({ ...validDraft, titre: "   " })

    expect(result.success).toBe(false)
  })

  it("accepts a numeric year", () => {
    const result = bookDraftSchema.parse({ ...validDraft, annee: 1988 })

    expect(result.annee).toBe(1988)
  })

  it("rejects a year before the minimum year", () => {
    const result = bookDraftSchema.safeParse({
      ...validDraft,
      annee: MIN_YEAR - 1,
    })

    expect(result.success).toBe(false)
  })

  it("rejects a year too far in the future", () => {
    const result = bookDraftSchema.safeParse({
      ...validDraft,
      annee: new Date().getFullYear() + 2,
    })

    expect(result.success).toBe(false)
  })

  it("rejects a non-integer year", () => {
    const result = bookDraftSchema.safeParse({ ...validDraft, annee: 1990.5 })

    expect(result.success).toBe(false)
  })

  it("rejects a year passed as a string", () => {
    const result = bookDraftSchema.safeParse({ ...validDraft, annee: "1988" })

    expect(result.success).toBe(false)
  })
})
