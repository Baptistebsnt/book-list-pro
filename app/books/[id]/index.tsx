import { Stack, useLocalSearchParams } from "expo-router"
import { ScrollView } from "react-native"
import { BookDetail } from "@/features/books/components/book-detail"
import { useBook } from "@/features/books/queries"

const FALLBACK_TITLE = "Fiche de l'ouvrage"

const BookDetailsRoute = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const query = useBook(id)

  return (
    <>
      <Stack.Screen options={{ title: query.data?.titre ?? FALLBACK_TITLE }} />
      <ScrollView
        contentContainerClassName="gap-6 p-4"
        className="bg-background"
      >
        <BookDetail query={query} />
      </ScrollView>
    </>
  )
}

export default BookDetailsRoute
