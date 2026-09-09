import { AppError } from "./app-error"

/** Any failing status without dedicated handling: 400, 404, 413, 415... */
export class HttpError extends AppError {
  readonly type = "http" as const

  readonly status: number

  readonly body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.status = status
    this.body = body
  }
}
