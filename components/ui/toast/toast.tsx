import { useEffect, useRef } from "react"
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native"
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { useToast } from "./toast-context"
import type { Toast as ToastType, ToastType as ToastVariant } from "./types"

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
}

type ToastProps = {
  toast: ToastType
  index: number
}

const EASE = Easing.bezier(0.25, 0.46, 0.45, 0.94)

const getBackgroundColor = (type: ToastVariant) => {
  switch (type) {
    case "success":
      return "#10B981"

    case "error":
      return "#EF4444"

    case "warning":
      return "#F59E0B"

    case "info":
      return "#3B82F6"

    default:
      return "#262626"
  }
}

const getIconForType = (type: ToastVariant) => {
  switch (type) {
    case "success":
      return "✓"

    case "error":
      return "✗"

    case "warning":
      return "⚠"

    case "info":
      return "ℹ"

    default:
      return ""
  }
}

export const Toast = ({ toast, index }: ToastProps) => {
  const { dismiss } = useToast()
  const prevIndexRef = useRef<number>(-1)
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(
    toast.options.position === "top" ? -100 : 100,
  )
  const scale = useSharedValue(0.9)
  const rotateZ = useSharedValue(0)

  const isTop = toast.options.position === "top"

  const getStackOffset = () => {
    const baseOffset = 4
    const maxOffset = 12
    const offset = Math.min(index * baseOffset, maxOffset)

    return isTop ? offset : -offset
  }

  const getStackScale = () => {
    const scaleReduction = 0.02
    const minScale = 0.92

    return Math.max(1 - index * scaleReduction, minScale)
  }

  const handleDismiss = () => {
    dismiss(toast.id)
    toast.options.onClose()
  }

  useEffect(() => {
    if (prevIndexRef.current !== index && opacity.value > 0) {
      const soonerOffset = isTop ? 2 : -2

      translateY.value = withTiming(getStackOffset() + soonerOffset, {
        duration: 400,
        easing: EASE,
      })
      scale.value = withTiming(getStackScale() * 0.98, {
        duration: 400,
        easing: EASE,
      })

      setTimeout(() => {
        translateY.value = withSpring(getStackOffset(), {
          damping: 25,
          stiffness: 120,
          mass: 0.8,
          velocity: 0,
        })
        scale.value = withSpring(getStackScale(), {
          damping: 25,
          stiffness: 120,
          mass: 0.8,
          velocity: 0,
        })
      }, 200)
    }

    prevIndexRef.current = index
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isTop, translateY, scale, opacity])

  useEffect(() => {
    const delay = index * 50

    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
    })

    setTimeout(() => {
      opacity.value = withTiming(1, { duration: 500, easing: EASE })
      translateY.value = withSpring(getStackOffset(), {
        damping: 28,
        stiffness: 140,
        mass: 0.8,
        velocity: 0,
      })
      scale.value = withSpring(getStackScale(), {
        damping: 28,
        stiffness: 140,
        mass: 0.8,
        velocity: 0,
      })
      rotateZ.value = withTiming(0, { duration: 500, easing: EASE })
    }, delay)

    if (toast.options.duration > 0) {
      const exitDelay = Math.max(0, toast.options.duration - 500)

      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 400, easing: EASE })
        translateY.value = withTiming(isTop ? -20 : 20, {
          duration: 400,
          easing: EASE,
        })
        scale.value = withTiming(0.95, { duration: 400, easing: EASE })

        setTimeout(() => runOnJS(handleDismiss)(), 400)
      }, exitDelay)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, opacity, translateY, scale, rotateZ, index])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotateZ.value}deg` },
    ],
    zIndex: 1000 - index,
  }))

  const handlePress = () => {
    opacity.value = withTiming(0, { duration: 250, easing: EASE })
    translateY.value = withTiming(isTop ? -100 : 100, {
      duration: 250,
      easing: EASE,
    })
    scale.value = withTiming(0.8, { duration: 250, easing: EASE })

    setTimeout(handleDismiss, 250)
  }

  const backgroundColor = getBackgroundColor(toast.options.type)
  const icon = getIconForType(toast.options.type)

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        animatedStyle,
        {
          position: "absolute",
          top: isTop ? 100 : undefined,
          bottom: isTop ? undefined : 0,
        },
      ]}
    >
      <Pressable
        style={[styles.toast, { backgroundColor }]}
        onPress={handlePress}
        android_ripple={{ color: "rgba(255, 255, 255, 0.1)" }}
      >
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <View style={styles.contentContainer}>
          {typeof toast.content === "string" ? (
            <Text style={styles.text}>{toast.content}</Text>
          ) : (
            toast.content
          )}
        </View>
        {toast.options.action ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              toast.options.action?.onPress()
              handlePress()
            }}
          >
            <Text style={styles.actionText}>{toast.options.action.label}</Text>
          </TouchableOpacity>
        ) : null}
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  toastContainer: {
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
    marginVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  icon: {
    color: "#fff",
    fontSize: 20,
    marginRight: 12,
    fontWeight: "bold",
    textAlign: "center",
    width: 24,
  },
  contentContainer: {
    flex: 1,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginLeft: 12,
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
})
