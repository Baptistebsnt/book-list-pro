import react from "@vitejs/plugin-react"
import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": __dirname,
      "react-native": "react-native-web",
      "expo-router": path.resolve(__dirname, "test/stubs/expo-router.ts"),
      "react-native-safe-area-context": path.resolve(
        __dirname,
        "test/stubs/react-native-safe-area-context.tsx",
      ),
      "react-native-svg": path.resolve(
        __dirname,
        "test/stubs/react-native-svg.tsx",
      ),
      nativewind: path.resolve(__dirname, "test/stubs/nativewind.ts"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    server: {
      deps: {
        inline: ["lucide-react-native", /@react-navigation/],
      },
    },
    env: {
      EXPO_PUBLIC_API_URL: "http://localhost:3000",
    },
    coverage: {
      provider: "v8",
      include: ["domain/**", "services/**"],
      thresholds: {
        "domain/**": { statements: 40, branches: 40, functions: 40, lines: 40 },
        "services/**": {
          statements: 40,
          branches: 40,
          functions: 40,
          lines: 40,
        },
      },
    },
  },
})
