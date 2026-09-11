import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { useTheme } from "@/hooks/use-theme"

type GeneratedCoverProps = {
  seed: string
  title: string
  author?: string
  compact?: boolean
}

const PALETTE = [
  ["destructive", "destructiveForeground"],
  ["success", "successForeground"],
  ["warning", "warningForeground"],
  ["info", "infoForeground"],
] as const

const STOP_WORDS = new Set(["la", "le", "les", "un", "une", "des", "du", "de"])

const hashFromSeed = (seed: string): number => {
  let hash = 0

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 997
  }

  return hash
}

const initials = (title: string): string => {
  const words = title.split(/\s+/u).filter((word) => word.length > 0)
  const meaningful = words.filter((word) => !STOP_WORDS.has(word.toLowerCase()))
  const source = meaningful.length > 0 ? meaningful : words

  const letters = source
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")

  return letters || "?"
}

export const GeneratedCover = ({
  seed,
  title,
  author,
  compact,
}: GeneratedCoverProps) => {
  const theme = useTheme()
  const [background, foreground] = PALETTE[hashFromSeed(seed) % PALETTE.length]

  return (
    <View
      className="h-full w-full items-center justify-center p-2"
      style={{ backgroundColor: theme[background] }}
    >
      {compact ? (
        <Text
          className="text-lg font-bold"
          style={{ color: theme[foreground] }}
          numberOfLines={1}
        >
          {initials(title)}
        </Text>
      ) : (
        <View className="items-center gap-2">
          <Text
            className="text-center text-base font-semibold"
            style={{ color: theme[foreground] }}
            numberOfLines={4}
          >
            {title}
          </Text>
          {author ? (
            <Text
              className="text-center text-xs opacity-80"
              style={{ color: theme[foreground] }}
              numberOfLines={2}
            >
              {author}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  )
}
