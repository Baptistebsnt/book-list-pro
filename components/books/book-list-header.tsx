import { View } from "react-native"
import { Text } from "@/components/ui/text"

type BookListHeaderProps = {
  count: number | null
  total: number | null
  searchedTerm?: string
}

const summary = (count: number, total: number, searchedTerm: string): string =>
  searchedTerm.length > 0
    ? `${count} sur ${total} résultats pour « ${searchedTerm} »`
    : `${count} sur ${total} ouvrages`

export const BookListHeader = ({
  count,
  total,
  searchedTerm = "",
}: BookListHeaderProps) => (
  <View className="gap-1 px-4 pb-3 pt-2">
    <Text variant="h3">Bibliothèque</Text>
    {count !== null && total !== null && (
      <Text variant="muted">{summary(count, total, searchedTerm)}</Text>
    )}
  </View>
)
