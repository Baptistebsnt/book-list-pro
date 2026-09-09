import { AppError } from "./app-error"

export type NetworkReason = "offline" | "timeout" | "unavailable"

/** The server did not answer, or answered 503: the call may be replayed. */
export class NetworkError extends AppError {
  readonly type = "network" as const

  override readonly isRetryable = true

  readonly reason: NetworkReason

  constructor(reason: NetworkReason, message: string, cause?: unknown) {
    super(message, cause)
    this.reason = reason
  }
}
