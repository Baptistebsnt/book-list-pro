import { useTranslation } from "react-i18next"
import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"

type ReadBadgeProps = {
  lu: boolean
}

export const ReadBadge = ({ lu }: ReadBadgeProps) => {
  const { t } = useTranslation()

  return (
    <View
      className={cn(
        "rounded-full px-2.5 py-1",
        lu ? "bg-primary" : "border border-border bg-muted",
      )}
    >
      <Text
        className={cn(
          "text-xs font-medium",
          lu ? "text-primary-foreground" : "text-muted-foreground",
        )}
      >
        {lu ? t("books.status.read") : t("books.status.unread")}
      </Text>
    </View>
  )
}
