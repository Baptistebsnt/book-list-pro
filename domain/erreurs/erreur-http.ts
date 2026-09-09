import { ErreurApplicative } from "./erreur-applicative"

/** Tout statut d'échec sans traitement dédié : 400, 404, 413, 415... */
export class ErreurHttp extends ErreurApplicative {
  readonly type = "http" as const

  readonly statut: number

  readonly corps: unknown

  constructor(message: string, statut: number, corps: unknown) {
    super(message)
    this.statut = statut
    this.corps = corps
  }
}
