import { AppError, type ErrorType } from "./app-error"
import { AuthError, type AuthReason } from "./auth-error"
import { ConflictError } from "./conflict-error"
import { HttpError } from "./http-error"
import { NetworkError, type NetworkReason } from "./network-error"
import {
  type InvalidFields,
  ValidationError,
  type ValidationSource,
} from "./validation-error"

export {
  AppError,
  AuthError,
  ConflictError,
  HttpError,
  NetworkError,
  ValidationError,
}

export type {
  AuthReason,
  ErrorType,
  InvalidFields,
  NetworkReason,
  ValidationSource,
}

/** Discriminated union: a `switch` on `type` covers every case. */
export type KnownAppError =
  AuthError | ConflictError | HttpError | NetworkError | ValidationError

export const isAppError = (value: unknown): value is KnownAppError =>
  value instanceof AppError
