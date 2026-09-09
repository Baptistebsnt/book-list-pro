import { type QueryClient } from "@tanstack/react-query"
import { clesOuvrages } from "./cles"

/**
 * Après écriture, toutes les listes redeviennent suspectes : les filtres et le
 * tri sont calculés par le serveur, on ne peut donc pas deviner quelles pages
 * changent. La fiche concernée est invalidée en plus, quand elle existe.
 */
export const invaliderOuvrages = async (
  client: QueryClient,
  id?: string,
): Promise<void> => {
  await client.invalidateQueries({ queryKey: clesOuvrages.listes() })

  if (typeof id === "string") {
    await client.invalidateQueries({ queryKey: clesOuvrages.detail(id) })
  }
}
