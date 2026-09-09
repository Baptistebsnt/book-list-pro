import { CONFIG_API } from "./config"

export type ParametresRequete = Record<
  string,
  string | number | boolean | null | undefined
>

const serialiser = (parametres: ParametresRequete): string => {
  const paires = Object.entries(parametres)
    .filter(([, valeur]) => valeur !== null && typeof valeur !== "undefined")
    .map(
      ([cle, valeur]) =>
        `${encodeURIComponent(cle)}=${encodeURIComponent(String(valeur))}`,
    )

  return paires.length === 0 ? "" : `?${paires.join("&")}`
}

/** Seul endroit où l'URL de base est concaténée à un chemin. */
export const construireUrl = (
  chemin: string,
  parametres?: ParametresRequete,
): string => {
  const cheminNormalise = chemin.startsWith("/") ? chemin : `/${chemin}`

  return `${CONFIG_API.urlDeBase}${cheminNormalise}${
    parametres ? serialiser(parametres) : ""
  }`
}

/**
 * Résout la valeur du champ `couverture` : chemin relatif préfixé, URL absolue
 * conservée, valeur nulle repliée sur la couverture générée par l'API.
 */
export const urlCouverture = (
  couverture: string | null,
  idOuvrage: string,
): string => {
  if (couverture === null || couverture.trim().length === 0) {
    return construireUrl(`/covers/${idOuvrage}.svg`)
  }

  if (/^https?:\/\//iu.test(couverture)) {
    return couverture
  }

  return construireUrl(couverture)
}
