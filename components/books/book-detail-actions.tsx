import { Link } from "expo-router"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

type BookDetailActionsProps = {
  bookId: string
  onDelete: () => void
}

export const BookDetailActions = ({
  bookId,
  onDelete,
}: BookDetailActionsProps) => (
  <View className="gap-3">
    <Link
      href={{ pathname: "/books/[id]/edit", params: { id: bookId } }}
      asChild
    >
      <Button>
        <Text>Modifier la fiche</Text>
      </Button>
    </Link>
    <Button variant="outline" onPress={onDelete}>
      <Text>Supprimer l&apos;ouvrage</Text>
    </Button>
  </View>
)
