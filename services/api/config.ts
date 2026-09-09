import { Platform } from "react-native"

const DELAI_EXPIRATION_MS = 8000

/**
 * L'émulateur Android ne voit pas `localhost` : il passe par 10.0.2.2.
 * Toute autre cible se surcharge via EXPO_PUBLIC_API_URL.
 */
const URL_PAR_DEFAUT =
  Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000"

const lireDelai = (): number => {
  const brut = Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS)

  return Number.isFinite(brut) && brut > 0 ? brut : DELAI_EXPIRATION_MS
}

export const CONFIG_API = {
  urlDeBase: (process.env.EXPO_PUBLIC_API_URL ?? URL_PAR_DEFAUT).replace(
    /\/+$/u,
    "",
  ),
  delaiExpirationMs: lireDelai(),
} as const
