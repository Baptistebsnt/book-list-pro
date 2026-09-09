import { z } from "zod"
import {
  type ChampsInvalides,
  type Erreur,
  ErreurAuth,
  ErreurConflit,
  ErreurHttp,
  ErreurReseau,
  ErreurValidation,
} from "@/domain/erreurs"

type DetailsErreur = {
  message: string | null
  champs: ChampsInvalides
}

const schemaDetail = z.union([z.string(), z.array(z.string())])

/**
 * Lecture tolérante du corps d'erreur : l'API peut nommer ses champs
 * `message`/`error` et ses erreurs par champ `champs`/`errors`/`fields`.
 */
const schemaCorpsErreur = z
  .object({
    message: z.string().optional(),
    error: z.string().optional(),
    champs: z.record(schemaDetail).optional(),
    errors: z.record(schemaDetail).optional(),
    fields: z.record(schemaDetail).optional(),
  })
  .catch({})

const normaliserChamps = (
  brut: Record<string, string | string[]> | undefined,
): ChampsInvalides => {
  const champs: ChampsInvalides = {}

  for (const [cle, valeur] of Object.entries(brut ?? {})) {
    champs[cle] = Array.isArray(valeur) ? valeur : [valeur]
  }

  return champs
}

const lireCorpsErreur = (corps: unknown): DetailsErreur => {
  const analyse = schemaCorpsErreur.parse(corps)

  return {
    message: analyse.message ?? analyse.error ?? null,
    champs: normaliserChamps(
      analyse.champs ?? analyse.errors ?? analyse.fields,
    ),
  }
}

/**
 * Un statut, une fabrique d'erreur. La table remplace un `switch` : chaque
 * entrée reste triviale et le statut inconnu retombe sur ErreurHttp.
 */
const FABRIQUES = new Map<number, (details: DetailsErreur) => Erreur>([
  [
    401,
    ({ message }) =>
      new ErreurAuth(
        "non-authentifie",
        message ?? "Session expirée, reconnexion nécessaire",
      ),
  ],
  [
    403,
    ({ message }) =>
      new ErreurAuth(
        "droits-insuffisants",
        message ?? "Votre rôle ne permet pas cette action",
      ),
  ],
  [
    422,
    ({ message, champs }) =>
      new ErreurValidation(
        message ?? "Certains champs sont invalides",
        champs,
        "champ-serveur",
      ),
  ],
  [
    503,
    ({ message }) =>
      new ErreurReseau(
        "indisponible",
        message ?? "Service temporairement indisponible",
      ),
  ],
])

/** Traduit un statut HTTP d'échec en erreur applicative discriminée. */
export const erreurDepuisReponse = (statut: number, corps: unknown): Erreur => {
  const details = lireCorpsErreur(corps)

  if (statut === 409) {
    return new ErreurConflit(
      details.message ?? "La fiche a été modifiée entre-temps",
      corps,
    )
  }

  const fabrique = FABRIQUES.get(statut)

  if (fabrique) {
    return fabrique(details)
  }

  return new ErreurHttp(
    details.message ?? `Échec HTTP ${statut}`,
    statut,
    corps,
  )
}
