import {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  create,
  isAxiosError,
  isCancel,
} from "axios"
import { REQUEST_TIMEOUT_MS, config } from "./config"
import { mapError } from "./error-mapping"
import { AppError, CancelledError, NetworkError } from "./errors"

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

type RequestOptions = {
  method?: Method
  body?: unknown
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean | undefined>
  timeout?: number
  signal?: AbortSignal
}

const http: AxiosInstance = create({
  baseURL: config.baseUrl,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { Accept: "application/json" },
})

const formatError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error
  }

  if (isCancel(error)) {
    return new CancelledError()
  }

  if (isAxiosError(error)) {
    if (error.response) {
      return mapError(error.response.status, error.response.data)
    }

    const timedOut =
      error.code === AxiosError.ECONNABORTED ||
      error.code === AxiosError.ETIMEDOUT

    return new NetworkError({
      retryable: true,
      message: timedOut ? "Request timed out." : "Unable to reach the server.",
    })
  }

  return new NetworkError({ retryable: false, message: "Unexpected error." })
}

const send = async <T>(
  path: string,
  options: RequestOptions = {},
): Promise<AxiosResponse<T>> => {
  const { body, method, headers, params, timeout, signal } = options

  try {
    return await http.request<T>({
      url: path,
      data: body,
      method,
      headers,
      params,
      timeout,
      signal,
    })
  } catch (error) {
    throw formatError(error)
  }
}

export const request = async <T>(
  path: string,
  options?: RequestOptions,
): Promise<T> => {
  const response = await send<T>(path, options)

  return response.data
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: (path: string, options?: RequestOptions) =>
    request(path, { ...options, method: "DELETE" }),
}
