import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { type Book } from "@/domain/book"
import { useToggleReadStatus } from "@/services/query/books"

type ReadToggleProps = {
  book: Book
}

export const ReadToggle = ({ book }: ReadToggleProps) => {
  const { mutate, isPending } = useToggleReadStatus()

  const toggle = (lu: boolean) => {
    mutate(
      { id: book.id, version: book.version, lu },
      {
        onError: () => {
          toast.show(
            `Impossible de mettre à jour « ${book.titre} ». Réessayez plus tard.`,
            { type: "error" },
          )
        },
      },
    )
  }

  return (
    <Switch
      checked={book.lu}
      onCheckedChange={toggle}
      disabled={isPending}
      accessibilityLabel={`Marquer « ${book.titre} » comme ${
        book.lu ? "non lu" : "lu"
      }`}
    />
  )
}
