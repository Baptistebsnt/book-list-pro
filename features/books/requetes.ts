import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query"
import {
  type FiltresOuvrages,
  normaliserFiltres,
} from "@/domain/filtres-ouvrages"
import { listerOuvrages, obtenirOuvrage } from "@/services/api/ouvrages"
import { clesOuvrages } from "./cles"

/** `keepPreviousData` évite de vider la liste à chaque changement de page. */
export const optionsListeOuvrages = (filtres: FiltresOuvrages = {}) => {
  const normalises = normaliserFiltres(filtres)

  return queryOptions({
    queryKey: clesOuvrages.liste(normalises),
    queryFn: ({ signal }) => listerOuvrages(normalises, signal),
    placeholderData: keepPreviousData,
  })
}

export const optionsFicheOuvrage = (id: string) =>
  queryOptions({
    queryKey: clesOuvrages.detail(id),
    queryFn: ({ signal }) => obtenirOuvrage(id, signal),
  })

export const useOuvrages = (filtres: FiltresOuvrages = {}) =>
  useQuery(optionsListeOuvrages(filtres))

export const useOuvrage = (id: string) => useQuery(optionsFicheOuvrage(id))
