import { Platform } from "react-native"

const DEFAULT_TIMEOUT_MS = 8000

/**
 * The Android emulator cannot see `localhost`: it goes through 10.0.2.2.
 * Any other target is set through EXPO_PUBLIC_API_URL.
 */
const DEFAULT_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000"

const readTimeout = (): number => {
  const raw = Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS)

  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_TIMEOUT_MS
}

export const API_CONFIG = {
  baseUrl: (process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_BASE_URL).replace(
    /\/+$/u,
    "",
  ),
  timeoutMs: readTimeout(),
} as const
