import AsyncStorage from "@react-native-async-storage/async-storage"
import { z } from "zod"
import { type SupportedLanguage, supportedLanguages } from "@/i18n"

export const LANGUAGE_PREFERENCE_KEY = "book-list-pro.language-preference"

const languagePreferenceSchema = z.enum(supportedLanguages)

export type LanguagePreference = SupportedLanguage

/**
 * Returns the stored language, or `null` when the user has never chosen one so
 * the app can keep following the device locale resolved by i18n on launch.
 */
export const readLanguagePreference =
  async (): Promise<LanguagePreference | null> => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_PREFERENCE_KEY)
      const parsed = languagePreferenceSchema.safeParse(stored)

      return parsed.success ? parsed.data : null
    } catch {
      return null
    }
  }

export const writeLanguagePreference = async (
  preference: LanguagePreference,
): Promise<void> => {
  await AsyncStorage.setItem(LANGUAGE_PREFERENCE_KEY, preference).catch(
    () => null,
  )
}
