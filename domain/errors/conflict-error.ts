import { AppError } from "./app-error"

/**
 * 409: the version we sent is stale. `serverResource` holds the record
 * returned by the API, raw material for conflict resolution (batch 4).
 */
export class ConflictError extends AppError {
  readonly type = "conflict" as const

  readonly serverResource: unknown

  constructor(message: string, serverResource: unknown) {
    super(message)
    this.serverResource = serverResource
  }
}
