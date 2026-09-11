import { act, render, screen } from "@testing-library/react"
import { createElement } from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { BookCover } from "../book-cover"

const lastImage = vi.hoisted(() => ({
  onError: null as null | (() => void),
}))

vi.mock("expo-image", () => ({
  Image: (props: { accessibilityLabel?: string; onError?: () => void }) => {
    lastImage.onError = props.onError ?? null

    return createElement("expo-image", {
      "aria-label": props.accessibilityLabel,
      "data-testid": "cover-image",
    })
  },
}))

afterEach(() => {
  lastImage.onError = null
})

const base = {
  uri: "https://cdn.example.com/dune.jpg",
  seed: "book-1",
  title: "Dune",
  author: "Frank Herbert",
  label: "Couverture de « Dune »",
}

describe("BookCover", () => {
  it("exposes an accessible label when one is provided", () => {
    render(<BookCover {...base} hasSource />)

    expect(
      screen.getByRole("img", { name: "Couverture de « Dune »" }),
    ).toBeInTheDocument()
  })

  it("shows the fetched image when the book has a cover source", () => {
    render(<BookCover {...base} hasSource />)

    expect(screen.getByTestId("cover-image")).toBeInTheDocument()
    expect(screen.queryByText("Dune")).not.toBeInTheDocument()
  })

  it("falls back to a generated cover when the image fails to load", () => {
    render(<BookCover {...base} hasSource />)

    act(() => lastImage.onError?.())

    expect(screen.queryByTestId("cover-image")).not.toBeInTheDocument()
    expect(screen.getByText("Dune")).toBeInTheDocument()
  })

  it("renders the generated cover without any request when there is no source", () => {
    render(<BookCover {...base} hasSource={false} />)

    expect(screen.queryByTestId("cover-image")).not.toBeInTheDocument()
    expect(screen.getByText("Dune")).toBeInTheDocument()
  })
})
