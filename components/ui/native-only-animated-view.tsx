import { Platform, Pressable } from "react-native"
import Animated from "react-native-reanimated"

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

// `key` is dropped: reanimated widens every prop to allow a SharedValue,
// which clashes with the plain key JSX expects.
type AnimatedViewProps = Omit<React.ComponentProps<typeof Animated.View>, "key">

type AnimatedPressableProps = Omit<
  React.ComponentProps<typeof AnimatedPressable>,
  "key"
>

type NativeOnlyAnimatedViewProps =
  | (AnimatedViewProps & { as?: "View" })
  | (AnimatedPressableProps & { as: "Pressable" })

// Wraps views that should only animate on native; on web the children are
// rendered as-is.
function NativeOnlyAnimatedView(props: NativeOnlyAnimatedViewProps) {
  if (Platform.OS === "web") {
    return <>{props.children as React.ReactNode}</>
  }

  if (props.as === "Pressable") {
    const { as: _pressable, ...rest } = props

    return <AnimatedPressable {...rest} />
  }

  const { as: _view, ...rest } = props

  return <Animated.View {...rest} />
}

export { NativeOnlyAnimatedView }
