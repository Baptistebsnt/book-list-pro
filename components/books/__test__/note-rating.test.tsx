import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"
import { makeBook } from "@/test/factories"
import { createQueryWrapper } from "@/test/query"
import { NoteRating } from "../note-rating"

const BOOK_URL = "http://localhost:3000/books/book-1"

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const renderRating = (note: number | null) => {
  const book = makeBook({ id: "book-1", titre: "Dune", note })
  const { Wrapper } = createQueryWrapper()

  render(
    <Wrapper>
      <NoteRating book={book} />
    </Wrapper>,
  )

  return book
}

describe("NoteRating", () => {
  it("exposes each star to assistive technology with the current value checked", () => {
    renderRating(3)

    expect(
      screen.getByRole("radio", { name: "Noter « Dune » 3 sur 5" }),
    ).toHaveAttribute("aria-checked", "true")
    expect(
      screen.getByRole("radio", { name: "Noter « Dune » 4 sur 5" }),
    ).toHaveAttribute("aria-checked", "false")
  })

  it("distinguishes an unrated book from a book rated 0", () => {
    renderRating(null)

    expect(screen.getByText("Non notée")).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Effacer la note de « Dune »" }),
    ).not.toBeInTheDocument()
  })

  it("shows the numeric value once the book carries a rating", () => {
    renderRating(0)

    expect(screen.getByText("0 / 5")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Effacer la note de « Dune »" }),
    ).toBeInTheDocument()
  })

  it("signals the failure when the server refuses the write", async () => {
    server.use(
      http.patch(BOOK_URL, () =>
        HttpResponse.json({ message: "Conflit" }, { status: 409 }),
      ),
    )
    renderRating(null)

    await userEvent.click(
      screen.getByRole("radio", { name: "Noter « Dune » 2 sur 5" }),
    )

    await waitFor(() => expect(screen.getByText("Échec")).toBeInTheDocument())
  })
})
