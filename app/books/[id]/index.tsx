import { useLocalSearchParams } from "expo-router"
import { BookDetail } from "@/features/books/book-detail"

const BookDetailsRoute = () => {
  const { id } = useLocalSearchParams<{ id: string }>()

  return <BookDetail id={id} />
}

export default BookDetailsRoute
