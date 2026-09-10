import { renderHook, waitFor } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import { makeNote } from "@/test/factories"
import { createQueryWrapper } from "@/test/query"
import { noteKeys } from "./keys"
import { useCreateNote, useDeleteNote } from "./mutations"
import { useNotes } from "./queries"

const BOOK_ID = "book-1"
const NOTES_URL = `http://localhost:3000/books/${BOOK_ID}/notes`

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("useNotes", () => {
  it("returns the notes of a book", async () => {
    server.use(
      http.get(NOTES_URL, () =>
        HttpResponse.json([makeNote({ livreId: BOOK_ID, contenu: "Superbe" })]),
      ),
    )
    const { Wrapper } = createQueryWrapper()

    const { result } = renderHook(() => useNotes(BOOK_ID), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0]?.contenu).toBe("Superbe")
  })

  it("rejects a payload that breaks the contract", async () => {
    server.use(http.get(NOTES_URL, () => HttpResponse.json([{ id: "note-1" }])))
    const { Wrapper } = createQueryWrapper()

    const { result } = renderHook(() => useNotes(BOOK_ID), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe("useCreateNote", () => {
  it("sends the draft content in the request body", async () => {
    let receivedBody: unknown = null
    server.use(
      http.post(NOTES_URL, async ({ request }) => {
        receivedBody = await request.json()

        return HttpResponse.json(makeNote({ livreId: BOOK_ID }))
      }),
    )
    const { Wrapper } = createQueryWrapper()

    const { result } = renderHook(() => useCreateNote(), { wrapper: Wrapper })

    result.current.mutate({ bookId: BOOK_ID, draft: { contenu: "Ajoutée" } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(receivedBody).toEqual({ contenu: "Ajoutée" })
  })

  it("invalidates the book's notes list after adding a note", async () => {
    server.use(
      http.post(NOTES_URL, () =>
        HttpResponse.json(makeNote({ livreId: BOOK_ID, contenu: "Ajoutée" })),
      ),
    )
    const { client, Wrapper } = createQueryWrapper()
    const invalidate = vi.spyOn(client, "invalidateQueries")

    const { result } = renderHook(() => useCreateNote(), { wrapper: Wrapper })

    result.current.mutate({ bookId: BOOK_ID, draft: { contenu: "Ajoutée" } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: noteKeys.list(BOOK_ID),
    })
  })
})

describe("useDeleteNote", () => {
  it("invalidates the book's notes list after removing a note", async () => {
    server.use(
      http.delete(
        `${NOTES_URL}/note-1`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    )
    const { client, Wrapper } = createQueryWrapper()
    const invalidate = vi.spyOn(client, "invalidateQueries")

    const { result } = renderHook(() => useDeleteNote(), { wrapper: Wrapper })

    result.current.mutate({ bookId: BOOK_ID, noteId: "note-1" })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: noteKeys.list(BOOK_ID),
    })
  })
})
