import { Stack, useLocalSearchParams } from "expo-router"
import { BookEdit } from "@/features/books/book-edit"
import { useBook } from "@/services/query/books"

const FALLBACK_TITLE = "Modifier l'ouvrage"

const EditBookRoute = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data } = useBook(id)

  return (
    <>
      <Stack.Screen
        options={{
          title: data ? `Modifier « ${data.titre} »` : FALLBACK_TITLE,
        }}
      />
      <BookEdit id={id} />
    </>
  )
}

export default EditBookRoute
