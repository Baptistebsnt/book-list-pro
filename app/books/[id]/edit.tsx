import { Link, Stack, useLocalSearchParams } from "expo-router"
import { Text, View } from "react-native"

const EditBookRoute = () => {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <>
      <Stack.Screen options={{ title: id }} />
      <View>
        <Text>Modifier un ouvrage</Text>
        <Text>Identifiant : {id}</Text>
        <Link
          href={{
            pathname: "/books/[id]",
            params: { id },
          }}
        >
          Annuler et revenir à la fiche
        </Link>
      </View>
    </>
  )
}

export default EditBookRoute
