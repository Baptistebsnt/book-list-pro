export type TypeErreur = "reseau" | "validation" | "conflit" | "auth" | "http"

/**
 * Socle commun des erreurs applicatives.
 * `type` sert de discriminant, `estReessayable` guide la politique de reprise.
 */
export abstract class ErreurApplicative extends Error {
  abstract readonly type: TypeErreur

  readonly estReessayable: boolean = false

  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = this.constructor.name
    this.cause = cause
  }
}
