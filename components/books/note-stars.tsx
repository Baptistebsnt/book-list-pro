import { Star } from "lucide-react-native"
import { View } from "react-native"
import { MAX_RATING } from "@/domain/book"
import { useTheme } from "@/hooks/use-theme"

type NoteStarsProps = {
  note: number | null
  size?: number
  label?: string
}

const DEFAULT_SIZE = 16

const STARS = Array.from({ length: MAX_RATING }, (_, index) => index + 1)

export const NoteStars = ({
  note,
  size = DEFAULT_SIZE,
  label,
}: NoteStarsProps) => {
  const theme = useTheme()

  return (
    <View
      className="flex-row items-center gap-0.5"
      {...(label
        ? { role: "img" as const, "aria-label": label }
        : { "aria-hidden": true })}
    >
      {STARS.map((star) => {
        const filled = note !== null && star <= note

        return (
          <Star
            key={star}
            size={size}
            color={filled ? theme.warning : theme.mutedForeground}
            fill={filled ? theme.warning : "transparent"}
          />
        )
      })}
    </View>
  )
}
