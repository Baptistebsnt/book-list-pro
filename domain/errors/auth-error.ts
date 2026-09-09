import { AppError } from "./app-error"

export type AuthReason = "unauthenticated" | "forbidden"

/** 401 (token must be refreshed) or 403 (insufficient role). */
export class AuthError extends AppError {
  readonly type = "auth" as const

  readonly reason: AuthReason

  constructor(reason: AuthReason, message: string) {
    super(message)
    this.reason = reason
  }
}
