import { TriangleAlert } from "lucide-react-native"
import { Button } from "@/components/ui/button"
import { StateView } from "@/components/ui/state-view"
import { Text } from "@/components/ui/text"

type ErrorStateProps = {
  onRetry: () => void
  title?: string
  description?: string
  isRetrying?: boolean
}

const DEFAULT_TITLE = "Impossible d'afficher ces données"

const DEFAULT_DESCRIPTION =
  "Le serveur n'a pas répondu. Vérifiez la connexion de la boutique, puis réessayez."

export const ErrorState = ({
  onRetry,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  isRetrying = false,
}: ErrorStateProps) => (
  <StateView icon={TriangleAlert} title={title} description={description}>
    <Button variant="outline" onPress={onRetry} disabled={isRetrying}>
      <Text>{isRetrying ? "Nouvel essai…" : "Réessayer"}</Text>
    </Button>
  </StateView>
)
