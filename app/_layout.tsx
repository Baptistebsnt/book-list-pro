import { ThemeProvider } from "@react-navigation/native"
import { PortalHost } from "@rn-primitives/portal"
import { QueryClientProvider } from "@tanstack/react-query"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { View } from "react-native"
import { DeletionBanner } from "@/components/books/deletion-banner"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { ToastProviderWithViewport } from "@/components/ui/toast"
import "@/i18n"
import { NAV_THEME } from "@/lib/theme"
import { DeferredDeletionProvider } from "@/providers/deferred-deletion"
import { AppLanguageProvider } from "@/providers/language"
import { AppThemeProvider, useAppTheme } from "@/providers/theme"
import { createQueryClient } from "@/services/query/client"
import "../global.css"

const HeaderActions = () => (
  <View className="flex-row items-center">
    <LanguageToggle />
    <ThemeToggle />
  </View>
)

const queryClient = createQueryClient()

const ThemedApp = () => {
  const { scheme } = useAppTheme()

  return (
    <ThemeProvider value={NAV_THEME[scheme]}>
      <ToastProviderWithViewport>
        <DeferredDeletionProvider>
          <StatusBar style={scheme === "dark" ? "light" : "dark"} />
          <Stack screenOptions={{ headerRight: () => <HeaderActions /> }}>
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
    <AppLanguageProvider>
      <AppThemeProvider>
        <ThemedApp />
      </AppThemeProvider>
    </AppLanguageProvider>
  </QueryClientProvider>
)

export default RootLayout
