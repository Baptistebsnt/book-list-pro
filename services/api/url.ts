import { API_CONFIG } from "./config"

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>

const serialize = (params: QueryParams): string => {
  const pairs = Object.entries(params)
    .filter(([, value]) => value !== null && typeof value !== "undefined")
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )

  return pairs.length === 0 ? "" : `?${pairs.join("&")}`
}

/** The only place where the base URL is joined to a path. */
export const buildUrl = (path: string, params?: QueryParams): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${API_CONFIG.baseUrl}${normalizedPath}${params ? serialize(params) : ""}`
}

/**
 * Resolves the `couverture` field: a relative path gets prefixed, an absolute
 * URL is left untouched, a null value falls back to the generated cover.
 */
export const coverUrl = (cover: string | null, bookId: string): string => {
  if (cover === null || cover.trim().length === 0) {
    return buildUrl(`/covers/${bookId}.svg`)
  }

  if (/^https?:\/\//iu.test(cover)) {
    return cover
  }

  return buildUrl(cover)
}
