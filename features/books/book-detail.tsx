import { ScrollView } from "react-native"
import { BookDetailContent } from "@/components/books/book-detail-content"
import { useBook } from "@/services/query/books"

type BookDetailProps = {
  id: string
}

export const BookDetail = ({ id }: BookDetailProps) => {
  const query = useBook(id)

  return (
    <ScrollView contentContainerClassName="gap-6 p-4" className="bg-background">
      <BookDetailContent query={query} />
    </ScrollView>
  )
}
