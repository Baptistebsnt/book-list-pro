import { act, render, screen } from "@testing-library/react"
import { type ReactNode, createElement } from "react"
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
    })
  },
}))

vi.mock("lucide-react-native", () => ({
  ImageOff: (props: { children?: ReactNode }) =>
    createElement("svg", { "data-testid": "cover-fallback" }, props.children),
}))

afterEach(() => {
  lastImage.onError = null
})

describe("BookCover", () => {
  it("exposes an accessible label when one is provided", () => {
    render(
      <BookCover
        uri="http://localhost:3000/covers/dune.svg"
        label="Couverture de « Dune »"
      />,
    )

    expect(
      screen.getByRole("img", { name: "Couverture de « Dune »" }),
    ).toBeInTheDocument()
  })

  it("renders a visible fallback instead of a broken image when loading fails", () => {
    render(
      <BookCover
        uri="http://localhost:3000/covers/dune.svg"
        label="Couverture de « Dune »"
      />,
    )

    expect(screen.queryByTestId("cover-fallback")).not.toBeInTheDocument()

    act(() => lastImage.onError?.())

    expect(screen.getByTestId("cover-fallback")).toBeInTheDocument()
  })
})
