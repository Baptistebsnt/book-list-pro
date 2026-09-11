import { describe, expect, it } from "vitest"
import { makeNote } from "@/test/factories"
import { sortNotesByNewest } from "./utils"

describe("sortNotesByNewest", () => {
  it("sorts notes from newest to oldest", () => {
    const oldest = makeNote({ id: "oldest", createdAt: "2024-01-01T09:00:00Z" })
    const newest = makeNote({ id: "newest", createdAt: "2024-01-03T09:00:00Z" })
    const middle = makeNote({ id: "middle", createdAt: "2024-01-02T09:00:00Z" })

    expect(
      sortNotesByNewest([oldest, newest, middle]).map((note) => note.id),
    ).toEqual(["newest", "middle", "oldest"])
  })
})
