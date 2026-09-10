import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"
import { makeBook } from "@/test/factories"
import { createQueryWrapper } from "@/test/query"
import { FavoriteToggle } from "../favorite-toggle"

const BOOK_URL = "http://localhost:3000/books/book-1"

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const renderToggle = (favori: boolean) => {
  const book = makeBook({ id: "book-1", titre: "Dune", favori })
  const { Wrapper } = createQueryWrapper()

  render(
    <Wrapper>
      <FavoriteToggle book={book} />
    </Wrapper>,
  )

  return book
}

describe("FavoriteToggle", () => {
  it("exposes the favourite state to assistive technology", () => {
    renderToggle(true)

    const toggle = screen.getByRole("switch", {
      name: "Retirer « Dune » des coups de cœur",
    })

    expect(toggle).toHaveAttribute("aria-checked", "true")
  })

  it("offers to add the book when it is not a favourite yet", () => {
    renderToggle(false)

    const toggle = screen.getByRole("switch", {
      name: "Ajouter « Dune » aux coups de cœur",
    })

    expect(toggle).toHaveAttribute("aria-checked", "false")
  })

  it("signals the failure when the server refuses the write", async () => {
    server.use(
      http.patch(BOOK_URL, () =>
        HttpResponse.json({ message: "Conflit" }, { status: 409 }),
      ),
    )
    renderToggle(false)

    await userEvent.click(screen.getByRole("switch"))

    await waitFor(() => expect(screen.getByText("Échec")).toBeInTheDocument())
  })
})
