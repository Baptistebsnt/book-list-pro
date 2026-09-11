import { act, renderHook, waitFor } from "@testing-library/react"
import { HttpResponse, delay, http } from "msw"
import { setupServer } from "msw/node"
import { type ReactNode } from "react"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"
import { normalizeFilters } from "@/domain/book"
import { makeBook, makeBookPage } from "@/test/factories"
import { createQueryWrapper } from "@/test/query"
import { useBookBrowse } from "../browse"
import { bookKeys } from "../keys"
import { BookSearchProvider, SEARCH_DEBOUNCE_MS } from "../search"

const BOOKS_URL = "http://localhost:3000/books"

const SERVER_DELAY_MS = 100

const server = setupServer()

const createBrowseWrapper = () => {
  const { client, Wrapper } = createQueryWrapper()

  const BrowseWrapper = ({ children }: { children: ReactNode }) => (
    <Wrapper>
      <BookSearchProvider>{children}</BookSearchProvider>
    </Wrapper>
  )

  return { client, Wrapper: BrowseWrapper }
}

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

describe("useBookBrowse", () => {
  it("sends a single request for a burst of keystrokes", async () => {
    const queries: string[] = []
    server.use(
      http.get(BOOKS_URL, ({ request }) => {
        queries.push(queryOf(request))

        return HttpResponse.json(makeBookPage())
      }),
    )
    const { Wrapper } = createBrowseWrapper()

    const { result } = renderHook(() => useBookBrowse(), { wrapper: Wrapper })

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
    const { client, Wrapper } = createBrowseWrapper()

    const { result } = renderHook(() => useBookBrowse(), { wrapper: Wrapper })

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
    const { Wrapper } = createBrowseWrapper()

    const { result } = renderHook(() => useBookBrowse(), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.query.isSuccess).toBe(true))
    expect(result.current.isReloading).toBe(false)

    type(result.current.setTerm, "dune")

    expect(result.current.isReloading).toBe(true)
    expect(result.current.query.status).toBe("success")
  })
})

describe("useBookBrowse filters", () => {
  it("hands the filters and the sort to the server", async () => {
    const requests: URLSearchParams[] = []
    server.use(
      http.get(BOOKS_URL, ({ request }) => {
        requests.push(new URL(request.url).searchParams)

        return HttpResponse.json(makeBookPage())
      }),
    )
    const { Wrapper } = createBrowseWrapper()

    const { result } = renderHook(() => useBookBrowse(), { wrapper: Wrapper })

    await waitFor(() => expect(requests).toHaveLength(1))

    act(() => {
      result.current.apply({ status: "lu", favori: true, sort: "annee" })
    })

    await waitFor(() => expect(requests).toHaveLength(2))

    const [, sent] = requests

    expect(sent.get("status")).toBe("lu")
    expect(sent.get("favori")).toBe("true")
    expect(sent.get("sort")).toBe("annee")
    expect(sent.get("order")).toBe("asc")
  })

  it("starts the pagination again when a filter changes", async () => {
    const pages: string[] = []
    server.use(
      http.get(BOOKS_URL, ({ request }) => {
        const params = new URL(request.url).searchParams
        const page = Number(params.get("page") ?? 1)

        pages.push(`${params.get("status") ?? "tous"}:${page}`)

        return HttpResponse.json(
          makeBookPage({ page, total: 40, totalPages: 2 }),
        )
      }),
    )
    const { Wrapper } = createBrowseWrapper()

    const { result } = renderHook(() => useBookBrowse(), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.query.isSuccess).toBe(true))

    act(() => {
      void result.current.query.fetchNextPage()
    })

    await waitFor(() => expect(pages).toEqual(["tous:1", "tous:2"]))

    act(() => {
      result.current.apply({ status: "nonlu" })
    })

    await waitFor(() => expect(pages).toEqual(["tous:1", "tous:2", "nonlu:1"]))
    expect(result.current.query.data?.pages).toHaveLength(1)
  })
})
