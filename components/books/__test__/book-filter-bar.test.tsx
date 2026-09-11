import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { type BookControls } from "@/services/query/books"
import { BookFilterBar } from "../book-filter-bar"

const DEFAULTS: BookControls = {
  status: null,
  favori: null,
  sort: "titre",
  order: "asc",
}

const renderBar = (controls: Partial<BookControls> = {}) => {
  const onChange = vi.fn()
  const bar = (next: Partial<BookControls>) => (
    <BookFilterBar controls={{ ...DEFAULTS, ...next }} onChange={onChange} />
  )
  const { rerender } = render(bar(controls))

  return {
    onChange,
    update: (next: Partial<BookControls>) => rerender(bar(next)),
  }
}

describe("BookFilterBar", () => {
  it("marks the active status filter as checked", () => {
    renderBar({ status: "lu" })

    expect(screen.getByRole("radio", { name: "Lus" })).toHaveAttribute(
      "aria-checked",
      "true",
    )
    expect(screen.getByRole("radio", { name: "Tous" })).toHaveAttribute(
      "aria-checked",
      "false",
    )
  })

  it("asks the server for read books only", async () => {
    const { onChange } = renderBar()

    await userEvent.click(screen.getByRole("radio", { name: "Lus" }))

    expect(onChange).toHaveBeenCalledWith({ status: "lu" })
  })

  it("turns the favourite filter on and back off", async () => {
    const { onChange, update } = renderBar()

    await userEvent.click(screen.getByRole("switch", { name: "Coups de cœur" }))

    expect(onChange).toHaveBeenCalledWith({ favori: true })

    update({ favori: true })
    await userEvent.click(screen.getByRole("switch", { name: "Coups de cœur" }))

    expect(onChange).toHaveBeenLastCalledWith({ favori: null })
  })

  it("picks a sort field, then flips its direction on a second press", async () => {
    const { onChange, update } = renderBar()

    await userEvent.click(
      screen.getByRole("radio", { name: "Trier par auteur" }),
    )

    expect(onChange).toHaveBeenCalledWith({ sort: "auteur" })

    update({ sort: "auteur" })
    await userEvent.click(
      screen.getByRole("radio", { name: "Trier par auteur, ordre croissant" }),
    )

    expect(onChange).toHaveBeenLastCalledWith({ order: "desc" })
  })
})
