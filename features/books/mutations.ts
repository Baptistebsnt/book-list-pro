import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type Ouvrage } from "@/domain/ouvrage"
import {
  creerOuvrage,
  modifierOuvrage,
  remplacerOuvrage,
  supprimerOuvrage,
} from "@/services/api/ouvrages"
import { clesOuvrages } from "./cles"
import { invaliderOuvrages } from "./invalidation"

export const useCreerOuvrage = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: creerOuvrage,
    onSuccess: async (ouvrage: Ouvrage) => {
      client.setQueryData(clesOuvrages.detail(ouvrage.id), ouvrage)
      await invaliderOuvrages(client)
    },
  })
}

export const useRemplacerOuvrage = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: remplacerOuvrage,
    onSuccess: async (ouvrage: Ouvrage) => {
      client.setQueryData(clesOuvrages.detail(ouvrage.id), ouvrage)
      await invaliderOuvrages(client, ouvrage.id)
    },
  })
}

export const useModifierOuvrage = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: modifierOuvrage,
    onSuccess: async (ouvrage: Ouvrage) => {
      client.setQueryData(clesOuvrages.detail(ouvrage.id), ouvrage)
      await invaliderOuvrages(client, ouvrage.id)
    },
  })
}

export const useSupprimerOuvrage = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: supprimerOuvrage,
    onSuccess: async (resultat: null, id: string) => {
      client.removeQueries({ queryKey: clesOuvrages.detail(id) })
      await invaliderOuvrages(client)
    },
  })
}
