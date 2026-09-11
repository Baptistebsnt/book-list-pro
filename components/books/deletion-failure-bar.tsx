import { useTranslation } from "react-i18next"
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
}: DeletionFailureBarProps) => {
  const { t } = useTranslation()

  return (
    <View
      role="alert"
      aria-live="assertive"
      className="flex-row items-center gap-3 rounded-lg border border-destructive bg-card p-3 shadow-lg shadow-overlay/10"
    >
      <View className="flex-1 gap-0.5">
        <Text numberOfLines={1}>{t("books.deletion.failureTitle")}</Text>
        <Text variant="muted">
          {t("books.deletion.failureDescription", { title: titre })}
        </Text>
      </View>
      <Button size="sm" variant="outline" onPress={onDismiss}>
        <Text>{t("common.close")}</Text>
      </Button>
    </View>
  )
}
