import { z } from "zod"
import { type FiltresOuvragesNormalises } from "@/domain/filtres-ouvrages"
import {
  type Ouvrage,
  type SaisieOuvrage,
  schemaOuvrage,
} from "@/domain/ouvrage"
import { type Page, schemaPageDe } from "@/domain/pagination"
import { requeteApi } from "./client"

const schemaPageOuvrages = schemaPageDe(schemaOuvrage)

const schemaSansContenu = z.null()

export type PageOuvrages = Page<Ouvrage>

export const listerOuvrages = (
  filtres: FiltresOuvragesNormalises,
  signal?: AbortSignal,
): Promise<PageOuvrages> =>
  requeteApi({
    chemin: "/books",
    schema: schemaPageOuvrages,
    parametres: {
      page: filtres.page,
      limit: filtres.limit,
      q: filtres.q,
      status: filtres.status,
      favori: filtres.favori,
      sort: filtres.sort,
      order: filtres.order,
    },
    signal,
  })

export const obtenirOuvrage = (
  id: string,
  signal?: AbortSignal,
): Promise<Ouvrage> =>
  requeteApi({ chemin: `/books/${id}`, schema: schemaOuvrage, signal })

export const creerOuvrage = (saisie: SaisieOuvrage): Promise<Ouvrage> =>
  requeteApi({
    chemin: "/books",
    methode: "POST",
    corps: saisie,
    schema: schemaOuvrage,
  })

export type RemplacementOuvrage = {
  id: string
  version: number
  saisie: SaisieOuvrage
}

/** PUT : représentation complète, protégée par If-Match (409 si périmée). */
export const remplacerOuvrage = (
  entree: RemplacementOuvrage,
): Promise<Ouvrage> =>
  requeteApi({
    chemin: `/books/${entree.id}`,
    methode: "PUT",
    corps: entree.saisie,
    version: entree.version,
    schema: schemaOuvrage,
  })

export type ModificationOuvrage = {
  id: string
  version: number
  modifications: Partial<SaisieOuvrage>
}

/** PATCH : modification partielle, pour les bascules lu / favori. */
export const modifierOuvrage = (
  entree: ModificationOuvrage,
): Promise<Ouvrage> =>
  requeteApi({
    chemin: `/books/${entree.id}`,
    methode: "PATCH",
    corps: entree.modifications,
    version: entree.version,
    schema: schemaOuvrage,
  })

export const supprimerOuvrage = (id: string): Promise<null> =>
  requeteApi({
    chemin: `/books/${id}`,
    methode: "DELETE",
    schema: schemaSansContenu,
  })
