import { Link, useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { View } from "react-native"
import { DeleteBookDialog } from "@/components/books/delete-book-dialog"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { type Book } from "@/domain/book"
import { useDeferredDeletion } from "@/providers/deferred-deletion"

type BookDetailActionsProps = {
  book: Book
}

export const BookDetailActions = ({ book }: BookDetailActionsProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { requestDeletion } = useDeferredDeletion()

  const confirmDeletion = () => {
    requestDeletion({ id: book.id, titre: book.titre })

    if (router.canGoBack()) {
      router.back()

      return
    }

    router.replace("/")
  }

  return (
    <View className="gap-3">
      <Link
        href={{ pathname: "/books/[id]/edit", params: { id: book.id } }}
        asChild
      >
        <Button>
          <Text>{t("books.detail.edit")}</Text>
        </Button>
      </Link>
      <DeleteBookDialog titre={book.titre} onConfirm={confirmDeletion} />
    </View>
  )
}
