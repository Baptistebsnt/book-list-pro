import { Heart } from "lucide-react-native"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Platform, Pressable, View } from "react-native"
import { Text } from "@/components/ui/text"
import { type Book } from "@/domain/book"
import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"
import { useToggleFavorite } from "@/services/query/books"

type FavoriteToggleProps = {
  book: Book
}

const ICON_SIZE = 22

const HIT_SLOP = 8

export const FavoriteToggle = ({ book }: FavoriteToggleProps) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [hasFailed, setHasFailed] = useState(false)
  const { mutate, isPending } = useToggleFavorite()

  const label = book.favori
    ? t("books.favorite.remove", { title: book.titre })
    : t("books.favorite.add", { title: book.titre })

  const toggle = () => {
    setHasFailed(false)
    mutate(
      { id: book.id, version: book.version, favori: !book.favori },
      { onError: () => setHasFailed(true) },
    )
  }

  return (
    <View className="items-center gap-0.5">
      <Pressable
        onPress={toggle}
        disabled={isPending}
        hitSlop={HIT_SLOP}
        role="switch"
        aria-label={label}
        aria-checked={book.favori}
        aria-busy={isPending}
        className={cn(
          "h-11 w-11 items-center justify-center rounded-full active:bg-muted",
          Platform.select({ web: "hover:bg-muted" }),
          isPending && "opacity-60",
        )}
      >
        <Heart
          size={ICON_SIZE}
          color={book.favori ? theme.destructive : theme.mutedForeground}
          fill={book.favori ? theme.destructive : "transparent"}
        />
      </Pressable>
      {hasFailed && (
        <Text
          variant="small"
          className="text-xs text-destructive"
          aria-live="polite"
          aria-label={t("books.favorite.saveError", { title: book.titre })}
        >
          {t("common.failure")}
        </Text>
      )}
    </View>
  )
}
