import { ThemeProvider } from "@react-navigation/native"
import { PortalHost } from "@rn-primitives/portal"
import { QueryClientProvider } from "@tanstack/react-query"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useColorScheme } from "nativewind"
import { DeletionBanner } from "@/components/books/deletion-banner"
import { NAV_THEME } from "@/lib/theme"
import { DeferredDeletionProvider } from "@/providers/deferred-deletion"
import { createQueryClient } from "@/services/query/client"
import "../global.css"

const queryClient = createQueryClient()

const RootLayout = () => {
  const { colorScheme } = useColorScheme()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
        <DeferredDeletionProvider>
          <StatusBar style="auto" />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <DeletionBanner />
          <PortalHost />
        </DeferredDeletionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default RootLayout
