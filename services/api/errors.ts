import { type AuthStatus, HTTP_STATUS } from "./constants"

type ErrorType = "network" | "validation" | "conflict" | "auth"

export abstract class AppError extends Error {
  abstract readonly type: ErrorType
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = new.target.name
    this.status = status
  }
}

export class NetworkError extends AppError {
  readonly type = "network"
  readonly retryable: boolean

  constructor(
    args: { status?: number; retryable?: boolean; message?: string } = {},
  ) {
    super(args.message ?? "Something went wrong.", args.status)
    this.retryable = args.retryable ?? false
  }
}

export class ValidationError extends AppError {
  readonly type = "validation"
  readonly fields: Record<string, string>

  constructor(args: { fields: Record<string, string>; message?: string }) {
    super(
      args.message ?? "The submitted data is invalid.",
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
    )
    this.fields = args.fields
  }
}

export class ConflictError extends AppError {
  readonly type = "conflict"
  readonly server: unknown
  readonly expectedVersion?: number

  constructor(args: {
    server: unknown
    expectedVersion?: number
    message?: string
  }) {
    super(
      args.message ?? "The record was modified by someone else.",
      HTTP_STATUS.CONFLICT,
    )
    this.server = args.server
    this.expectedVersion = args.expectedVersion
  }
}

export class AuthError extends AppError {
  readonly type = "auth"
  readonly code: string
  readonly canReauthenticate: boolean

  constructor(args: { status: AuthStatus; code?: string; message?: string }) {
    super(args.message ?? "Authentication is required.", args.status)
    this.code = args.code ?? "auth"
    this.canReauthenticate = args.code === "jeton_expire"
  }
}

export const isNotFoundError = (error: unknown): boolean =>
  error instanceof AppError && error.status === HTTP_STATUS.NOT_FOUND
