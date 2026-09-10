import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { useCountdown } from "@/hooks/use-countdown"

type UndoDeletionBarProps = {
  titre: string
  seconds: number
  onUndo: () => void
}

export const UndoDeletionBar = ({
  titre,
  seconds,
  onUndo,
}: UndoDeletionBarProps) => {
  const remaining = useCountdown(seconds)

  return (
    <View className="flex-row items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-lg shadow-black/10">
      <View className="flex-1 gap-0.5">
        <Text numberOfLines={1}>« {titre} » supprimé</Text>
        <Text variant="muted">Annulation possible pendant {remaining} s</Text>
      </View>
      <Button size="sm" variant="outline" onPress={onUndo}>
        <Text>Annuler</Text>
      </Button>
    </View>
  )
}
