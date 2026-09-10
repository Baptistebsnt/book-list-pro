import { useColorScheme } from "nativewind"
import { THEME } from "@/lib/theme"

export const useTheme = () => {
  const { colorScheme } = useColorScheme()

  return THEME[colorScheme ?? "light"]
}
