import { type CoverImage } from "@/services/media/cover-image"
import { apiClient } from "./client"
import { config } from "./config"

const fallbackPath = (bookId: string): string =>
  `/covers/${encodeURIComponent(bookId)}.svg`

const toDisplayableUrl = (value: string): string | null => {
  try {
    return new URL(value, config.baseUrl).toString()
  } catch {
    return null
  }
}

export const hasCoverSource = (couverture: string | null): boolean =>
  (couverture?.trim().length ?? 0) > 0

export const resolveCoverUrl = (
  couverture: string | null,
  bookId: string,
): string => {
  const value = couverture?.trim() ?? ""

  return (
    (value.length > 0 ? toDisplayableUrl(value) : null) ??
    new URL(fallbackPath(bookId), config.baseUrl).toString()
  )
}

export const uploadCover = async (
  bookId: string,
  image: CoverImage,
): Promise<void> => {
  await apiClient.post(`/books/${bookId}/cover`, {
    data: image.dataUrl,
    mimeType: image.mimeType,
  })
}

export const restoreCover = async (bookId: string): Promise<void> => {
  await apiClient.delete(`/books/${bookId}/cover`)
}
