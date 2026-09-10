const noop = () => null

export const useColorScheme = () => ({
  colorScheme: "light" as const,
  setColorScheme: noop,
  toggleColorScheme: noop,
})
