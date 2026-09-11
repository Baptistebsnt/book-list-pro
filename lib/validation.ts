import { type TFunction } from "i18next"
import { MIN_YEAR } from "@/domain/book"

const VALIDATION_KEY_PREFIX = "validation."

/**
 * Field errors reach the UI from two sources: our zod schemas, which use stable
 * `validation.*` i18n keys, and the server, which returns already-worded
 * messages. Only the former are translated; server strings pass through
 * untouched so they are never mangled by a missing-key lookup.
 */
export const translateFieldError = (
  t: TFunction,
  message?: string,
): string | undefined => {
  if (!message) {
    return message
  }

  return message.startsWith(VALIDATION_KEY_PREFIX)
    ? t(message, { min: MIN_YEAR })
    : message
}
