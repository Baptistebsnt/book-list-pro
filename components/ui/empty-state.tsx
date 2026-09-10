import { Centered } from "@/components/ui/centered"
import { Text } from "@/components/ui/text"

type EmptyStateProps = {
  title: string
  message?: string
}

export const EmptyState = ({ title, message }: EmptyStateProps) => (
  <Centered>
    <Text variant="large">{title}</Text>
    {message ? <Text variant="muted">{message}</Text> : null}
  </Centered>
)
