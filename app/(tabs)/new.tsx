import { Link } from "expo-router"
import { Text, View } from "react-native"

const NewBookRoute = () => {
  return (
    <View>
      <Text>Ajouter un ouvrage</Text>
      <Link href="/">Annuler et revenir à la liste</Link>
    </View>
  )
}

export default NewBookRoute
