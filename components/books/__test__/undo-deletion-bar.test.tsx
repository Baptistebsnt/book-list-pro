import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { UndoDeletionBar } from "../undo-deletion-bar"

describe("UndoDeletionBar", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("shows the deleted title and the initial countdown", () => {
    render(<UndoDeletionBar titre="Dune" seconds={5} onUndo={vi.fn()} />)

    expect(screen.getByText("« Dune » supprimé")).toBeInTheDocument()
    expect(
      screen.getByText("Annulation possible pendant 5 s"),
    ).toBeInTheDocument()
  })

  it("counts the remaining seconds down over time", () => {
    render(<UndoDeletionBar titre="Dune" seconds={5} onUndo={vi.fn()} />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(
      screen.getByText("Annulation possible pendant 3 s"),
    ).toBeInTheDocument()
  })

  it("never counts below zero", () => {
    render(<UndoDeletionBar titre="Dune" seconds={2} onUndo={vi.fn()} />)

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(
      screen.getByText("Annulation possible pendant 0 s"),
    ).toBeInTheDocument()
  })

  it("calls onUndo when the undo button is pressed", () => {
    const onUndo = vi.fn()
    render(<UndoDeletionBar titre="Dune" seconds={5} onUndo={onUndo} />)

    fireEvent.click(screen.getByText("Annuler"))

    expect(onUndo).toHaveBeenCalledOnce()
  })
})
