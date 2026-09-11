import { Image } from "expo-image"
import { useEffect, useState } from "react"
import { View } from "react-native"
import { cn } from "@/lib/utils"
import { GeneratedCover } from "./generated-cover"

type BookCoverProps = {
  uri: string
  hasSource: boolean
  seed: string
  title: string
  author?: string
  className?: string
  compact?: boolean
  label?: string
}

const TRANSITION_MS = 150

export const BookCover = ({
  uri,
  hasSource,
  seed,
  title,
  author,
  className,
  compact,
  label,
}: BookCoverProps) => {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [uri])

  const showImage = hasSource && !failed

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
      {showImage ? (
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
      ) : (
        <GeneratedCover
          seed={seed}
          title={title}
          author={author}
          compact={compact}
        />
      )}
    </View>
  )
}
