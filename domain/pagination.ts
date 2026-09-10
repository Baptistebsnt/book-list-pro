import { z } from "zod"

export const pageSchemaOf = <TItem extends z.ZodTypeAny>(item: TItem) =>
  z.object({
    items: z.array(item),
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  })

export type Page<TItem> = {
  items: TItem[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export const hasNextPage = (page: Page<unknown>): boolean =>
  page.page < page.totalPages
