import { describe, expect, it } from "vitest"
import { type Page } from "../schema"
import { hasNextPage } from "../utils"

const page = (overrides: Partial<Page<unknown>>): Page<unknown> => ({
  items: [],
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  ...overrides,
})

describe("hasNextPage", () => {
  it("is true when the current page is before the last", () => {
    expect(hasNextPage(page({ page: 1, totalPages: 3 }))).toBe(true)
  })

  it("is false on the last page", () => {
    expect(hasNextPage(page({ page: 3, totalPages: 3 }))).toBe(false)
  })

  it("is false when there are no pages at all", () => {
    expect(hasNextPage(page({ page: 1, totalPages: 0 }))).toBe(false)
  })
})
