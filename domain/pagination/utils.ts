import { type Page } from "./schema"

export const hasNextPage = (page: Page<unknown>): boolean =>
  page.page < page.totalPages
