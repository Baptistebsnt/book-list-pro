import { Link } from "expo-router"
import { Text, View } from "react-native"

const BooksListRoute = () => {
  return (
    <View>
      <Text> Liste des ouvrages </Text>
      <Link href="/books/1">Voir un ouvrage</Link>
    </View>
  )
}

export default BooksListRoute
