import AsyncStorage from "@react-native-async-storage/async-storage"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Pressable, Text } from "react-native"
import { afterEach, describe, expect, it } from "vitest"
import { AppThemeProvider, useAppTheme } from "@/providers/theme"
import { THEME_PREFERENCE_KEY } from "@/services/storage/theme-preference"

const Probe = () => {
  const { preference, scheme, toggle } = useAppTheme()

  return (
    <>
      <Text>{`préférence : ${preference}`}</Text>
      <Text>{`thème : ${scheme}`}</Text>
      <Pressable role="button" aria-label="Basculer" onPress={toggle} />
    </>
  )
}

const launchApp = () =>
  render(
    <AppThemeProvider>
      <Probe />
    </AppThemeProvider>,
  )

afterEach(() => AsyncStorage.clear())

describe("AppThemeProvider", () => {
  it("follows the system preference on a first launch", async () => {
    launchApp()

    expect(await screen.findByText("préférence : system")).toBeInTheDocument()
    expect(screen.getByText("thème : light")).toBeInTheDocument()
  })

  it("remembers a manual switch", async () => {
    launchApp()
    await screen.findByText("préférence : system")

    await userEvent.click(screen.getByLabelText("Basculer"))

    expect(screen.getByText("thème : dark")).toBeInTheDocument()
    await waitFor(async () =>
      expect(await AsyncStorage.getItem(THEME_PREFERENCE_KEY)).toBe("dark"),
    )
  })

  it("restores the stored choice on the next launch", async () => {
    await AsyncStorage.setItem(THEME_PREFERENCE_KEY, "dark")

    launchApp()

    expect(await screen.findByText("thème : dark")).toBeInTheDocument()
    expect(screen.getByText("préférence : dark")).toBeInTheDocument()
  })

  it("falls back to the system preference when the stored value is unusable", async () => {
    await AsyncStorage.setItem(THEME_PREFERENCE_KEY, "sépia")

    launchApp()

    expect(await screen.findByText("préférence : system")).toBeInTheDocument()
    expect(screen.getByText("thème : light")).toBeInTheDocument()
  })
})
