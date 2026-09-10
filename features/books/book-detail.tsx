import { Stack } from "expo-router"
import { ScrollView } from "react-native"
import { BookDetailContent } from "@/components/books/book-detail-content"
import { useBook } from "@/services/query/books"

type BookDetailProps = {
  id: string
}

const FALLBACK_TITLE = "Fiche de l'ouvrage"

export const BookDetail = ({ id }: BookDetailProps) => {
  const query = useBook(id)

  return (
    <>
      <Stack.Screen options={{ title: query.data?.titre ?? FALLBACK_TITLE }} />
      <ScrollView
        contentContainerClassName="gap-6 p-4"
        className="bg-background"
      >
        <BookDetailContent query={query} />
      </ScrollView>
    </>
  )
}
