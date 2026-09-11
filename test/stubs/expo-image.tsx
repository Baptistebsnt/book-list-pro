import { type ComponentProps, createElement } from "react"

type ImageStubProps = {
  source?: unknown
  accessibilityLabel?: string
  alt?: string
  role?: string
  onError?: (event: { error: string }) => void
  onLoad?: (event: unknown) => void
} & Record<string, unknown>

const sourceUri = (source: unknown): string => {
  if (typeof source === "string") {
    return source
  }

  if (source && typeof source === "object" && "uri" in source) {
    return String(source.uri)
  }

  return ""
}

export const Image = ({
  source,
  accessibilityLabel,
  alt,
  role,
  onError: _onError,
  onLoad: _onLoad,
  ...rest
}: ImageStubProps) =>
  createElement("expo-image", {
    src: sourceUri(source),
    "aria-label": accessibilityLabel ?? alt,
    role,
    ...(rest as ComponentProps<"img">),
  })

export default { Image }
