import { Switch } from "@/components/ui/switch"
import { type Book } from "@/domain/book"
import { usePatchBook } from "@/services/query/books"

type ReadToggleProps = {
  book: Book
}

export const ReadToggle = ({ book }: ReadToggleProps) => {
  const { mutate, isPending } = usePatchBook()

  const toggle = (lu: boolean) => {
    mutate({ id: book.id, version: book.version, changes: { lu } })
  }

  return (
    <Switch
      value={book.lu}
      onValueChange={toggle}
      disabled={isPending}
      accessibilityLabel={`Marquer « ${book.titre} » comme ${
        book.lu ? "non lu" : "lu"
      }`}
    />
  )
}
