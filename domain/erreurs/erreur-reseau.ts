import { ErreurApplicative } from "./erreur-applicative"

export type RaisonReseau = "hors-ligne" | "delai-expire" | "indisponible"

/** Le serveur n'a pas répondu, ou a répondu 503 : l'opération peut être rejouée. */
export class ErreurReseau extends ErreurApplicative {
  readonly type = "reseau" as const

  override readonly estReessayable = true

  readonly raison: RaisonReseau

  constructor(raison: RaisonReseau, message: string, cause?: unknown) {
    super(message, cause)
    this.raison = raison
  }
}
