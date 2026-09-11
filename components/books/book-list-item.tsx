import { memo } from "react"
import { useTranslation } from "react-i18next"
import { Platform, Pressable, View } from "react-native"
import { Text } from "@/components/ui/text"
import { type Book, MAX_RATING } from "@/domain/book"
import { cn } from "@/lib/utils"
import { hasCoverSource, resolveCoverUrl } from "@/services/api/covers"
import { BookCover } from "./book-cover"
import { FavoriteToggle } from "./favorite-toggle"
import { NoteStars } from "./note-stars"
import { ReadBadge } from "./read-badge"
import { ReadToggle } from "./read-toggle"

type BookListItemProps = {
  book: Book
  onPress: (book: Book) => void
}

export const BOOK_ROW_HEIGHT = 88

export const BookListItem = memo(({ book, onPress }: BookListItemProps) => {
  const { t } = useTranslation()

  const openLabel = t("books.item.openLabel", {
    title: book.titre,
    author: book.auteur,
    year: book.annee,
    status: book.lu ? t("books.item.read") : t("books.item.unread"),
    rating:
      book.note === null
        ? t("books.item.unrated")
        : t("books.item.rated", { note: book.note, max: MAX_RATING }),
  })

  return (
    <View
      role="listitem"
      style={{ height: BOOK_ROW_HEIGHT }}
      className="flex-row items-center border-b border-border bg-background"
    >
      <Pressable
        onPress={() => onPress(book)}
        role="button"
        aria-label={openLabel}
        className={cn(
          "flex-1 flex-row items-center gap-3 py-3 pl-4 pr-3 active:bg-muted",
          Platform.select({ web: "hover:bg-muted" }),
        )}
      >
        <BookCover
          uri={resolveCoverUrl(book.couverture, book.id)}
          hasSource={hasCoverSource(book.couverture)}
          seed={book.id}
          title={book.titre}
          author={book.auteur}
          compact
          className="h-14 w-10"
        />
        <View className="flex-1 gap-0.5">
          <Text variant="large" numberOfLines={1}>
            {book.titre}
          </Text>
          <Text variant="muted" numberOfLines={1}>
            {book.auteur} · {book.annee}
          </Text>
          {book.note !== null && <NoteStars note={book.note} size={14} />}
        </View>
        <ReadBadge lu={book.lu} />
      </Pressable>
      <View className="flex-row items-center gap-1 pr-3">
        <FavoriteToggle book={book} />
        <ReadToggle book={book} />
      </View>
    </View>
  )
})

BookListItem.displayName = "BookListItem"
