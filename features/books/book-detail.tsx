import { ScrollView } from "react-native"
import { BookDetailContent } from "@/components/books/book-detail-content"
import { useBook } from "@/services/query/books"
import { ReadingNotes } from "./reading-notes"

type BookDetailProps = {
  id: string
}

export const BookDetail = ({ id }: BookDetailProps) => {
  const query = useBook(id)

  return (
    <ScrollView contentContainerClassName="gap-6 p-4" className="bg-background">
      <BookDetailContent query={query} />
      {query.isSuccess ? <ReadingNotes bookId={query.data.id} /> : null}
    </ScrollView>
  )
}
