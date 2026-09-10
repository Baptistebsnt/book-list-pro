import { Inbox, type LucideIcon } from "lucide-react-native"
import { type ReactNode } from "react"
import { StateView } from "@/components/ui/state-view"

type EmptyStateProps = {
  title: string
  description: string
  icon?: LucideIcon
  children?: ReactNode
}

export const EmptyState = ({
  title,
  description,
  icon = Inbox,
  children,
}: EmptyStateProps) => (
  <StateView icon={icon} title={title} description={description}>
    {children}
  </StateView>
)
