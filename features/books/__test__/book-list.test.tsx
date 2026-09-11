import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"
import { type ReactNode, createElement } from "react"
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import { BookListItem } from "@/components/books/book-list-item"
import { DeferredDeletionProvider } from "@/providers/deferred-deletion"
import { SEARCH_DEBOUNCE_MS } from "@/services/query/books"
import { makeBook, makeBookPage } from "@/test/factories"
import { createQueryWrapper } from "@/test/query"
import { BooksList } from "../book-list"

const rowRenders = vi.hoisted(() => ({ count: 0 }))

vi.mock("@/components/ui/toast", () => ({ toast: { show: vi.fn() } }))

vi.mock("@/components/ui/switch", () => ({
  Switch: (props: { accessibilityLabel: string }) =>
    createElement("button", { "aria-label": props.accessibilityLabel }),
}))

vi.mock("@/components/books/read-badge", () => ({
  ReadBadge: ({ lu }: { lu: boolean }) => {
    rowRenders.count += 1

    return createElement("span", null, lu ? "Lu" : "Non lu")
  },
}))

const BOOKS_URL = "http://localhost:3000/books"

const LABEL = "Rechercher un ouvrage par titre ou auteur"

const FONDS = [
  makeBook({ id: "dune", titre: "Dune" }),
  makeBook({ id: "solaris", titre: "Solaris" }),
]

const server = setupServer(
  http.get(BOOKS_URL, ({ request }) => {
    const q = new URL(request.url).searchParams.get("q") ?? ""
    const items = FONDS.filter((book) =>
      book.titre.toLowerCase().includes(q.toLowerCase()),
    )

    return HttpResponse.json(makeBookPage({ items, total: items.length }))
  }),
)

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => {
  server.resetHandlers()
  rowRenders.count = 0
})
afterAll(() => server.close())

const renderList = () => {
  const { Wrapper } = createQueryWrapper()

  const Providers = ({ children }: { children: ReactNode }) => (
    <Wrapper>
      <DeferredDeletionProvider>{children}</DeferredDeletionProvider>
    </Wrapper>
  )

  render(<BooksList />, { wrapper: Providers })
}

describe("BooksList", () => {
  it("memoizes the rows", () => {
    expect((BookListItem as unknown as { $$typeof: symbol }).$$typeof).toBe(
      Symbol.for("react.memo"),
    )
  })

  it("does not render a single row while the term is typed", async () => {
    renderList()
    const row = await screen.findByText("Solaris")
    rowRenders.count = 0

    await userEvent.type(screen.getByLabelText(LABEL), "dun")

    expect(rowRenders.count).toBe(0)
    expect(screen.getByLabelText(LABEL)).toHaveValue("dun")
    expect(screen.getByText("Solaris")).toBe(row)
  })

  it("renders the results once the debounced search lands", async () => {
    renderList()
    await screen.findByText("Solaris")
    rowRenders.count = 0

    await userEvent.type(screen.getByLabelText(LABEL), "dun")

    await waitFor(() => expect(screen.queryByText("Solaris")).toBeNull(), {
      timeout: SEARCH_DEBOUNCE_MS * 4,
    })
    expect(screen.getByText("Dune")).toBeInTheDocument()
    expect(rowRenders.count).toBeGreaterThan(0)
  })
})
