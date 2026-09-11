import AsyncStorage from "@react-native-async-storage/async-storage"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it } from "vitest"
import { ThemeToggle } from "@/components/theme-toggle"
import { AppThemeProvider } from "@/providers/theme"

const TO_DARK = "Activer le thème sombre"

const TO_LIGHT = "Activer le thème clair"

afterEach(() => AsyncStorage.clear())

const renderToggle = () =>
  render(
    <AppThemeProvider>
      <ThemeToggle />
    </AppThemeProvider>,
  )

describe("ThemeToggle", () => {
  it("offers the dark theme while the light one is applied", async () => {
    renderToggle()

    const toggle = await screen.findByLabelText(TO_DARK)

    expect(toggle).toHaveAttribute("aria-checked", "false")
  })

  it("offers the light theme once the dark one is applied", async () => {
    renderToggle()

    await userEvent.click(await screen.findByLabelText(TO_DARK))

    expect(screen.getByLabelText(TO_LIGHT)).toHaveAttribute(
      "aria-checked",
      "true",
    )
  })
})
