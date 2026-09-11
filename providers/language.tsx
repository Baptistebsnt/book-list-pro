import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import {
  DEFAULT_LANGUAGE,
  type SupportedLanguage,
  supportedLanguages,
} from "@/i18n"
import {
  type LanguagePreference,
  readLanguagePreference,
  writeLanguagePreference,
} from "@/services/storage/language-preference"

type AppLanguageValue = {
  language: SupportedLanguage
  setLanguage: (language: LanguagePreference) => void
  toggle: () => void
}

const AppLanguageContext = createContext<AppLanguageValue | null>(null)

const normalize = (language: string): SupportedLanguage =>
  supportedLanguages.find((candidate) => candidate === language) ??
  DEFAULT_LANGUAGE

type AppLanguageProviderProps = {
  children: ReactNode
}

export const AppLanguageProvider = ({ children }: AppLanguageProviderProps) => {
  const { i18n } = useTranslation()
  const [language, setLanguageState] = useState<SupportedLanguage>(
    normalize(i18n.language),
  )

  useEffect(() => {
    let isMounted = true

    void readLanguagePreference().then((stored) => {
      if (!isMounted || stored === null) {
        return
      }

      setLanguageState(stored)
      void i18n.changeLanguage(stored)
    })

    return () => {
      isMounted = false
    }
  }, [i18n])

  const setLanguage = useCallback(
    (next: LanguagePreference) => {
      setLanguageState(next)
      void i18n.changeLanguage(next)
      void writeLanguagePreference(next)
    },
    [i18n],
  )

  const toggle = useCallback(
    () => setLanguage(language === "fr" ? "en" : "fr"),
    [language, setLanguage],
  )

  const value = useMemo(
    () => ({ language, setLanguage, toggle }),
    [language, setLanguage, toggle],
  )

  return (
    <AppLanguageContext.Provider value={value}>
      {children}
    </AppLanguageContext.Provider>
  )
}

export const useAppLanguage = (): AppLanguageValue => {
  const value = useContext(AppLanguageContext)

  if (value === null) {
    throw new Error("useAppLanguage must be used inside an AppLanguageProvider")
  }

  return value
}
