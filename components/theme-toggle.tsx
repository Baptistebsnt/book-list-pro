import { Moon, Sun } from "lucide-react-native"
import { Platform, Pressable } from "react-native"
import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"
import { useAppTheme } from "@/providers/theme"

const ICON_SIZE = 20

export const ThemeToggle = () => {
  const theme = useTheme()
  const { scheme, toggle } = useAppTheme()
  const isDark = scheme === "dark"
  const Icon = isDark ? Sun : Moon

  return (
    <Pressable
      onPress={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Activer le thème clair" : "Activer le thème sombre"}
      className={cn(
        "h-11 w-11 items-center justify-center rounded-full active:bg-muted",
        Platform.select({ web: "hover:bg-muted" }),
      )}
    >
      <Icon size={ICON_SIZE} color={theme.foreground} />
    </Pressable>
  )
}
