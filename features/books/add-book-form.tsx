import { useRouter } from "expo-router"
import { View } from "react-native"
import { BookForm } from "@/components/books/book-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { Text } from "@/components/ui/text"
import { toast } from "@/components/ui/toast"
import { type BookDraft, EMPTY_DRAFT } from "@/domain/book"
import { useCreateBook } from "@/services/query/books"

export const AddBookForm = () => {
  const router = useRouter()
  const createBook = useCreateBook()

  const onSubmit = async (values: BookDraft) => {
    const book = await createBook.mutateAsync(values)

    toast.show(`« ${book.titre} » a rejoint le fonds.`, { type: "success" })
    router.replace("/")
  }

  return (
    <View className="flex-1 justify-center bg-background p-6">
      <View className="w-full max-w-md gap-5 self-center">
        <View className="flex-row items-center justify-between gap-3">
          <Text variant="h3">Ajouter un ouvrage</Text>
          <ThemeToggle />
        </View>
        <BookForm
          defaultValues={EMPTY_DRAFT}
          submitLabel="Créer l'ouvrage"
          onSubmit={onSubmit}
          onCancel={() => router.replace("/")}
        />
      </View>
    </View>
  )
}
