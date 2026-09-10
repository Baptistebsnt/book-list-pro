import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"
import { createElement } from "react"
import { Alert } from "react-native"
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import { makeBook } from "@/test/factories"
import { createQueryWrapper } from "@/test/query"
import { ReadToggle } from "../read-toggle"

vi.mock("@/components/ui/switch", () => ({
  Switch: (props: {
    checked: boolean
    disabled?: boolean
    accessibilityLabel: string
    onCheckedChange: (value: boolean) => void
  }) =>
    createElement("button", {
      "aria-label": props.accessibilityLabel,
      disabled: props.disabled,
      onClick: () => props.onCheckedChange(!props.checked),
    }),
}))

const PATCH_URL = "http://localhost:3000/books/book-1"

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => {
  server.resetHandlers()
  vi.restoreAllMocks()
})
afterAll(() => server.close())

const renderToggle = () => {
  const book = makeBook({ id: "book-1", titre: "Dune", lu: false, version: 1 })
  const { Wrapper } = createQueryWrapper()

  render(<ReadToggle book={book} />, { wrapper: Wrapper })

  return { book }
}

describe("ReadToggle", () => {
  it("patches the book when toggled", async () => {
    let patched = false
    server.use(
      http.patch(PATCH_URL, () => {
        patched = true

        return HttpResponse.json(
          makeBook({ id: "book-1", lu: true, version: 2 }),
        )
      }),
    )
    renderToggle()

    fireEvent.click(screen.getByRole("button"))

    await waitFor(() => expect(patched).toBe(true))
  })

  it("signals the user when the write fails", async () => {
    const alert = vi.spyOn(Alert, "alert").mockImplementation(() => null)
    server.use(
      http.patch(PATCH_URL, () => new HttpResponse(null, { status: 500 })),
    )
    renderToggle()

    fireEvent.click(screen.getByRole("button"))

    await waitFor(() => expect(alert).toHaveBeenCalledOnce())
    expect(alert.mock.calls[0]?.[1]).toContain("Dune")
  })
})
