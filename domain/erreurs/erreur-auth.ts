import { ErreurApplicative } from "./erreur-applicative"

export type RaisonAuth = "non-authentifie" | "droits-insuffisants"

/** 401 (jeton à rafraîchir) ou 403 (rôle insuffisant). */
export class ErreurAuth extends ErreurApplicative {
  readonly type = "auth" as const

  readonly raison: RaisonAuth

  constructor(raison: RaisonAuth, message: string) {
    super(message)
    this.raison = raison
  }
}
