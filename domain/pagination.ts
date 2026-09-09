import { z } from "zod"

/** Enveloppe paginée renvoyée par GET /books. */
export const schemaPageDe = <TElement extends z.ZodTypeAny>(
  element: TElement,
) =>
  z.object({
    items: z.array(element),
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  })

export type Page<TElement> = {
  items: TElement[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export const possedePageSuivante = (page: Page<unknown>): boolean =>
  page.page < page.totalPages
