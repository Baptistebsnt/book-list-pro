import AsyncStorage from "@react-native-async-storage/async-storage"
import { z } from "zod"

export const THEME_PREFERENCE_KEY = "book-list-pro.theme-preference"

const themePreferenceSchema = z.enum(["system", "light", "dark"])

export type ThemePreference = z.infer<typeof themePreferenceSchema>

export const DEFAULT_THEME_PREFERENCE: ThemePreference = "system"

export const readThemePreference = async (): Promise<ThemePreference> => {
  try {
    const stored = await AsyncStorage.getItem(THEME_PREFERENCE_KEY)
    const parsed = themePreferenceSchema.safeParse(stored)

    return parsed.success ? parsed.data : DEFAULT_THEME_PREFERENCE
  } catch {
    return DEFAULT_THEME_PREFERENCE
  }
}

export const writeThemePreference = async (
  preference: ThemePreference,
): Promise<void> => {
  await AsyncStorage.setItem(THEME_PREFERENCE_KEY, preference).catch(() => null)
}
