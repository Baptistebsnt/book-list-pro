import { Stack, useLocalSearchParams } from "expo-router"
import { useTranslation } from "react-i18next"
import { BookEdit } from "@/features/books/book-edit"
import { useBook } from "@/services/query/books"

const EditBookRoute = () => {
  const { t } = useTranslation()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data } = useBook(id)

  return (
    <>
      <Stack.Screen
        options={{
          title: data
            ? t("books.edit.title", { title: data.titre })
            : t("books.edit.fallbackTitle"),
        }}
      />
      <BookEdit id={id} />
    </>
  )
}

export default EditBookRoute
