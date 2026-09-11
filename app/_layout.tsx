import { ThemeProvider } from "@react-navigation/native"
import { PortalHost } from "@rn-primitives/portal"
import { QueryClientProvider } from "@tanstack/react-query"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { DeletionBanner } from "@/components/books/deletion-banner"
import { ThemeToggle } from "@/components/theme-toggle"
import { ToastProviderWithViewport } from "@/components/ui/toast"
import { NAV_THEME } from "@/lib/theme"
import { DeferredDeletionProvider } from "@/providers/deferred-deletion"
import { AppThemeProvider, useAppTheme } from "@/providers/theme"
import { createQueryClient } from "@/services/query/client"
import "../global.css"

const queryClient = createQueryClient()

const ThemedApp = () => {
  const { scheme } = useAppTheme()

  return (
    <ThemeProvider value={NAV_THEME[scheme]}>
      <ToastProviderWithViewport>
        <DeferredDeletionProvider>
          <StatusBar style={scheme === "dark" ? "light" : "dark"} />
          <Stack screenOptions={{ headerRight: () => <ThemeToggle /> }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <DeletionBanner />
          <PortalHost />
        </DeferredDeletionProvider>
      </ToastProviderWithViewport>
    </ThemeProvider>
  )
}

const RootLayout = () => (
  <QueryClientProvider client={queryClient}>
    <AppThemeProvider>
      <ThemedApp />
    </AppThemeProvider>
  </QueryClientProvider>
)

export default RootLayout
