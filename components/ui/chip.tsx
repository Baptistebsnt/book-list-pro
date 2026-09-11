import { type LucideIcon } from "lucide-react-native"
import { Platform, Pressable, View } from "react-native"
import { Text } from "@/components/ui/text"
import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"

type ChipProps = {
  label: string
  isActive: boolean
  onPress: () => void
  role: "radio" | "switch"
  icon?: LucideIcon | null
  accessibilityLabel?: string
}

const ICON_SIZE = 14

export const Chip = ({
  label,
  isActive,
  onPress,
  role,
  icon: Icon,
  accessibilityLabel,
}: ChipProps) => {
  const theme = useTheme()
  const color = isActive ? theme.primaryForeground : theme.foreground

  return (
    <Pressable
      onPress={onPress}
      role={role}
      aria-label={accessibilityLabel ?? label}
      aria-checked={isActive}
      className={cn(
        "h-11 flex-row items-center gap-1.5 rounded-full border px-4",
        isActive
          ? "border-primary bg-primary"
          : "border-border bg-background active:bg-muted",
        Platform.select({ web: isActive ? "" : "hover:bg-muted" }),
      )}
    >
      {Icon && (
        <View>
          <Icon size={ICON_SIZE} color={color} />
        </View>
      )}
      <Text
        variant="small"
        className={cn(isActive ? "text-primary-foreground" : "text-foreground")}
      >
        {label}
      </Text>
    </Pressable>
  )
}
