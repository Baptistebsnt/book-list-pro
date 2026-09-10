import { Link, Stack, useLocalSearchParams } from "expo-router"
import { Text, View } from "react-native"

const BookDetailsRoute = () => {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <>
      <Stack.Screen options={{ title: id }} />
      <View>
        <Text>Fiche détaillée</Text>
        <Text>Identifiant : {id}</Text>
        <Link
          href={{
            pathname: "/books/[id]/edit",
            params: { id },
          }}
        >
          Modifier cet ouvrage
        </Link>

        <Link href="/">Retour à la liste</Link>
      </View>
    </>
  )
}

export default BookDetailsRoute
