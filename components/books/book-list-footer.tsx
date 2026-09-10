import { ActivityIndicator, View } from "react-native"
import { Text } from "@/components/ui/text"

type BookListFooterProps = {
  isFetchingNextPage: boolean
  hasNextPage: boolean
  count: number
}

export const BookListFooter = ({
  isFetchingNextPage,
  hasNextPage,
  count,
}: BookListFooterProps) => {
  if (isFetchingNextPage) {
    return (
      <View className="py-4">
        <ActivityIndicator />
      </View>
    )
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
}
