import { type ReactNode } from "react"
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

type CenteredProps = {
  children: ReactNode
}

export const Centered = ({ children }: CenteredProps) => (
  <SafeAreaView className="flex-1 bg-background">
    <View className="flex-1 items-center justify-center gap-3 p-6">
      {children}
    </View>
  </SafeAreaView>
)
