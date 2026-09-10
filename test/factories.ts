import { type Book } from "@/domain/book"
import { type Note } from "@/domain/note"
import { type BookPage } from "@/services/api/books"

let sequence = 0

export const makeBook = (overrides: Partial<Book> = {}): Book => {
  sequence += 1

  return {
    id: `book-${sequence}`,
    titre: `Book ${sequence}`,
    auteur: "Author",
    editeur: "Publisher",
    annee: 2000,
    lu: false,
    favori: false,
    note: null,
    couverture: null,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    version: 1,
    ...overrides,
  }
}

export const makeNote = (overrides: Partial<Note> = {}): Note => {
  sequence += 1

  return {
    id: `note-${sequence}`,
    livreId: "book-1",
    contenu: `Note ${sequence}`,
    createdAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  }
}

export const makeBookPage = (overrides: Partial<BookPage> = {}): BookPage => {
  const items = overrides.items ?? [makeBook()]

  return {
    items,
    page: 1,
    limit: 20,
    total: items.length,
    totalPages: 1,
    ...overrides,
  }
}
