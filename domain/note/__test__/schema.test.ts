import { describe, expect, it } from "vitest"
import { noteDraftSchema, noteSchema } from "../schema"

const validNote = {
  id: "note-1",
  livreId: "book-1",
  contenu: "Un chef-d'œuvre intemporel.",
  createdAt: "2024-01-01T00:00:00.000Z",
}

describe("noteSchema", () => {
  it("accepts a well-formed note", () => {
    expect(noteSchema.safeParse(validNote).success).toBe(true)
  })

  it("rejects an empty id", () => {
    expect(noteSchema.safeParse({ ...validNote, id: "" }).success).toBe(false)
  })

  it("rejects a missing book reference", () => {
    expect(noteSchema.safeParse({ ...validNote, livreId: "" }).success).toBe(
      false,
    )
  })

  it("rejects an empty content", () => {
    expect(noteSchema.safeParse({ ...validNote, contenu: "" }).success).toBe(
      false,
    )
  })

  it("rejects a non-string createdAt", () => {
    expect(noteSchema.safeParse({ ...validNote, createdAt: 42 }).success).toBe(
      false,
    )
  })
})

describe("noteDraftSchema", () => {
  it("accepts a non-empty content", () => {
    expect(noteDraftSchema.safeParse({ contenu: "Très bon." }).success).toBe(
      true,
    )
  })

  it("trims the content", () => {
    expect(noteDraftSchema.parse({ contenu: "  À lire  " }).contenu).toBe(
      "À lire",
    )
  })

  it("rejects a blank content", () => {
    expect(noteDraftSchema.safeParse({ contenu: "   " }).success).toBe(false)
  })
})
