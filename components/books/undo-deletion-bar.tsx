import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()
  const remaining = useCountdown(seconds)

  return (
    <View
      aria-live="polite"
      className="flex-row items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-lg shadow-overlay/10"
    >
      <View className="flex-1 gap-0.5">
        <Text numberOfLines={1}>
          {t("books.deletion.undoTitle", { title: titre })}
        </Text>
        <Text variant="muted">
          {t("books.deletion.undoCountdown", { seconds: remaining })}
        </Text>
      </View>
      <Button size="sm" variant="outline" onPress={onUndo}>
        <Text>{t("common.cancel")}</Text>
      </Button>
    </View>
  )
}
