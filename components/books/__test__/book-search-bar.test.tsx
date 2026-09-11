import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { BookSearchBar } from "../book-search-bar"

const LABEL = "Rechercher un ouvrage par titre ou auteur"

describe("BookSearchBar", () => {
  it("exposes the search field to assistive technology", () => {
    render(<BookSearchBar value="dune" onChange={vi.fn()} />)

    expect(screen.getByLabelText(LABEL)).toHaveValue("dune")
  })

  it("reports every keystroke to its parent", async () => {
    const onChange = vi.fn()
    render(<BookSearchBar value="" onChange={onChange} />)

    await userEvent.type(screen.getByLabelText(LABEL), "du")

    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it("clears the term when the clear button is pressed", async () => {
    const onChange = vi.fn()
    render(<BookSearchBar value="dune" onChange={onChange} />)

    await userEvent.click(
      screen.getByRole("button", { name: "Effacer la recherche" }),
    )

    expect(onChange).toHaveBeenCalledWith("")
  })
})
