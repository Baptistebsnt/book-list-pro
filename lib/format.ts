import { DEFAULT_LANGUAGE } from "@/i18n"

/**
 * Maps an app language to the BCP-47 tag used by the `Intl` formatters so that
 * dates and numbers follow the conventions of the active language.
 */
const LOCALE_TAGS: Record<string, string> = {
  fr: "fr-FR",
  en: "en-US",
}

export const localeTag = (language: string): string =>
  LOCALE_TAGS[language] ?? LOCALE_TAGS[DEFAULT_LANGUAGE]

export const formatDateTime = (
  value: string | number | Date,
  language: string,
): string =>
  new Intl.DateTimeFormat(localeTag(language), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))

export const formatNumber = (value: number, language: string): string =>
  new Intl.NumberFormat(localeTag(language)).format(value)
