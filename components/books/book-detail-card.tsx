import { View } from "react-native"
import { FavoriteToggle } from "@/components/books/favorite-toggle"
import { ReadToggle } from "@/components/books/read-toggle"
import { Text } from "@/components/ui/text"
import { type Book } from "@/domain/book"
import { cn } from "@/lib/utils"

type DetailRowProps = {
  label: string
  value: string
}

const MISSING_VALUE = "Non renseigné"

const orMissing = (value: string): string =>
  value.trim().length === 0 ? MISSING_VALUE : value

const DetailRow = ({ label, value }: DetailRowProps) => (
  <View className="gap-1 border-b border-border py-3">
    <Text variant="small" className="text-muted-foreground">
      {label}
    </Text>
    <Text>{value}</Text>
  </View>
)

const ReadingStatus = ({ lu }: { lu: boolean }) => (
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
      {lu ? "Lu par l'équipe" : "Non lu"}
    </Text>
  </View>
)

export const BookDetailCard = ({ book }: { book: Book }) => (
  <View className="gap-4 rounded-lg border border-border bg-card p-4">
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
    </View>
    <View>
      <DetailRow label="Auteur" value={orMissing(book.auteur)} />
      <DetailRow label="Éditeur" value={orMissing(book.editeur)} />
      <DetailRow label="Année de publication" value={String(book.annee)} />
    </View>
  </View>
)
