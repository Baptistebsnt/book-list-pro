import { act, renderHook, waitFor } from "@testing-library/react"
import { HttpResponse, delay, http } from "msw"
import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"
import { normalizeFilters } from "@/domain/book"
import { makeBook, makeBookPage } from "@/test/factories"
import { createQueryWrapper } from "@/test/query"
import { bookKeys } from "../keys"
import { SEARCH_DEBOUNCE_MS, useBookSearch } from "../search"

const BOOKS_URL = "http://localhost:3000/books"

const SERVER_DELAY_MS = 100

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const queryOf = (request: Request): string =>
  new URL(request.url).searchParams.get("q") ?? ""

const type = (setTerm: (value: string) => void, term: string) => {
  act(() => {
    setTerm(term)
  })
}

describe("useBookSearch", () => {
  it("sends a single request for a burst of keystrokes", async () => {
    const queries: string[] = []
    server.use(
      http.get(BOOKS_URL, ({ request }) => {
        queries.push(queryOf(request))

        return HttpResponse.json(makeBookPage())
      }),
    )
    const { Wrapper } = createQueryWrapper()

    const { result } = renderHook(() => useBookSearch(), { wrapper: Wrapper })

    await waitFor(() => expect(queries).toEqual([""]))

    type(result.current.setTerm, "d")
    type(result.current.setTerm, "du")
    type(result.current.setTerm, "dun")
    type(result.current.setTerm, "dune")

    await waitFor(() => expect(result.current.searchedTerm).toBe("dune"), {
      timeout: SEARCH_DEBOUNCE_MS * 4,
    })
    await waitFor(() => expect(queries).toEqual(["", "dune"]))
  })

  it("drops the request still in flight instead of caching its answer", async () => {
    server.use(
      http.get(BOOKS_URL, async ({ request }) => {
        const q = queryOf(request)

        if (q.length === 0) {
          await delay(SERVER_DELAY_MS)
        }

        return HttpResponse.json(
          makeBookPage({ items: [makeBook({ titre: `Réponse ${q}` })] }),
        )
      }),
    )
    const { client, Wrapper } = createQueryWrapper()

    const { result } = renderHook(() => useBookSearch(), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.query.isFetching).toBe(true))

    type(result.current.setTerm, "dune")

    await waitFor(
      () =>
        expect(result.current.query.data?.pages[0]?.items[0]?.titre).toBe(
          "Réponse dune",
        ),
      { timeout: SEARCH_DEBOUNCE_MS * 4 },
    )
    expect(
      client.getQueryData(bookKeys.infiniteList(normalizeFilters({}))),
    ).toBeUndefined()
  })

  it("reports a search in progress without falling back to the initial load", async () => {
    server.use(
      http.get(BOOKS_URL, async () => {
        await delay(SERVER_DELAY_MS)

        return HttpResponse.json(makeBookPage())
      }),
    )
    const { Wrapper } = createQueryWrapper()

    const { result } = renderHook(() => useBookSearch(), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.query.isSuccess).toBe(true))
    expect(result.current.isSearching).toBe(false)

    type(result.current.setTerm, "dune")

    expect(result.current.isSearching).toBe(true)
    expect(result.current.query.status).toBe("success")
  })
})
