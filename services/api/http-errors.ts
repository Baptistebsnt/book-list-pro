import { z } from "zod"
import {
  AuthError,
  ConflictError,
  HttpError,
  type InvalidFields,
  type KnownAppError,
  NetworkError,
  ValidationError,
} from "@/domain/errors"

type ErrorDetails = {
  message: string | null
  fields: InvalidFields
}

const detailSchema = z.union([z.string(), z.array(z.string())])

/**
 * Lenient reading of an error payload: the API may name its message
 * `message`/`error` and its per-field errors `champs`/`errors`/`fields`.
 */
const errorBodySchema = z
  .object({
    message: z.string().optional(),
    error: z.string().optional(),
    champs: z.record(detailSchema).optional(),
    errors: z.record(detailSchema).optional(),
    fields: z.record(detailSchema).optional(),
  })
  .catch({})

const normalizeFields = (
  raw: Record<string, string | string[]> | undefined,
): InvalidFields => {
  const fields: InvalidFields = {}

  for (const [key, value] of Object.entries(raw ?? {})) {
    fields[key] = Array.isArray(value) ? value : [value]
  }

  return fields
}

const readErrorBody = (body: unknown): ErrorDetails => {
  const parsed = errorBodySchema.parse(body)

  return {
    message: parsed.message ?? parsed.error ?? null,
    fields: normalizeFields(parsed.champs ?? parsed.errors ?? parsed.fields),
  }
}

/**
 * One status, one error factory. The table replaces a `switch`: every entry
 * stays trivial and an unknown status falls back to HttpError.
 */
const FACTORIES = new Map<number, (details: ErrorDetails) => KnownAppError>([
  [
    401,
    ({ message }) =>
      new AuthError(
        "unauthenticated",
        message ?? "Session expired, sign in again",
      ),
  ],
  [
    403,
    ({ message }) =>
      new AuthError(
        "forbidden",
        message ?? "Your role does not allow this action",
      ),
  ],
  [
    422,
    ({ message, fields }) =>
      new ValidationError(
        message ?? "Some fields are invalid",
        fields,
        "server-field",
      ),
  ],
  [
    503,
    ({ message }) =>
      new NetworkError(
        "unavailable",
        message ?? "Service temporarily unavailable",
      ),
  ],
])

/** Turns a failing HTTP status into a discriminated application error. */
export const errorFromResponse = (
  status: number,
  body: unknown,
): KnownAppError => {
  const details = readErrorBody(body)

  if (status === 409) {
    return new ConflictError(
      details.message ?? "This record was modified in the meantime",
      body,
    )
  }

  const factory = FACTORIES.get(status)

  if (factory) {
    return factory(details)
  }

  return new HttpError(
    details.message ?? `HTTP failure ${status}`,
    status,
    body,
  )
}
