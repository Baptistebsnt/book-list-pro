import { TriangleAlert } from "lucide-react-native"
import { StateView } from "@/components/state-view"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

type ErrorStateProps = {
  title?: string
  description?: string
  onRetry: () => void
  isRetrying?: boolean
}

const DEFAULT_TITLE = "Impossible d'afficher ces données"

const DEFAULT_DESCRIPTION =
  "Le serveur n'a pas répondu. Vérifiez la connexion de la boutique, puis réessayez."

export const ErrorState = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  onRetry,
  isRetrying = false,
}: ErrorStateProps) => (
  <StateView icon={TriangleAlert} title={title} description={description}>
    <Button variant="outline" onPress={onRetry} disabled={isRetrying}>
      <Text>{isRetrying ? "Nouvel essai…" : "Réessayer"}</Text>
    </Button>
  </StateView>
)
