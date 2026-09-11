import { getLocales } from "expo-localization"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import { resources } from "./resources"

export const supportedLanguages = ["fr", "en"] as const

export type SupportedLanguage = (typeof supportedLanguages)[number]

// This is a French-first catalogue: French is both the default and the
// fallback when the device locale is neither French nor English.
export const DEFAULT_LANGUAGE: SupportedLanguage = "fr"

const getDeviceLanguage = (): SupportedLanguage => {
  const [locale] = getLocales()

  return (
    supportedLanguages.find((language) => language === locale.languageCode) ??
    DEFAULT_LANGUAGE
  )
}

// eslint-disable-next-line import/no-named-as-default-member
void i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

export default i18n
