import { QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"
import { createQueryClient } from "@/services/query/client"

export const createQueryWrapper = () => {
  const client = createQueryClient()

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )

  return { client, Wrapper }
}
