import { z } from "zod"
import { type AuthStatus, HTTP_STATUS } from "./constants"
import {
  type AppError,
  AuthError,
  ConflictError,
  NetworkError,
  NotFoundError,
  ValidationError,
} from "./errors"

const apiErrorBodySchema = z
  .object({
    erreur: z.string().optional(),
    message: z.string().optional(),
    champs: z.record(z.string()).optional(),
    serveur: z.unknown().optional(),
    versionAttendue: z.number().optional(),
  })
  .transform((raw) => ({
    error: raw.erreur,
    message: raw.message,
    fields: raw.champs,
    server: raw.serveur,
    expectedVersion: raw.versionAttendue,
  }))

export type ApiErrorBody = z.infer<typeof apiErrorBodySchema>

const EMPTY_ERROR_BODY: ApiErrorBody = apiErrorBodySchema.parse({})

const parseErrorBody = (raw: unknown): ApiErrorBody => {
  const result = apiErrorBodySchema.safeParse(raw)

  return result.success ? result.data : EMPTY_ERROR_BODY
}

const authStatusOf = (status: number): AuthStatus =>
  status === HTTP_STATUS.FORBIDDEN
    ? HTTP_STATUS.FORBIDDEN
    : HTTP_STATUS.UNAUTHORIZED

export const mapError = (status: number, rawBody: unknown): AppError => {
  const data = parseErrorBody(rawBody)

  if (status === HTTP_STATUS.UNAUTHORIZED || status === HTTP_STATUS.FORBIDDEN) {
    return new AuthError({
      status: authStatusOf(status),
      code: data.error,
      message: data.message,
    })
  }

  if (status === HTTP_STATUS.NOT_FOUND) {
    return new NotFoundError({ message: data.message })
  }

  if (status === HTTP_STATUS.CONFLICT) {
    return new ConflictError({
      server: data.server,
      expectedVersion: data.expectedVersion,
      message: data.message,
    })
  }

  if (status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
    return new ValidationError({
      fields: data.fields ?? {},
      message: data.message,
    })
  }

  if (status === HTTP_STATUS.SERVICE_UNAVAILABLE) {
    return new NetworkError({ status, retryable: true, message: data.message })
  }

  return new NetworkError({ status, message: data.message })
}
