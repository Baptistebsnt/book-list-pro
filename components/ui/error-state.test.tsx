import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ErrorState } from "./error-state"

describe("ErrorState", () => {
  it("renders the default error copy", () => {
    render(<ErrorState onRetry={vi.fn()} />)

    expect(
      screen.getByText("Impossible d'afficher ces données"),
    ).toBeInTheDocument()
  })

  it("renders a custom title and description", () => {
    render(
      <ErrorState
        onRetry={vi.fn()}
        title="Oups"
        description="Réseau indisponible"
      />,
    )

    expect(screen.getByText("Oups")).toBeInTheDocument()
    expect(screen.getByText("Réseau indisponible")).toBeInTheDocument()
  })

  it("calls onRetry when the retry button is pressed", () => {
    const onRetry = vi.fn()
    render(<ErrorState onRetry={onRetry} />)

    fireEvent.click(screen.getByText("Réessayer"))

    expect(onRetry).toHaveBeenCalledOnce()
  })

  it("shows a pending label while retrying", () => {
    render(<ErrorState onRetry={vi.fn()} isRetrying />)

    expect(screen.getByText("Nouvel essai…")).toBeInTheDocument()
    expect(screen.queryByText("Réessayer")).not.toBeInTheDocument()
  })
})
