import { useRouter } from "expo-router"
import { BookX } from "lucide-react-native"
import { StateView } from "@/components/state-view"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

export const BookNotFoundState = () => {
  const router = useRouter()

  return (
    <StateView
      icon={BookX}
      title="Cette fiche n'existe plus"
      description="L'ouvrage demandé est introuvable : il a sans doute été supprimé depuis un autre poste du réseau."
    >
      <Button variant="outline" onPress={() => router.replace("/")}>
        <Text>Retour à la liste</Text>
      </Button>
    </StateView>
  )
}
