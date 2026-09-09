import { type ZodError } from "zod"
import { ErreurApplicative } from "./erreur-applicative"

export type ChampsInvalides = Record<string, string[]>

export type OrigineValidation = "reponse-api" | "champ-serveur"

/**
 * Deux origines distinctes :
 * - "reponse-api" : la réponse ne respecte pas le contrat (rejet zod) ;
 * - "champ-serveur" : 422 renvoyé par l'API, à afficher sous le bon champ.
 */
export class ErreurValidation extends ErreurApplicative {
  readonly type = "validation" as const

  readonly champs: ChampsInvalides

  readonly origine: OrigineValidation

  constructor(
    message: string,
    champs: ChampsInvalides,
    origine: OrigineValidation,
  ) {
    super(message)
    this.champs = champs
    this.origine = origine
  }

  static depuisZod(erreur: ZodError, contexte: string): ErreurValidation {
    const champs: ChampsInvalides = {}

    for (const probleme of erreur.issues) {
      const chemin = probleme.path.join(".")
      const cle = chemin.length === 0 ? "racine" : chemin

      champs[cle] = [...(champs[cle] ?? []), probleme.message]
    }

    return new ErreurValidation(
      `Réponse non conforme au contrat de l'API (${contexte})`,
      champs,
      "reponse-api",
    )
  }

  /** Message diagnostique exploitable : chaque champ fautif et sa raison. */
  get detail(): string {
    return Object.entries(this.champs)
      .map(([champ, messages]) => `${champ} : ${messages.join(", ")}`)
      .join(" | ")
  }
}
