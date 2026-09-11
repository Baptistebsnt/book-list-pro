import { type ReactNode } from "react"
import { View, type ViewProps } from "react-native"

const INSETS = { top: 0, right: 0, bottom: 0, left: 0 }

type SafeAreaViewProps = ViewProps & {
  children?: ReactNode
  edges?: readonly string[]
}

export const SafeAreaView = ({
  edges: _edges,
  ...props
}: SafeAreaViewProps) => <View {...props} />

export const SafeAreaProvider = ({ children }: { children?: ReactNode }) => (
  <>{children}</>
)

export const useSafeAreaInsets = () => INSETS

export const useSafeAreaFrame = () => ({ x: 0, y: 0, width: 0, height: 0 })

export const initialWindowMetrics = {
  insets: INSETS,
  frame: { x: 0, y: 0, width: 0, height: 0 },
}
