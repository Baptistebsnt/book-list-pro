import { memo } from "react"
import { useTranslation } from "react-i18next"
import { View } from "react-native"
import { BookListSkeletonRow } from "@/components/books/book-list-skeleton"
import { Text } from "@/components/ui/text"

type BookListFooterProps = {
  isFetchingNextPage: boolean
  hasNextPage: boolean
  count: number
}

export const BookListFooter = memo(
  ({ isFetchingNextPage, hasNextPage, count }: BookListFooterProps) => {
    const { t } = useTranslation()

    if (isFetchingNextPage) {
      return <BookListSkeletonRow />
    }

    if (!hasNextPage && count > 0) {
      return (
        <View className="py-4">
          <Text variant="muted" className="text-center">
            {t("books.list.end")}
          </Text>
        </View>
      )
    }

    return null
  },
)

BookListFooter.displayName = "BookListFooter"
