import { renderHook, waitFor } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"
import { makeBook } from "@/test/factories"
import { createQueryWrapper } from "@/test/query"
import { useBooks, useInfiniteBooks } from "./queries"

const BOOKS_URL = "http://localhost:3000/books"

const pageResponse = (page: number, totalPages: number) =>
  HttpResponse.json({
    items: [makeBook({ id: `book-page-${page}`, titre: `Page ${page}` })],
    page,
    limit: 20,
    total: totalPages,
    totalPages,
  })

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("useBooks", () => {
  it("returns the first page of results", async () => {
    server.use(http.get(BOOKS_URL, () => pageResponse(1, 1)))
    const { Wrapper } = createQueryWrapper()

    const { result } = renderHook(() => useBooks(), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.items).toHaveLength(1)
    expect(result.current.data?.items[0]?.titre).toBe("Page 1")
  })

  it("forwards the search query as a request param", async () => {
    let receivedQuery: string | null = null
    server.use(
      http.get(BOOKS_URL, ({ request }) => {
        receivedQuery = new URL(request.url).searchParams.get("q")

        return pageResponse(1, 1)
      }),
    )
    const { Wrapper } = createQueryWrapper()

    const { result } = renderHook(() => useBooks({ q: "orwell" }), {
      wrapper: Wrapper,
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(receivedQuery).toBe("orwell")
  })

  it("surfaces a contract error when the payload is malformed", async () => {
    server.use(http.get(BOOKS_URL, () => HttpResponse.json({ items: "nope" })))
    const { Wrapper } = createQueryWrapper()

    const { result } = renderHook(() => useBooks(), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe("useInfiniteBooks", () => {
  it("paginates across pages with fetchNextPage", async () => {
    server.use(
      http.get(BOOKS_URL, ({ request }) => {
        const page = Number(new URL(request.url).searchParams.get("page") ?? 1)

        return pageResponse(page, 2)
      }),
    )
    const { Wrapper } = createQueryWrapper()

    const { result } = renderHook(() => useInfiniteBooks(), {
      wrapper: Wrapper,
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.pages).toHaveLength(1)
    expect(result.current.hasNextPage).toBe(true)

    void result.current.fetchNextPage()

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2))
    expect(result.current.data?.pages[1]?.page).toBe(2)
    expect(result.current.hasNextPage).toBe(false)
  })
})
