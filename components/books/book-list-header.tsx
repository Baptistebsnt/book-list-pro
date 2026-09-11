import { memo } from "react"
import { useTranslation } from "react-i18next"
import { View } from "react-native"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { Text } from "@/components/ui/text"
import { useFormatters } from "@/hooks/use-formatters"

type BookListHeaderProps = {
  count: number | null
  total: number | null
  searchedTerm?: string
}

export const BookListHeader = memo(
  ({ count, total, searchedTerm = "" }: BookListHeaderProps) => {
    const { t } = useTranslation()
    const { formatNumber } = useFormatters()

    const summary = (shownCount: number, totalCount: number): string => {
      const values = {
        shown: formatNumber(shownCount),
        total: formatNumber(totalCount),
      }

      return searchedTerm.length > 0
        ? t("books.library.summarySearched", { ...values, term: searchedTerm })
        : t("books.library.summary", values)
    }

    return (
      <View className="gap-1 px-4 pb-3 pt-2">
        <View className="flex-row items-center justify-between gap-3">
          <Text variant="h3">{t("books.library.title")}</Text>
          <View className="flex-row items-center">
            <LanguageToggle />
            <ThemeToggle />
          </View>
        </View>
        {count !== null && total !== null && (
          <Text variant="muted" aria-live="polite">
            {summary(count, total)}
          </Text>
        )}
      </View>
    )
  },
)

BookListHeader.displayName = "BookListHeader"
