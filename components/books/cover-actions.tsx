import { ImageUp, RotateCcw } from "lucide-react-native"
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

const RESTORE_LABEL = "Couverture d'origine"

const UNSUPPORTED_PLATFORM =
  "Le choix d'un fichier n'est disponible que depuis le navigateur."

const uploadFailure = (error: unknown): string => {
  if (error instanceof UnsupportedMediaError) {
    return "Format refusé : choisissez une image PNG, JPEG ou WebP."
  }

  if (error instanceof PayloadTooLargeError) {
    return "Image trop lourde même après redimensionnement : choisissez une image moins grande."
  }

  return "Impossible d'envoyer cette couverture. Réessayez plus tard."
}

export const CoverActions = ({ book }: { book: Book }) => {
  const theme = useTheme()
  const replace = useReplaceCover(book.id)
  const restore = useRestoreCover(book.id)
  const canPick = canPickCoverImage()
  const isBusy = replace.isPending || restore.isPending

  const send = async () => {
    const picked = await pickCoverImage()

    if (picked.status === "unsupported") {
      toast.show(UNSUPPORTED_PLATFORM, { type: "info" })

      return
    }

    if (picked.status === "cancelled") {
      return
    }

    replace.mutate(picked.image, {
      onSuccess: () =>
        toast.show(`Couverture de « ${book.titre} » remplacée.`, {
          type: "success",
        }),
      onError: (error) => toast.show(uploadFailure(error), { type: "error" }),
    })
  }

  const reset = () => {
    restore.mutate(void 0, {
      onSuccess: () =>
        toast.show("Couverture d'origine rétablie.", { type: "success" }),
      onError: () =>
        toast.show("Impossible de rétablir la couverture d'origine.", {
          type: "error",
        }),
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
            {replace.isPending ? "Envoi en cours…" : "Remplacer la couverture"}
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
            <Text>{RESTORE_LABEL}</Text>
          </Button>
        )}
      </View>
      {!canPick && (
        <Text variant="muted" className="text-center">
          {UNSUPPORTED_PLATFORM}
        </Text>
      )}
    </View>
  )
}
