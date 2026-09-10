import { Link } from "expo-router"
import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { useBooks } from "@/services/query/books"

const BooksListRoute = () => {
  const { data } = useBooks({ limit: 1 })
  const book = data?.items[0]

  return (
    <View className="gap-3 p-4">
      <Text variant="h3">Liste des ouvrages</Text>
      {book ? (
        <Link href={{ pathname: "/books/[id]", params: { id: book.id } }}>
          <Text>Voir « {book.titre} »</Text>
        </Link>
      ) : (
        <Text variant="muted">Chargement du fonds…</Text>
      )}
    </View>
  )
}

export default BooksListRoute
