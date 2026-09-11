import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { GeneratedCover } from "../generated-cover"

describe("GeneratedCover", () => {
  it("shows the title and author in the full variant", () => {
    render(<GeneratedCover seed="book-1" title="Dune" author="Frank Herbert" />)

    expect(screen.getByText("Dune")).toBeInTheDocument()
    expect(screen.getByText("Frank Herbert")).toBeInTheDocument()
  })

  it("reduces the title to its meaningful initials in the compact variant", () => {
    render(<GeneratedCover seed="book-1" title="La Cité des cendres" compact />)

    expect(screen.getByText("CC")).toBeInTheDocument()
    expect(screen.queryByText("La Cité des cendres")).not.toBeInTheDocument()
  })
})
