import { Link } from "expo-router"
import { Text, View } from "react-native"

const BooksListRoute = () => (
  <View>
    <Text> Liste des ouvrages </Text>
    <Link href="/books/1">Voir un ouvrage</Link>
  </View>
)

export default BooksListRoute
