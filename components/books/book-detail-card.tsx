import { useTranslation } from "react-i18next"
import { View } from "react-native"
import { BookCover } from "@/components/books/book-cover"
import { FavoriteToggle } from "@/components/books/favorite-toggle"
import { NoteRating } from "@/components/books/note-rating"
import { ReadToggle } from "@/components/books/read-toggle"
import { Text } from "@/components/ui/text"
import { type Book } from "@/domain/book"
import { cn } from "@/lib/utils"
import { hasCoverSource, resolveCoverUrl } from "@/services/api/covers"

type DetailRowProps = {
  label: string
  value: string
}

const DetailRow = ({ label, value }: DetailRowProps) => (
  <View className="gap-1 border-b border-border py-3">
    <Text variant="small" className="text-muted-foreground">
      {label}
    </Text>
    <Text>{value}</Text>
  </View>
)

const ReadingStatus = ({ lu }: { lu: boolean }) => {
  const { t } = useTranslation()

  return (
    <View
      className={cn(
        "self-start rounded-full px-3 py-1",
        lu ? "bg-primary" : "bg-muted",
      )}
    >
      <Text
        variant="small"
        className={cn(lu ? "text-primary-foreground" : "text-muted-foreground")}
      >
        {lu ? t("books.status.readByTeam") : t("books.status.unread")}
      </Text>
    </View>
  )
}

export const BookDetailCard = ({ book }: { book: Book }) => {
  const { t } = useTranslation()

  const orMissing = (value: string): string =>
    value.trim().length === 0 ? t("books.field.missing") : value

  return (
    <View className="gap-4 rounded-lg border border-border bg-card p-4">
      <BookCover
        uri={resolveCoverUrl(book.couverture, book.id)}
        hasSource={hasCoverSource(book.couverture)}
        seed={book.id}
        title={book.titre}
        author={book.auteur}
        label={t("books.coverAlt", { title: book.titre })}
        className="h-56 w-40 self-center"
      />
      <View className="gap-3">
        <View className="flex-row items-start justify-between gap-3">
          <Text variant="h3" className="flex-1">
            {book.titre}
          </Text>
          <FavoriteToggle book={book} />
        </View>
        <View className="flex-row items-center justify-between gap-3">
          <ReadingStatus lu={book.lu} />
          <ReadToggle book={book} />
        </View>
        <View className="gap-1.5">
          <Text variant="small" className="text-muted-foreground">
            {t("books.detail.internalRating")}
          </Text>
          <NoteRating book={book} />
        </View>
      </View>
      <View>
        <DetailRow
          label={t("books.field.author")}
          value={orMissing(book.auteur)}
        />
        <DetailRow
          label={t("books.field.publisher")}
          value={orMissing(book.editeur)}
        />
        <DetailRow
          label={t("books.field.publishYear")}
          value={String(book.annee)}
        />
      </View>
    </View>
  )
}
