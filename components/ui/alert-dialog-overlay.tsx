import * as AlertDialogPrimitive from "@rn-primitives/alert-dialog"
import * as React from "react"
import { Platform } from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view"
import { cn } from "@/lib/utils"

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

function AlertDialogOverlay({
  className,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof AlertDialogPrimitive.Overlay>,
  "asChild"
> & {
  children?: React.ReactNode
}) {
  return (
    <FullWindowOverlay>
      <AlertDialogPrimitive.Overlay
        className={cn(
          "absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-overlay/50 p-2",
          Platform.select({
            web: "fixed animate-in fade-in-0",
          }),
          className,
        )}
        {...props}
        asChild={Platform.OS !== "web"}
      >
        <NativeOnlyAnimatedView
          entering={FadeIn.duration(200)
            .delay(50)
            .reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
          as="Pressable"
        >
          <>{children}</>
        </NativeOnlyAnimatedView>
      </AlertDialogPrimitive.Overlay>
    </FullWindowOverlay>
  )
}

export { AlertDialogOverlay }
