import { memo } from "react"
import { Platform, Pressable, View } from "react-native"
import { Text } from "@/components/ui/text"
import { type Book } from "@/domain/book"
import { cn } from "@/lib/utils"
import { FavoriteToggle } from "./favorite-toggle"
import { ReadBadge } from "./read-badge"
import { ReadToggle } from "./read-toggle"

type BookListItemProps = {
  book: Book
  onPress: (book: Book) => void
}

export const BookListItem = memo(({ book, onPress }: BookListItemProps) => (
  <View className="flex-row items-center border-b border-border bg-background">
    <Pressable
      onPress={() => onPress(book)}
      role="button"
      className={cn(
        "flex-1 flex-row items-center gap-3 py-3 pl-4 pr-3 active:bg-muted",
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
    <View className="flex-row items-center gap-1 pr-3">
      <FavoriteToggle book={book} />
      <ReadToggle book={book} />
    </View>
  </View>
))

BookListItem.displayName = "BookListItem"
