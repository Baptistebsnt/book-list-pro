import { Stack, useLocalSearchParams } from "expo-router"
import { useTranslation } from "react-i18next"
import { BookDetail } from "@/features/books/book-detail"
import { useBook } from "@/services/query/books"

const BookDetailsRoute = () => {
  const { t } = useTranslation()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data } = useBook(id)

  return (
    <>
      <Stack.Screen
        options={{ title: data?.titre ?? t("books.detail.fallbackTitle") }}
      />
      <BookDetail id={id} />
    </>
  )
}

export default BookDetailsRoute
