import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { formatDateTime, formatNumber } from "@/lib/format"

/**
 * Locale-aware date and number formatters bound to the active language. Reading
 * `i18n.language` through `useTranslation` re-runs consumers on a hot switch, so
 * the formatting updates immediately alongside the translated labels.
 */
export const useFormatters = () => {
  const { i18n } = useTranslation()
  const { language } = i18n

  return useMemo(
    () => ({
      formatDateTime: (value: string | number | Date) =>
        formatDateTime(value, language),
      formatNumber: (value: number) => formatNumber(value, language),
    }),
    [language],
  )
}
