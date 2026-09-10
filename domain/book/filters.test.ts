import { describe, expect, it } from "vitest"
import { DEFAULT_LIMIT, bookFiltersSchema } from "./filters"

describe("bookFiltersSchema", () => {
  it("fills in defaults for an empty filter set", () => {
    const filters = bookFiltersSchema.parse({})

    expect(filters).toEqual({
      page: 1,
      limit: DEFAULT_LIMIT,
      q: null,
      status: null,
      favori: null,
      sort: "titre",
      order: "asc",
    })
  })

  it("normalizes a blank query to null", () => {
    expect(bookFiltersSchema.parse({ q: "   " }).q).toBeNull()
  })

  it("trims a non-empty query", () => {
    expect(bookFiltersSchema.parse({ q: "  dune  " }).q).toBe("dune")
  })

  it("keeps a valid status", () => {
    expect(bookFiltersSchema.parse({ status: "lu" }).status).toBe("lu")
  })

  it("rejects an unknown status", () => {
    expect(bookFiltersSchema.safeParse({ status: "maybe" }).success).toBe(false)
  })

  it("rejects a non-positive page", () => {
    expect(bookFiltersSchema.safeParse({ page: 0 }).success).toBe(false)
  })

  it("rejects a limit above the maximum", () => {
    expect(bookFiltersSchema.safeParse({ limit: 101 }).success).toBe(false)
  })

  it("rejects an unknown sort field", () => {
    expect(bookFiltersSchema.safeParse({ sort: "pages" }).success).toBe(false)
  })
})
