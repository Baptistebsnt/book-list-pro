import { memo } from "react"
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
    if (isFetchingNextPage) {
      return <BookListSkeletonRow />
    }

    if (!hasNextPage && count > 0) {
      return (
        <View className="py-4">
          <Text variant="muted" className="text-center">
            Fin du fonds
          </Text>
        </View>
      )
    }

    return null
  },
)

BookListFooter.displayName = "BookListFooter"
