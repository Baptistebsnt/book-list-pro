import { describe, expect, it } from "vitest"
import { HTTP_STATUS } from "./constants"
import { mapError } from "./error-mapping"
import {
  AuthError,
  ConflictError,
  NetworkError,
  NotFoundError,
  ValidationError,
} from "./errors"

describe("mapError", () => {
  it("maps 401 to an auth error", () => {
    const error = mapError(HTTP_STATUS.UNAUTHORIZED, {})

    expect(error).toBeInstanceOf(AuthError)
  })

  it("flags an expired token as re-authenticatable", () => {
    const error = mapError(HTTP_STATUS.UNAUTHORIZED, {
      erreur: "jeton_expire",
    }) as AuthError

    expect(error.canReauthenticate).toBe(true)
  })

  it("maps 404 to a not-found error", () => {
    expect(mapError(HTTP_STATUS.NOT_FOUND, {})).toBeInstanceOf(NotFoundError)
  })

  it("maps 409 and carries the server state and expected version", () => {
    const error = mapError(HTTP_STATUS.CONFLICT, {
      serveur: { id: "book-1" },
      versionAttendue: 7,
    }) as ConflictError

    expect(error).toBeInstanceOf(ConflictError)
    expect(error.server).toEqual({ id: "book-1" })
    expect(error.expectedVersion).toBe(7)
  })

  it("maps 422 and keeps the field errors", () => {
    const error = mapError(HTTP_STATUS.UNPROCESSABLE_ENTITY, {
      champs: { titre: "Le titre est requis" },
    }) as ValidationError

    expect(error).toBeInstanceOf(ValidationError)
    expect(error.fields).toEqual({ titre: "Le titre est requis" })
  })

  it("maps 503 to a retryable network error", () => {
    const error = mapError(HTTP_STATUS.SERVICE_UNAVAILABLE, {}) as NetworkError

    expect(error).toBeInstanceOf(NetworkError)
    expect(error.retryable).toBe(true)
  })

  it("maps an unknown status to a non-retryable network error", () => {
    const error = mapError(HTTP_STATUS.BAD_REQUEST, {}) as NetworkError

    expect(error).toBeInstanceOf(NetworkError)
    expect(error.retryable).toBe(false)
  })

  it("tolerates a malformed error body", () => {
    expect(mapError(HTTP_STATUS.NOT_FOUND, "boom")).toBeInstanceOf(
      NotFoundError,
    )
  })
})
