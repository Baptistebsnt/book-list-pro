import { Image } from "expo-image"
import { ImageOff } from "lucide-react-native"
import { useEffect, useState } from "react"
import { View } from "react-native"
import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"

type BookCoverProps = {
  uri: string
  className?: string
  iconSize?: number
  label?: string
}

const TRANSITION_MS = 150

export const BookCover = ({
  uri,
  className,
  iconSize = 20,
  label,
}: BookCoverProps) => {
  const theme = useTheme()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [uri])

  return (
    <View
      className={cn(
        "items-center justify-center overflow-hidden rounded-md border border-border bg-muted",
        className,
      )}
      {...(label
        ? { role: "img" as const, "aria-label": label }
        : { "aria-hidden": true })}
    >
      {failed ? (
        <ImageOff size={iconSize} color={theme.mutedForeground} />
      ) : (
        <Image
          source={uri}
          onError={() => setFailed(true)}
          contentFit="cover"
          cachePolicy="memory-disk"
          recyclingKey={uri}
          transition={TRANSITION_MS}
          accessibilityLabel={label}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </View>
  )
}
