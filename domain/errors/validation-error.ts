import { type ZodError } from "zod"
import { AppError } from "./app-error"

export type InvalidFields = Record<string, string[]>

export type ValidationSource = "api-response" | "server-field"

/**
 * Two distinct sources:
 * - "api-response": the payload breaks the contract (zod rejection);
 * - "server-field": 422 returned by the API, to display under the right field.
 */
export class ValidationError extends AppError {
  readonly type = "validation" as const

  readonly fields: InvalidFields

  readonly source: ValidationSource

  constructor(
    message: string,
    fields: InvalidFields,
    source: ValidationSource,
  ) {
    super(message)
    this.fields = fields
    this.source = source
  }

  static fromZod(error: ZodError, context: string): ValidationError {
    const fields: InvalidFields = {}

    for (const issue of error.issues) {
      const path = issue.path.join(".")
      const key = path.length === 0 ? "root" : path

      fields[key] = [...(fields[key] ?? []), issue.message]
    }

    return new ValidationError(
      `API response does not match the contract (${context})`,
      fields,
      "api-response",
    )
  }

  /** Actionable diagnostic: every offending field and its reason. */
  get details(): string {
    return Object.entries(this.fields)
      .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
      .join(" | ")
  }
}
