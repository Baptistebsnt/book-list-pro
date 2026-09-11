import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

type DeletionFailureBarProps = {
  titre: string
  onDismiss: () => void
}

export const DeletionFailureBar = ({
  titre,
  onDismiss,
}: DeletionFailureBarProps) => (
  <View
    role="alert"
    aria-live="assertive"
    className="flex-row items-center gap-3 rounded-lg border border-destructive bg-card p-3 shadow-lg shadow-black/10"
  >
    <View className="flex-1 gap-0.5">
      <Text numberOfLines={1}>Échec de la suppression</Text>
      <Text variant="muted">« {titre} » est toujours dans le fonds.</Text>
    </View>
    <Button size="sm" variant="outline" onPress={onDismiss}>
      <Text>Fermer</Text>
    </Button>
  </View>
)
