import { useRouter } from "expo-router"
import { View } from "react-native"
import { BookForm } from "@/components/books/book-form"
import { Text } from "@/components/ui/text"
import { type BookDraft, EMPTY_DRAFT } from "@/domain/book"
import { useCreateBook } from "@/services/query/books"

export const AddBookForm = () => {
  const router = useRouter()
  const createBook = useCreateBook()

  const onSubmit = async (values: BookDraft) => {
    await createBook.mutateAsync(values)
    router.replace("/")
  }

  return (
    <View className="flex-1 justify-center bg-background p-6">
      <View className="w-full max-w-md gap-5 self-center">
        <Text variant="h3">Ajouter un ouvrage</Text>
        <BookForm
          defaultValues={EMPTY_DRAFT}
          submitLabel="Creer l'ouvrage"
          onSubmit={onSubmit}
          onCancel={() => router.replace("/")}
        />
      </View>
    </View>
  )
}
