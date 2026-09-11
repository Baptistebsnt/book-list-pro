import { StyleSheet, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Toast } from "./toast"
import { useToast } from "./toast-context"
import type { ToastPosition } from "./types"

const VIEWPORT_HEIGHT = 200

export const ToastViewport = () => {
  const { toasts } = useToast()
  const insets = useSafeAreaInsets()

  const renderStack = (position: ToastPosition) => {
    const stack = toasts.filter((toast) => toast.options.position === position)

    return stack.map((toast, arrayIndex) => (
      <Toast
        key={toast.id}
        toast={toast}
        index={stack.length - 1 - arrayIndex}
      />
    ))
  }

  return (
    <>
      <View
        style={[
          styles.viewport,
          styles.topViewport,
          { paddingTop: insets.top + 10, height: VIEWPORT_HEIGHT },
        ]}
      >
        {renderStack("top")}
      </View>
      <View
        style={[
          styles.viewport,
          styles.bottomViewport,
          { marginBottom: insets.bottom, height: VIEWPORT_HEIGHT },
        ]}
      >
        {renderStack("bottom")}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  viewport: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
    pointerEvents: "box-none",
  },
  topViewport: {
    top: 0,
    justifyContent: "flex-start",
  },
  bottomViewport: {
    bottom: 0,
    justifyContent: "flex-end",
  },
})
