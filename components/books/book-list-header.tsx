import { View } from "react-native"
import { Text } from "@/components/ui/text"

type BookListHeaderProps = {
  count: number
  total: number
}

export const BookListHeader = ({ count, total }: BookListHeaderProps) => (
  <View className="gap-1 px-4 pb-3 pt-2">
    <Text variant="h3">Bibliothèque</Text>
    <Text variant="muted">
      {count} sur {total} ouvrages
    </Text>
  </View>
)
