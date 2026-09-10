import { z } from "zod"

const schema = z.object({
  baseUrl: z.string().url(),
})

export const config = schema.parse({
  baseUrl: process.env.EXPO_PUBLIC_API_URL!,
})

export const REQUEST_TIMEOUT_MS = 10_000
