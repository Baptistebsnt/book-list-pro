import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ReadBadge } from "./read-badge"

describe("ReadBadge", () => {
  it("shows 'Lu' when the book is read", () => {
    render(<ReadBadge lu={true} />)

    expect(screen.getByText("Lu")).toBeInTheDocument()
    expect(screen.queryByText("Non lu")).not.toBeInTheDocument()
  })

  it("shows 'Non lu' when the book is unread", () => {
    render(<ReadBadge lu={false} />)

    expect(screen.getByText("Non lu")).toBeInTheDocument()
    expect(screen.queryByText("Lu")).not.toBeInTheDocument()
  })
})
