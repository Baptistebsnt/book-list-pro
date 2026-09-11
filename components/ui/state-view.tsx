import { type LucideIcon } from "lucide-react-native"
import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { useTheme } from "@/hooks/use-theme"

type StateViewProps = {
  icon: LucideIcon
  title: string
  description: string
  children?: React.ReactNode
}

const ICON_SIZE = 32

export const StateView = ({
  icon: Icon,
  title,
  description,
  children,
}: StateViewProps) => {
  const theme = useTheme()

  return (
    <View
      className="items-center gap-3 rounded-lg border border-dashed border-border p-8"
      accessibilityRole="summary"
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Icon color={theme.mutedForeground} size={ICON_SIZE} />
      </View>
      <Text variant="large" className="text-center">
        {title}
      </Text>
      <Text variant="muted" className="text-center">
        {description}
      </Text>
      {children}
    </View>
  )
}
