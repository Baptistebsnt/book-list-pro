import { renderHook, waitFor } from "@testing-library/react"
import { HttpResponse, delay, http } from "msw"
import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"
import { type Book, normalizeFilters } from "@/domain/book"
import { type BookPage } from "@/services/api/books"
import { makeBook, makeBookPage } from "@/test/factories"
import { createQueryWrapper } from "@/test/query"
import { bookKeys } from "../keys"
import { useToggleFavorite } from "../mutations"

const BOOK_URL = "http://localhost:3000/books/book-favori"
const BOOKS_URL = "http://localhost:3000/books"

const RESPONSE_DELAY_MS = 50

const listKey = bookKeys.list(normalizeFilters({}))

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const seed = (favori: boolean) => {
  const book = makeBook({
    id: "book-favori",
    titre: "Dune",
    favori,
    version: 3,
  })
  const { client, Wrapper } = createQueryWrapper()

  client.setQueryData(bookKeys.detail(book.id), book)
  client.setQueryData(listKey, makeBookPage({ items: [book] }))

  return { book, client, Wrapper }
}

const favoriteInList = (page: BookPage | undefined) => page?.items[0]?.favori

describe("useToggleFavorite", () => {
  it("flips the book in every cache before the server answers", async () => {
    server.use(
      http.patch(BOOK_URL, async () => {
        await delay(RESPONSE_DELAY_MS)

        return HttpResponse.json(
          makeBook({ id: "book-favori", favori: true, version: 4 }),
        )
      }),
      http.get(BOOKS_URL, () => HttpResponse.json(makeBookPage())),
      http.get(BOOK_URL, () =>
        HttpResponse.json(makeBook({ id: "book-favori", favori: true })),
      ),
    )
    const { book, client, Wrapper } = seed(false)

    const { result } = renderHook(() => useToggleFavorite(), {
      wrapper: Wrapper,
    })

    result.current.mutate({ id: book.id, version: book.version, favori: true })

    await waitFor(() =>
      expect(favoriteInList(client.getQueryData<BookPage>(listKey))).toBe(true),
    )
    expect(client.getQueryData<Book>(bookKeys.detail(book.id))?.favori).toBe(
      true,
    )
    expect(result.current.isPending).toBe(true)
  })

  it("reconciles with the server response once the write succeeds", async () => {
    server.use(
      http.patch(BOOK_URL, () =>
        HttpResponse.json(
          makeBook({ id: "book-favori", favori: true, version: 4 }),
        ),
      ),
      http.get(BOOKS_URL, () => HttpResponse.json(makeBookPage())),
      http.get(BOOK_URL, () =>
        HttpResponse.json(
          makeBook({ id: "book-favori", favori: true, version: 4 }),
        ),
      ),
    )
    const { book, client, Wrapper } = seed(false)

    const { result } = renderHook(() => useToggleFavorite(), {
      wrapper: Wrapper,
    })

    result.current.mutate({ id: book.id, version: book.version, favori: true })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(client.getQueryData<Book>(bookKeys.detail(book.id))?.version).toBe(4)
  })

  it("rolls every cache back when the server refuses the write", async () => {
    server.use(
      http.patch(BOOK_URL, () =>
        HttpResponse.json({ message: "Conflit" }, { status: 409 }),
      ),
      http.get(BOOKS_URL, () => HttpResponse.json(makeBookPage())),
      http.get(BOOK_URL, () =>
        HttpResponse.json(makeBook({ id: "book-favori", favori: false })),
      ),
    )
    const { book, client, Wrapper } = seed(false)

    const { result } = renderHook(() => useToggleFavorite(), {
      wrapper: Wrapper,
    })

    result.current.mutate({ id: book.id, version: book.version, favori: true })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(favoriteInList(client.getQueryData<BookPage>(listKey))).toBe(false)
    expect(client.getQueryData<Book>(bookKeys.detail(book.id))?.favori).toBe(
      false,
    )
  })
})
