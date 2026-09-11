import {
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
} from "react"
import { View } from "react-native"
import { Text } from "@/components/ui/text"

type FieldChildProps = {
  "aria-label"?: string
  "aria-invalid"?: boolean
}

type FieldProps = {
  label: string
  error?: string
  children: ReactNode
}

const withAccessibility = (
  child: ReactElement<FieldChildProps>,
  label: string,
  error?: string,
) =>
  cloneElement(child, {
    "aria-label": child.props["aria-label"] ?? label,
    "aria-invalid": child.props["aria-invalid"] ?? Boolean(error),
  })

export const Field = ({ label, error, children }: FieldProps) => (
  <View className="gap-1.5">
    <Text variant="small">{label}</Text>
    {isValidElement<FieldChildProps>(children)
      ? withAccessibility(children, label, error)
      : children}
    {error ? (
      <Text
        role="alert"
        aria-live="assertive"
        className="text-sm text-destructive"
      >
        {error}
      </Text>
    ) : null}
  </View>
)
