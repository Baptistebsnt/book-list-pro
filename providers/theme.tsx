import { useColorScheme as useNativeWindColorScheme } from "nativewind"
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useColorScheme as useSystemColorScheme } from "react-native"
import {
  DEFAULT_THEME_PREFERENCE,
  type ThemePreference,
  readThemePreference,
  writeThemePreference,
} from "@/services/storage/theme-preference"

export type ColorScheme = "light" | "dark"

type AppThemeValue = {
  preference: ThemePreference
  scheme: ColorScheme
  setPreference: (preference: ThemePreference) => void
  toggle: () => void
}

const AppThemeContext = createContext<AppThemeValue | null>(null)

type AppThemeProviderProps = {
  children: ReactNode
}

export const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
  const systemScheme = useSystemColorScheme()
  const nativeWind = useNativeWindColorScheme()
  const [preference, setStoredPreference] = useState<ThemePreference>(
    DEFAULT_THEME_PREFERENCE,
  )

  useEffect(() => {
    let isMounted = true

    void readThemePreference().then((stored) => {
      if (!isMounted) {
        return
      }

      setStoredPreference(stored)
    })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    nativeWind.setColorScheme(preference)
  }, [nativeWind, preference])

  const setPreference = useCallback((next: ThemePreference) => {
    setStoredPreference(next)
    void writeThemePreference(next)
  }, [])

  const scheme: ColorScheme =
    preference === "system" ? (systemScheme ?? "light") : preference

  const toggle = useCallback(
    () => setPreference(scheme === "dark" ? "light" : "dark"),
    [scheme, setPreference],
  )

  const value = useMemo(
    () => ({ preference, scheme, setPreference, toggle }),
    [preference, scheme, setPreference, toggle],
  )

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  )
}

export const useAppTheme = (): AppThemeValue => {
  const value = useContext(AppThemeContext)

  if (value === null) {
    throw new Error("useAppTheme must be used inside an AppThemeProvider")
  }

  return value
}
