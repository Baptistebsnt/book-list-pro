import { describe, expect, it } from "vitest"
import { resolveCoverUrl } from "../covers"

const BASE = "http://localhost:3000"

describe("resolveCoverUrl", () => {
  it("prefixes a relative path with the API base url", () => {
    expect(resolveCoverUrl("/covers/dune.svg", "dune")).toBe(
      `${BASE}/covers/dune.svg`,
    )
    expect(resolveCoverUrl("/media/dune.png", "dune")).toBe(
      `${BASE}/media/dune.png`,
    )
  })

  it("prefixes a relative path that omits its leading slash", () => {
    expect(resolveCoverUrl("media/dune.png", "dune")).toBe(
      `${BASE}/media/dune.png`,
    )
  })

  it("leaves an absolute url untouched", () => {
    const absolute = "https://cdn.example.com/covers/dune.jpg?v=2"

    expect(resolveCoverUrl(absolute, "dune")).toBe(absolute)
  })

  it("falls back to the generated cover when the field is null", () => {
    expect(resolveCoverUrl(null, "book-1")).toBe(`${BASE}/covers/book-1.svg`)
  })

  it("falls back to the generated cover when the field holds no path", () => {
    expect(resolveCoverUrl("   ", "book-1")).toBe(`${BASE}/covers/book-1.svg`)
  })

  it("falls back to the generated cover rather than yield a broken url", () => {
    expect(resolveCoverUrl("http://", "book-1")).toBe(
      `${BASE}/covers/book-1.svg`,
    )
  })

  it("escapes an identifier that would break the fallback path", () => {
    expect(resolveCoverUrl(null, "livre 1/2")).toBe(
      `${BASE}/covers/livre%201%2F2.svg`,
    )
  })
})
