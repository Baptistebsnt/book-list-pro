import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"
import { createElement } from "react"
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import { toast } from "@/components/ui/toast"
import { makeNote } from "@/test/factories"
import { createQueryWrapper } from "@/test/query"
import { ReadingNotes } from "../reading-notes"

vi.mock("@/components/ui/toast", () => ({ toast: { show: vi.fn() } }))

vi.mock("@/components/books/delete-note-dialog", () => ({
  DeleteNoteDialog: (props: { onConfirm: () => void }) =>
    createElement("button", {
      "aria-label": "Supprimer la note",
      onClick: props.onConfirm,
    }),
}))

const NOTES_URL = "http://localhost:3000/books/book-1/notes"

const TITLE = "Dune"

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => {
  server.resetHandlers()
  vi.clearAllMocks()
})
afterAll(() => server.close())

const renderNotes = () => {
  const { Wrapper } = createQueryWrapper()

  render(<ReadingNotes bookId="book-1" bookTitle={TITLE} />, {
    wrapper: Wrapper,
  })
}

describe("ReadingNotes", () => {
  it("names the book in its empty state", async () => {
    server.use(http.get(NOTES_URL, () => HttpResponse.json([])))
    renderNotes()

    expect(
      await screen.findByText("Aucune note de lecture"),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Personne n'a encore noté de remarque sur « Dune »/u),
    ).toBeInTheDocument()
  })

  it("names the book when the notes cannot be loaded", async () => {
    server.use(
      http.get(NOTES_URL, () => new HttpResponse(null, { status: 500 })),
    )
    renderNotes()

    expect(
      await screen.findByText("Impossible d'afficher les notes"),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Les notes de lecture de « Dune »/u),
    ).toBeInTheDocument()
  })

  it("confirms a successful addition", async () => {
    server.use(
      http.get(NOTES_URL, () => HttpResponse.json([])),
      http.post(NOTES_URL, () =>
        HttpResponse.json(makeNote({ contenu: "À commander en double" })),
      ),
    )
    renderNotes()

    await userEvent.type(
      await screen.findByPlaceholderText("Ajouter une note de lecture"),
      "À commander en double",
    )
    await userEvent.click(
      screen.getByRole("button", { name: "Ajouter la note" }),
    )

    await waitFor(() =>
      expect(vi.mocked(toast.show)).toHaveBeenCalledWith(
        "Note ajoutée à « Dune ».",
        { type: "success" },
      ),
    )
  })
})
