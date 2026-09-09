import { type z } from "zod"
import { NetworkError, ValidationError } from "@/domain/errors"
import { API_CONFIG } from "./config"
import { errorFromResponse } from "./http-errors"
import { type QueryParams, buildUrl } from "./url"

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type RequestOptions<TOutput> = {
  path: string
  schema: z.ZodType<TOutput>
  method?: HttpMethod
  params?: QueryParams
  body?: unknown
  /** Known record version: sent as If-Match so the API can report a 409. */
  version?: number
  signal?: AbortSignal
  timeoutMs?: number
}

const buildHeaders = (options: RequestOptions<unknown>): HeadersInit => {
  const headers: Record<string, string> = { Accept: "application/json" }

  if (typeof options.body !== "undefined") {
    headers["Content-Type"] = "application/json"
  }

  if (typeof options.version === "number") {
    headers["If-Match"] = String(options.version)
  }

  return headers
}

const translateFailure = (
  cause: unknown,
  callerSignal?: AbortSignal,
): unknown => {
  if (callerSignal?.aborted === true) {
    return cause
  }

  if (cause instanceof Error && cause.name === "AbortError") {
    return new NetworkError(
      "timeout",
      `Server did not respond within ${API_CONFIG.timeoutMs} ms`,
      cause,
    )
  }

  return new NetworkError("offline", "Server unreachable", cause)
}

const send = async (options: RequestOptions<unknown>): Promise<Response> => {
  const controller = new AbortController()
  const timer = setTimeout(() => {
    controller.abort()
  }, options.timeoutMs ?? API_CONFIG.timeoutMs)
  const forwardAbort = () => {
    controller.abort()
  }

  options.signal?.addEventListener("abort", forwardAbort)

  try {
    return await fetch(buildUrl(options.path, options.params), {
      method: options.method ?? "GET",
      headers: buildHeaders(options),
      body:
        typeof options.body === "undefined"
          ? null
          : JSON.stringify(options.body),
      signal: controller.signal,
    })
  } catch (cause) {
    throw translateFailure(cause, options.signal)
  } finally {
    clearTimeout(timer)
    options.signal?.removeEventListener("abort", forwardAbort)
  }
}

const readBody = async (response: Response): Promise<unknown> => {
  if (response.status === 204) {
    return null
  }

  const text = await response.text()

  if (text.length === 0) {
    return null
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

/**
 * The single HTTP client: base URL, headers, timeout, error translation and
 * zod validation of the payload. Nothing else in the app calls fetch.
 */
export const apiRequest = async <TOutput>(
  options: RequestOptions<TOutput>,
): Promise<TOutput> => {
  const response = await send(options)
  const body = await readBody(response)

  if (!response.ok) {
    throw errorFromResponse(response.status, body)
  }

  const parsed = options.schema.safeParse(body)

  if (!parsed.success) {
    throw ValidationError.fromZod(
      parsed.error,
      `${options.method ?? "GET"} ${options.path}`,
    )
  }

  return parsed.data
}
