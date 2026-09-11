export const ACCEPTED_COVER_TYPES = ["image/png", "image/jpeg", "image/webp"]

export const MAX_COVER_EDGE = 1024

export const COVER_QUALITY = 0.82

export type CoverImage = {
  dataUrl: string
  mimeType: string
  width: number
  height: number
}

export type CoverPick =
  | { status: "picked"; image: CoverImage }
  | { status: "cancelled" }
  | { status: "unsupported" }

export type CoverSize = {
  width: number
  height: number
}

export const fitWithin = (size: CoverSize, maxEdge: number): CoverSize => {
  const longest = Math.max(size.width, size.height)

  if (longest <= maxEdge || longest === 0) {
    return size
  }

  const ratio = maxEdge / longest

  return {
    width: Math.max(1, Math.round(size.width * ratio)),
    height: Math.max(1, Math.round(size.height * ratio)),
  }
}
