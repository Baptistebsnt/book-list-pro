import { type z } from "zod"
import { ErreurReseau, ErreurValidation } from "@/domain/erreurs"
import { CONFIG_API } from "./config"
import { erreurDepuisReponse } from "./erreurs-http"
import { type ParametresRequete, construireUrl } from "./url"

export type MethodeHttp = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type OptionsRequete<TSortie> = {
  chemin: string
  schema: z.ZodType<TSortie>
  methode?: MethodeHttp
  parametres?: ParametresRequete
  corps?: unknown
  /** Version connue de la fiche : envoyée en If-Match pour détecter les 409. */
  version?: number
  signal?: AbortSignal
  delaiMs?: number
}

const construireEntetes = (options: OptionsRequete<unknown>): HeadersInit => {
  const entetes: Record<string, string> = { Accept: "application/json" }

  if (typeof options.corps !== "undefined") {
    entetes["Content-Type"] = "application/json"
  }

  if (typeof options.version === "number") {
    entetes["If-Match"] = String(options.version)
  }

  return entetes
}

const traduireEchec = (
  cause: unknown,
  signalAppelant?: AbortSignal,
): unknown => {
  if (signalAppelant?.aborted === true) {
    return cause
  }

  if (cause instanceof Error && cause.name === "AbortError") {
    return new ErreurReseau(
      "delai-expire",
      `Le serveur n'a pas répondu en ${CONFIG_API.delaiExpirationMs} ms`,
      cause,
    )
  }

  return new ErreurReseau("hors-ligne", "Serveur injoignable", cause)
}

const envoyer = async (options: OptionsRequete<unknown>): Promise<Response> => {
  const controleur = new AbortController()
  const minuterie = setTimeout(() => {
    controleur.abort()
  }, options.delaiMs ?? CONFIG_API.delaiExpirationMs)
  const relayerAnnulation = () => {
    controleur.abort()
  }

  options.signal?.addEventListener("abort", relayerAnnulation)

  try {
    return await fetch(construireUrl(options.chemin, options.parametres), {
      method: options.methode ?? "GET",
      headers: construireEntetes(options),
      body:
        typeof options.corps === "undefined"
          ? null
          : JSON.stringify(options.corps),
      signal: controleur.signal,
    })
  } catch (cause) {
    throw traduireEchec(cause, options.signal)
  } finally {
    clearTimeout(minuterie)
    options.signal?.removeEventListener("abort", relayerAnnulation)
  }
}

const lireCorps = async (reponse: Response): Promise<unknown> => {
  if (reponse.status === 204) {
    return null
  }

  const texte = await reponse.text()

  if (texte.length === 0) {
    return null
  }

  try {
    return JSON.parse(texte) as unknown
  } catch {
    return texte
  }
}

/**
 * Client HTTP unique : URL de base, en-têtes, délai d'expiration, traduction
 * des erreurs et validation zod de la réponse. Rien d'autre n'appelle fetch.
 */
export const requeteApi = async <TSortie>(
  options: OptionsRequete<TSortie>,
): Promise<TSortie> => {
  const reponse = await envoyer(options)
  const corps = await lireCorps(reponse)

  if (!reponse.ok) {
    throw erreurDepuisReponse(reponse.status, corps)
  }

  const resultat = options.schema.safeParse(corps)

  if (!resultat.success) {
    throw ErreurValidation.depuisZod(
      resultat.error,
      `${options.methode ?? "GET"} ${options.chemin}`,
    )
  }

  return resultat.data
}
