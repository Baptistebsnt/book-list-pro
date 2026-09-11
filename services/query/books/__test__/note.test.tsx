import { act, renderHook, waitFor } from "@testing-library/react"
import { HttpResponse, delay, http } from "msw"
import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"
import { type Book, normalizeFilters } from "@/domain/book"
import { type BookPage } from "@/services/api/books"
import { makeBook, makeBookPage } from "@/test/factories"
import { createQueryWrapper } from "@/test/query"
import { bookKeys } from "../keys"
import { useSetNote } from "../mutations"

const PATCH_URL = "http://localhost:3000/books/book-1"

const listKey = bookKeys.list(normalizeFilters())
const detailKey = bookKeys.detail("book-1")

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const seed = (note: number | null = null) => {
  const book = makeBook({ id: "book-1", note, version: 1 })
  const { client, Wrapper } = createQueryWrapper()
  client.setQueryData(detailKey, book)
  client.setQueryData(listKey, makeBookPage({ items: [book] }))

  return { book, client, Wrapper }
}

const detailNote = (client: ReturnType<typeof seed>["client"]) =>
  client.getQueryData<Book>(detailKey)?.note

const listNote = (client: ReturnType<typeof seed>["client"]) =>
  client.getQueryData<BookPage>(listKey)?.items[0]?.note

describe("useSetNote", () => {
  it("updates the cache optimistically before the server answers", async () => {
    server.use(
      http.patch(PATCH_URL, async () => {
        await delay(50)

        return HttpResponse.json(
          makeBook({ id: "book-1", note: 4, version: 2 }),
        )
      }),
    )
    const { client, Wrapper } = seed(null)

    const { result } = renderHook(() => useSetNote(), { wrapper: Wrapper })

    act(() => {
      result.current.mutate({ id: "book-1", version: 1, note: 4 })
    })

    await waitFor(() => expect(detailNote(client)).toBe(4))
    expect(result.current.isSuccess).toBe(false)
    expect(listNote(client)).toBe(4)
  })

  it("distinguishes an explicit 0 from an unrated null", async () => {
    server.use(
      http.patch(PATCH_URL, () =>
        HttpResponse.json(makeBook({ id: "book-1", note: 0, version: 2 })),
      ),
    )
    const { client, Wrapper } = seed(1)

    const { result } = renderHook(() => useSetNote(), { wrapper: Wrapper })

    act(() => {
      result.current.mutate({ id: "book-1", version: 1, note: 0 })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(detailNote(client)).toBe(0)
    expect(listNote(client)).toBe(0)
  })

  it("rolls back the cache when the server rejects the write", async () => {
    server.use(
      http.patch(PATCH_URL, () => new HttpResponse(null, { status: 409 })),
    )
    const { client, Wrapper } = seed(2)

    const { result } = renderHook(() => useSetNote(), { wrapper: Wrapper })

    act(() => {
      result.current.mutate({ id: "book-1", version: 1, note: 5 })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(detailNote(client)).toBe(2)
    expect(listNote(client)).toBe(2)
  })
})
