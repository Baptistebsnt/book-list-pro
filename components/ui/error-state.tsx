import { TriangleAlert } from "lucide-react-native"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { StateView } from "@/components/ui/state-view"
import { Text } from "@/components/ui/text"

type ErrorStateProps = {
  onRetry: () => void
  title?: string
  description?: string
  isRetrying?: boolean
}

export const ErrorState = ({
  onRetry,
  title,
  description,
  isRetrying = false,
}: ErrorStateProps) => {
  const { t } = useTranslation()

  return (
    <StateView
      icon={TriangleAlert}
      title={title ?? t("errors.defaultTitle")}
      description={description ?? t("errors.defaultDescription")}
    >
      <Button variant="outline" onPress={onRetry} disabled={isRetrying}>
        <Text>{isRetrying ? t("common.retrying") : t("common.retry")}</Text>
      </Button>
    </StateView>
  )
}
