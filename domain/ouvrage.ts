import { z } from "zod"

export const ANNEE_MINIMALE = 1450

export const NOTE_MAXIMALE = 5

/**
 * Contrat d'un ouvrage tel que l'API le renvoie (annexe du cahier des charges).
 * Ce schéma est la seule source de vérité : le type en est déduit, jamais
 * l'inverse, pour qu'un champ ajouté au type soit forcément validé.
 */
export const schemaOuvrage = z.object({
  id: z.string().min(1),
  titre: z.string().min(1),
  auteur: z.string().min(1),
  editeur: z.string(),
  annee: z.number().int().min(ANNEE_MINIMALE),
  lu: z.boolean(),
  favori: z.boolean(),
  note: z.number().min(0).max(NOTE_MAXIMALE).nullable(),
  couverture: z.string().nullable(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  version: z.number().int().nonnegative(),
})

export type Ouvrage = z.infer<typeof schemaOuvrage>

/** Champs saisis par le libraire : le serveur possède tout le reste. */
export const schemaSaisieOuvrage = z.object({
  titre: z.string().trim().min(1, "Le titre est obligatoire"),
  auteur: z.string().trim().min(1, "L'auteur est obligatoire"),
  editeur: z.string().trim().min(1, "L'éditeur est obligatoire"),
  annee: z
    .number()
    .int("L'année doit être un entier")
    .min(ANNEE_MINIMALE, `L'année doit être postérieure à ${ANNEE_MINIMALE}`)
    .max(
      new Date().getFullYear() + 1,
      "L'année ne peut pas être dans un futur lointain",
    ),
  lu: z.boolean(),
  favori: z.boolean(),
  note: z.number().int().min(0).max(NOTE_MAXIMALE).nullable(),
})

export type SaisieOuvrage = z.infer<typeof schemaSaisieOuvrage>

export const SAISIE_VIDE: SaisieOuvrage = {
  titre: "",
  auteur: "",
  editeur: "",
  annee: new Date().getFullYear(),
  lu: false,
  favori: false,
  note: null,
}

/** Pré-remplit le formulaire d'édition depuis une fiche existante. */
export const versSaisie = (ouvrage: Ouvrage): SaisieOuvrage => ({
  titre: ouvrage.titre,
  auteur: ouvrage.auteur,
  editeur: ouvrage.editeur,
  annee: ouvrage.annee,
  lu: ouvrage.lu,
  favori: ouvrage.favori,
  note: ouvrage.note,
})
