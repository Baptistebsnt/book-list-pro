import { type ZodError, type ZodType } from "zod"
import { AppError } from "./errors"

/**
 * The API answered with a payload that breaks its own contract. This is not a
 * 422: the bookseller did nothing wrong, the response itself is unusable.
 */
export class ResponseContractError extends AppError {
  readonly type = "validation"

  readonly fields: Record<string, string[]>

  constructor(context: string, error: ZodError) {
    super(`The API response does not match the contract (${context}).`)
    this.fields = ResponseContractError.groupIssues(error)
  }

  private static groupIssues(error: ZodError): Record<string, string[]> {
    const fields: Record<string, string[]> = {}

    for (const issue of error.issues) {
      const path = issue.path.join(".")
      const key = path.length === 0 ? "root" : path

      fields[key] = [...(fields[key] ?? []), issue.message]
    }

    return fields
  }

  /** Actionable diagnostic: every offending field and its reason. */
  get details(): string {
    return Object.entries(this.fields)
      .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
      .join(" | ")
  }
}

/**
 * Runtime gate between the HTTP client and the rest of the app: nothing enters
 * the cache without having been validated by zod first.
 */
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
