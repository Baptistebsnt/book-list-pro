import { ImageUp, RotateCcw } from "lucide-react-native"
import { useTranslation } from "react-i18next"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { toast } from "@/components/ui/toast"
import { type Book } from "@/domain/book"
import { useTheme } from "@/hooks/use-theme"
import { hasCoverSource } from "@/services/api/covers"
import {
  PayloadTooLargeError,
  UnsupportedMediaError,
} from "@/services/api/errors"
import {
  canPickCoverImage,
  pickCoverImage,
} from "@/services/media/image-picker"
import { useReplaceCover, useRestoreCover } from "@/services/query/books"

const ICON_SIZE = 16

const failureKey = (error: unknown): string => {
  if (error instanceof UnsupportedMediaError) {
    return "books.cover.unsupportedMedia"
  }

  if (error instanceof PayloadTooLargeError) {
    return "books.cover.tooLarge"
  }

  return "books.cover.uploadError"
}

export const CoverActions = ({ book }: { book: Book }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const replace = useReplaceCover(book.id)
  const restore = useRestoreCover(book.id)
  const canPick = canPickCoverImage()
  const isBusy = replace.isPending || restore.isPending

  const send = async () => {
    const picked = await pickCoverImage()

    if (picked.status === "unsupported") {
      toast.show(t("books.cover.unsupportedPlatform"), { type: "info" })

      return
    }

    if (picked.status === "cancelled") {
      return
    }

    replace.mutate(picked.image, {
      onSuccess: () =>
        toast.show(t("books.cover.replaced", { title: book.titre }), {
          type: "success",
        }),
      onError: (error) => toast.show(t(failureKey(error)), { type: "error" }),
    })
  }

  const reset = () => {
    restore.mutate(void 0, {
      onSuccess: () =>
        toast.show(t("books.cover.restored"), { type: "success" }),
      onError: () =>
        toast.show(t("books.cover.restoreError"), { type: "error" }),
    })
  }

  return (
    <View className="gap-2">
      <View className="flex-row flex-wrap justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onPress={() => void send()}
          disabled={isBusy || !canPick}
          aria-busy={replace.isPending}
        >
          <ImageUp size={ICON_SIZE} color={theme.foreground} />
          <Text>
            {replace.isPending
              ? t("books.cover.sending")
              : t("books.cover.replace")}
          </Text>
        </Button>
        {hasCoverSource(book.couverture) && (
          <Button
            variant="ghost"
            size="sm"
            onPress={reset}
            disabled={isBusy}
            aria-busy={restore.isPending}
          >
            <RotateCcw size={ICON_SIZE} color={theme.foreground} />
            <Text>{t("books.cover.restore")}</Text>
          </Button>
        )}
      </View>
      {!canPick && (
        <Text variant="muted" className="text-center">
          {t("books.cover.unsupportedPlatform")}
        </Text>
      )}
    </View>
  )
}
