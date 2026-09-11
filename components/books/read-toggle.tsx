import { useTranslation } from "react-i18next"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { type Book } from "@/domain/book"
import { useToggleReadStatus } from "@/services/query/books"

type ReadToggleProps = {
  book: Book
}

export const ReadToggle = ({ book }: ReadToggleProps) => {
  const { t } = useTranslation()
  const { mutate, isPending } = useToggleReadStatus()

  const toggle = (lu: boolean) => {
    mutate(
      { id: book.id, version: book.version, lu },
      {
        onError: () => {
          toast.show(t("books.updateError", { title: book.titre }), {
            type: "error",
          })
        },
      },
    )
  }

  return (
    <Switch
      checked={book.lu}
      onCheckedChange={toggle}
      disabled={isPending}
      accessibilityLabel={
        book.lu
          ? t("books.read.markUnread", { title: book.titre })
          : t("books.read.markRead", { title: book.titre })
      }
    />
  )
}
