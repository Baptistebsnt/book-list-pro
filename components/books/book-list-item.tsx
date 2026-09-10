import { Platform, Pressable, View } from "react-native"
import { Text } from "@/components/ui/text"
import { type Book } from "@/domain/book"
import { cn } from "@/lib/utils"
import { ReadBadge } from "./read-badge"

type BookListItemProps = {
  book: Book
  onPress: () => void
}

export const BookListItem = ({ book, onPress }: BookListItemProps) => (
  <Pressable
    onPress={onPress}
    role="button"
    className={cn(
      "flex-row items-center gap-3 border-b border-border bg-background px-4 py-3 active:bg-muted",
      Platform.select({ web: "hover:bg-muted" }),
    )}
  >
    <View className="flex-1 gap-0.5">
      <Text variant="large" numberOfLines={1}>
        {book.titre}
      </Text>
      <Text variant="muted" numberOfLines={1}>
        {book.auteur} · {book.annee}
      </Text>
    </View>
    <ReadBadge lu={book.lu} />
  </Pressable>
)
