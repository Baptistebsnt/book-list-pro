import { Switch as RNSwitch } from "react-native"
import { useTheme } from "@/hooks/use-theme"

type SwitchProps = {
  value: boolean
  onValueChange: (value: boolean) => void
  accessibilityLabel: string
  disabled?: boolean
}

export const Switch = ({
  value,
  onValueChange,
  accessibilityLabel,
  disabled = false,
}: SwitchProps) => {
  const theme = useTheme()

  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      trackColor={{ false: theme.muted, true: theme.primary }}
      thumbColor={theme.background}
    />
  )
}
