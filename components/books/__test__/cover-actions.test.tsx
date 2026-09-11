import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import { CoverActions } from "@/components/books/cover-actions"
import { toast } from "@/components/ui/toast"
import { type CoverPick } from "@/services/media/cover-image"
import { makeBook } from "@/test/factories"
import { createQueryWrapper } from "@/test/query"

const picked = vi.hoisted(
  () =>
    ({
      status: "picked",
      image: {
        dataUrl: "data:image/png;base64,aW1hZ2U=",
        mimeType: "image/png",
        width: 1024,
        height: 768,
      },
    }) satisfies CoverPick,
)

const pick = vi.hoisted(() => ({ result: null as CoverPick | null }))

const pickResult = (): CoverPick => pick.result ?? { status: "cancelled" }

vi.mock("@/components/ui/toast", () => ({ toast: { show: vi.fn() } }))

vi.mock("@/services/media/image-picker", () => ({
  canPickCoverImage: () => true,
  pickCoverImage: () => Promise.resolve(pickResult()),
}))

const COVER_URL = "http://localhost:3000/books/book-1/cover"

const REPLACE = "Remplacer la couverture"

const RESTORE = "Couverture d'origine"

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
beforeEach(() => {
  pick.result = picked
})
afterEach(() => {
  server.resetHandlers()
  vi.clearAllMocks()
})
afterAll(() => server.close())

const renderActions = (couverture: string | null = "/covers/book-1.svg") => {
  const book = makeBook({ id: "book-1", titre: "Dune", couverture })
  const { Wrapper } = createQueryWrapper()

  render(<CoverActions book={book} />, { wrapper: Wrapper })
}

const shown = () => vi.mocked(toast.show).mock.calls[0]?.[0]

describe("CoverActions", () => {
  it("names the accepted formats when the API refuses the file", async () => {
    server.use(
      http.post(COVER_URL, () => new HttpResponse(null, { status: 415 })),
    )
    renderActions()

    await userEvent.click(screen.getByText(REPLACE))

    await waitFor(() => expect(toast.show).toHaveBeenCalled())
    expect(shown()).toBe(
      "Format refusé : choisissez une image PNG, JPEG ou WebP.",
    )
  })

  it("asks for a lighter image when the API refuses its weight", async () => {
    server.use(
      http.post(COVER_URL, () => new HttpResponse(null, { status: 413 })),
    )
    renderActions()

    await userEvent.click(screen.getByText(REPLACE))

    await waitFor(() => expect(toast.show).toHaveBeenCalled())
    expect(shown()).toContain("trop lourde")
  })

  it("keeps any other refusal on a generic message", async () => {
    server.use(
      http.post(COVER_URL, () => new HttpResponse(null, { status: 500 })),
    )
    renderActions()

    await userEvent.click(screen.getByText(REPLACE))

    await waitFor(() => expect(toast.show).toHaveBeenCalled())
    expect(shown()).toBe(
      "Impossible d'envoyer cette couverture. Réessayez plus tard.",
    )
  })

  it("sends nothing when the librarian closes the file dialog", async () => {
    pick.result = { status: "cancelled" }
    renderActions()

    await userEvent.click(screen.getByText(REPLACE))

    expect(toast.show).not.toHaveBeenCalled()
  })

  it("brings the original cover back", async () => {
    let deleted = false
    server.use(
      http.delete(COVER_URL, () => {
        deleted = true

        return new HttpResponse(null, { status: 204 })
      }),
    )
    renderActions()

    await userEvent.click(screen.getByText(RESTORE))

    await waitFor(() => expect(deleted).toBe(true))
    expect(shown()).toBe("Couverture d'origine rétablie.")
  })

  it("offers nothing to restore on a book without cover", () => {
    renderActions(null)

    expect(screen.queryByText(RESTORE)).toBeNull()
  })
})
