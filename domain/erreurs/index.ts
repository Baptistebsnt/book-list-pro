import { ErreurApplicative, type TypeErreur } from "./erreur-applicative"
import { ErreurAuth, type RaisonAuth } from "./erreur-auth"
import { ErreurConflit } from "./erreur-conflit"
import { ErreurHttp } from "./erreur-http"
import { ErreurReseau, type RaisonReseau } from "./erreur-reseau"
import {
  type ChampsInvalides,
  ErreurValidation,
  type OrigineValidation,
} from "./erreur-validation"

export {
  ErreurApplicative,
  ErreurAuth,
  ErreurConflit,
  ErreurHttp,
  ErreurReseau,
  ErreurValidation,
}

export type {
  ChampsInvalides,
  OrigineValidation,
  RaisonAuth,
  RaisonReseau,
  TypeErreur,
}

/** Union discriminée : un `switch` sur `type` couvre tous les cas. */
export type Erreur =
  ErreurAuth | ErreurConflit | ErreurHttp | ErreurReseau | ErreurValidation

export const estErreurApplicative = (valeur: unknown): valeur is Erreur =>
  valeur instanceof ErreurApplicative
