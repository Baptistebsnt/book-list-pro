import { Button } from "@/components/ui/button"
import { Centered } from "@/components/ui/centered"
import { Text } from "@/components/ui/text"

type ErrorStateProps = {
  message: string
  refetch: () => void
  title?: string
}

export const ErrorState = ({
  message,
  refetch,
  title = "Une erreur est survenue",
}: ErrorStateProps) => (
  <Centered>
    <Text variant="large">{title}</Text>
    <Text variant="muted" className="text-center">
      {message}
    </Text>
    <Button onPress={() => refetch()}>
      <Text>Réessayer</Text>
    </Button>
  </Centered>
)
