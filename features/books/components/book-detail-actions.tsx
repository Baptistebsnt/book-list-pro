import { Link, useRouter } from "expo-router"
import { useState } from "react"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { type Book } from "@/domain/book"
import { useDeleteBook } from "../mutations"
import { DeleteBookDialog } from "./delete-book-dialog"

export const BookDetailActions = ({ book }: { book: Book }) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const router = useRouter()
  const deletion = useDeleteBook()

  const confirmDeletion = () => {
    deletion.mutate(book.id, {
      onSuccess: () => {
        setIsConfirming(false)
        router.replace("/")
      },
    })
  }

  return (
    <View className="gap-3">
      <Link
        href={{ pathname: "/books/[id]/edit", params: { id: book.id } }}
        asChild
      >
        <Button>
          <Text>Modifier la fiche</Text>
        </Button>
      </Link>
      <Button variant="outline" onPress={() => setIsConfirming(true)}>
        <Text>Supprimer l&apos;ouvrage</Text>
      </Button>
      <DeleteBookDialog
        visible={isConfirming}
        title={book.titre}
        isDeleting={deletion.isPending}
        hasFailed={deletion.isError}
        onCancel={() => setIsConfirming(false)}
        onConfirm={confirmDeletion}
      />
    </View>
  )
}
