import { QueryClient } from "@tanstack/react-query"
import { isAppError } from "@/domain/errors"

const MAX_ATTEMPTS = 3

const INITIAL_DELAY_MS = 500

const MAX_DELAY_MS = 10000

const STALE_TIME_MS = 30000

/**
 * The API degraded mode returns 503s and latency: we replay errors flagged as
 * retryable, never a validation failure, a conflict or a forbidden role.
 */
const shouldRetry = (failureCount: number, error: Error): boolean => {
  if (failureCount >= MAX_ATTEMPTS) {
    return false
  }

  return isAppError(error) ? error.isRetryable : true
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
