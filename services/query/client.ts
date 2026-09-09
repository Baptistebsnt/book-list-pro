import { QueryClient } from "@tanstack/react-query"
import { AppError, NetworkError } from "@/services/api/errors"

const MAX_ATTEMPTS = 3

const INITIAL_DELAY_MS = 500

const MAX_DELAY_MS = 10000

const STALE_TIME_MS = 30000

/**
 * The API degraded mode returns 503s and latency: only the errors the client
 * flagged as retryable are replayed. A validation failure, a conflict or a
 * forbidden role would return the very same answer on a second attempt.
 */
const shouldRetry = (failureCount: number, error: Error): boolean => {
  if (failureCount >= MAX_ATTEMPTS) {
    return false
  }

  if (error instanceof NetworkError) {
    return error.retryable
  }

  return !(error instanceof AppError)
}

const retryDelay = (failureCount: number): number =>
  Math.min(INITIAL_DELAY_MS * 2 ** failureCount, MAX_DELAY_MS)

export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME_MS,
        retry: shouldRetry,
        retryDelay,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
