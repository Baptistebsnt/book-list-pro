import { Stack, useLocalSearchParams } from "expo-router"
import { BookDetail } from "@/features/books/book-detail"
import { useBook } from "@/services/query/books"

const FALLBACK_TITLE = "Fiche de l'ouvrage"

const BookDetailsRoute = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data } = useBook(id)

  return (
    <>
      <Stack.Screen options={{ title: data?.titre ?? FALLBACK_TITLE }} />
      <BookDetail id={id} />
    </>
  )
}

export default BookDetailsRoute
