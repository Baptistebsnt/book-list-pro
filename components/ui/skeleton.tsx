import { View } from "react-native"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<typeof View>) {
  return (
    <View
      className={cn("animate-pulse rounded-md bg-muted", className)}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      {...props}
    />
  )
}

export { Skeleton }
