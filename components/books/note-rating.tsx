import { Star } from "lucide-react-native"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Platform, Pressable, View } from "react-native"
import { Text } from "@/components/ui/text"
import { type Book, MAX_RATING } from "@/domain/book"
import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"
import { useSetNote } from "@/services/query/books"

type NoteRatingProps = {
  book: Book
}

const ICON_SIZE = 22

const HIT_SLOP = 6

const STARS = Array.from({ length: MAX_RATING }, (_, index) => index + 1)

export const NoteRating = ({ book }: NoteRatingProps) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [hasFailed, setHasFailed] = useState(false)
  const { mutate, isPending } = useSetNote()

  const starLabel = (star: number): string =>
    t("books.rating.set", { title: book.titre, star, max: MAX_RATING })

  const valueLabel = (note: number | null): string =>
    note === null
      ? t("books.rating.unrated")
      : t("books.rating.value", { note, max: MAX_RATING })

  const setNote = (note: number | null) => {
    setHasFailed(false)
    mutate(
      { id: book.id, version: book.version, note },
      { onError: () => setHasFailed(true) },
    )
  }

  const select = (star: number) => setNote(book.note === star ? star - 1 : star)

  return (
    <View className="gap-1">
      <View
        role="radiogroup"
        aria-label={t("books.rating.groupLabel", { title: book.titre })}
        className="flex-row items-center gap-1"
      >
        {STARS.map((star) => {
          const filled = book.note !== null && star <= book.note

          return (
            <Pressable
              key={star}
              onPress={() => select(star)}
              disabled={isPending}
              hitSlop={HIT_SLOP}
              role="radio"
              aria-checked={book.note === star}
              aria-label={starLabel(star)}
              aria-busy={isPending}
              className={cn(
                "h-11 w-11 items-center justify-center rounded-full active:bg-muted",
                Platform.select({ web: "hover:bg-muted" }),
                isPending && "opacity-60",
              )}
            >
              <Star
                size={ICON_SIZE}
                color={filled ? theme.warning : theme.mutedForeground}
                fill={filled ? theme.warning : "transparent"}
              />
            </Pressable>
          )
        })}
        {book.note !== null && (
          <Pressable
            onPress={() => setNote(null)}
            disabled={isPending}
            hitSlop={HIT_SLOP}
            role="button"
            aria-label={t("books.rating.clearLabel", { title: book.titre })}
            aria-busy={isPending}
            className={cn(
              "ml-1 h-11 items-center justify-center rounded-full px-3 active:bg-muted",
              Platform.select({ web: "hover:bg-muted" }),
              isPending && "opacity-60",
            )}
          >
            <Text variant="small" className="text-muted-foreground">
              {t("common.clear")}
            </Text>
          </Pressable>
        )}
      </View>
      {hasFailed ? (
        <Text
          variant="small"
          className="text-xs text-destructive"
          aria-live="polite"
          aria-label={t("books.rating.saveError", { title: book.titre })}
        >
          {t("common.failure")}
        </Text>
      ) : (
        <Text variant="small" className="text-muted-foreground">
          {valueLabel(book.note)}
        </Text>
      )}
    </View>
  )
}
