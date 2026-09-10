import { type ReactNode } from "react"
import { View } from "react-native"
import { Text } from "@/components/ui/text"

type FieldProps = {
  label: string
  error?: string
  children: ReactNode
}

export const Field = ({ label, error, children }: FieldProps) => (
  <View className="gap-1.5">
    <Text variant="small">{label}</Text>
    {children}
    {error ? <Text className="text-sm text-destructive">{error}</Text> : null}
  </View>
)
