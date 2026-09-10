import { type ZodError, type ZodType } from "zod"
import { AppError } from "./errors"

export class ResponseContractError extends AppError {
  readonly type = "validation"

  readonly fields: Record<string, string>

  constructor(context: string, error: ZodError) {
    super(`The API response does not match the contract (${context}).`)
    this.fields = ResponseContractError.groupIssues(error)
  }

  private static groupIssues(error: ZodError): Record<string, string> {
    const fields: Record<string, string> = {}

    for (const issue of error.issues) {
      const path = issue.path.join(".")
      const key = path.length === 0 ? "root" : path
      const previous = fields[key]

      fields[key] =
        typeof previous === "string"
          ? `${previous}, ${issue.message}`
          : issue.message
    }

    return fields
  }

  get details(): string {
    return Object.entries(this.fields)
      .map(([field, message]) => `${field}: ${message}`)
      .join(" | ")
  }
}

export const parseResponse = <TOutput>(
  schema: ZodType<TOutput>,
  data: unknown,
  context: string,
): TOutput => {
  const result = schema.safeParse(data)

  if (!result.success) {
    throw new ResponseContractError(context, result.error)
  }

  return result.data
}
