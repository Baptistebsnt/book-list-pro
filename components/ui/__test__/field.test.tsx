import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Field } from "../field"
import { Input } from "../input"

describe("Field", () => {
  it("names the wrapped control with its label", () => {
    render(
      <Field label="Titre">
        <Input value="" onChangeText={vi.fn()} />
      </Field>,
    )

    expect(screen.getByRole("textbox", { name: "Titre" })).toBeInTheDocument()
  })

  it("marks the control invalid and announces the error", () => {
    render(
      <Field label="Titre" error="Requis">
        <Input value="" onChangeText={vi.fn()} />
      </Field>,
    )

    expect(screen.getByRole("textbox", { name: "Titre" })).toHaveAttribute(
      "aria-invalid",
      "true",
    )
    expect(screen.getByRole("alert")).toHaveTextContent("Requis")
  })

  it("keeps an explicit label already set on the control", () => {
    render(
      <Field label="Titre">
        <Input value="" onChangeText={vi.fn()} aria-label="Personnalisé" />
      </Field>,
    )

    expect(
      screen.getByRole("textbox", { name: "Personnalisé" }),
    ).toBeInTheDocument()
  })
})
