export type ErrorType = "network" | "validation" | "conflict" | "auth" | "http"

/**
 * Base class of every application error.
 * `type` is the discriminant, `isRetryable` drives the retry policy.
 */
export abstract class AppError extends Error {
  abstract readonly type: ErrorType

  readonly isRetryable: boolean = false

  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = this.constructor.name
    this.cause = cause
  }
}
