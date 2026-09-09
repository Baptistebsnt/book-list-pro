import { ErreurApplicative } from "./erreur-applicative"

/**
 * 409 : la version envoyée est périmée. `ressourceServeur` porte la fiche
 * renvoyée par l'API, matière première de la résolution de conflit (lot 4).
 */
export class ErreurConflit extends ErreurApplicative {
  readonly type = "conflit" as const

  readonly ressourceServeur: unknown

  constructor(message: string, ressourceServeur: unknown) {
    super(message)
    this.ressourceServeur = ressourceServeur
  }
}
