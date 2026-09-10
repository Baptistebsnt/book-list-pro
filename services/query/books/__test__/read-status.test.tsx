import { act, renderHook, waitFor } from "@testing-library/react"
import { HttpResponse, delay, http } from "msw"
import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"
import { type Book, normalizeFilters } from "@/domain/book"
import { type BookPage } from "@/services/api/books"
import { makeBook, makeBookPage } from "@/test/factories"
import { createQueryWrapper } from "@/test/query"
import { bookKeys } from "../keys"
import { useToggleReadStatus } from "../mutations"

const PATCH_URL = "http://localhost:3000/books/book-1"

const listKey = bookKeys.list(normalizeFilters())
const detailKey = bookKeys.detail("book-1")

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const seed = () => {
  const book = makeBook({ id: "book-1", lu: false, version: 1 })
  const { client, Wrapper } = createQueryWrapper()
  client.setQueryData(detailKey, book)
  client.setQueryData(listKey, makeBookPage({ items: [book] }))

  return { book, client, Wrapper }
}

const detailLu = (client: ReturnType<typeof seed>["client"]) =>
  client.getQueryData<Book>(detailKey)?.lu

const listLu = (client: ReturnType<typeof seed>["client"]) =>
  client.getQueryData<BookPage>(listKey)?.items[0]?.lu

describe("useToggleReadStatus", () => {
  it("updates the cache optimistically before the server answers", async () => {
    server.use(
      http.patch(PATCH_URL, async () => {
        await delay(50)

        return HttpResponse.json(
          makeBook({ id: "book-1", lu: true, version: 2 }),
        )
      }),
    )
    const { client, Wrapper } = seed()

    const { result } = renderHook(() => useToggleReadStatus(), {
      wrapper: Wrapper,
    })

    act(() => {
      result.current.mutate({ id: "book-1", version: 1, lu: true })
    })

    await waitFor(() => expect(detailLu(client)).toBe(true))
    expect(result.current.isSuccess).toBe(false)
    expect(listLu(client)).toBe(true)
  })

  it("keeps the list and the detail consistent, then reconciles on success", async () => {
    server.use(
      http.patch(PATCH_URL, () =>
        HttpResponse.json(makeBook({ id: "book-1", lu: true, version: 2 })),
      ),
    )
    const { client, Wrapper } = seed()

    const { result } = renderHook(() => useToggleReadStatus(), {
      wrapper: Wrapper,
    })

    act(() => {
      result.current.mutate({ id: "book-1", version: 1, lu: true })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(detailLu(client)).toBe(true)
    expect(listLu(client)).toBe(true)
    expect(client.getQueryData<Book>(detailKey)?.version).toBe(2)
  })

  it("rolls back the cache when the server rejects the write", async () => {
    server.use(
      http.patch(PATCH_URL, () => new HttpResponse(null, { status: 500 })),
    )
    const { client, Wrapper } = seed()

    const { result } = renderHook(() => useToggleReadStatus(), {
      wrapper: Wrapper,
    })

    act(() => {
      result.current.mutate({ id: "book-1", version: 1, lu: true })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(detailLu(client)).toBe(false)
    expect(listLu(client)).toBe(false)
  })
})
