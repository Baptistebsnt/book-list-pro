import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { NoteStars } from "../note-stars"

describe("NoteStars", () => {
  it("announces the rating through the provided label", () => {
    render(<NoteStars note={3} label="Note : 3 sur 5" />)

    expect(
      screen.getByRole("img", { name: "Note : 3 sur 5" }),
    ).toBeInTheDocument()
  })

  it("stays decorative when no label is given", () => {
    render(<NoteStars note={0} />)

    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })
})
