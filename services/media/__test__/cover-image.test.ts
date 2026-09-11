import { describe, expect, it } from "vitest"
import { MAX_COVER_EDGE, fitWithin } from "../cover-image"

describe("fitWithin", () => {
  it("leaves an image already within the limit untouched", () => {
    const size = { width: 800, height: 600 }

    expect(fitWithin(size, MAX_COVER_EDGE)).toEqual(size)
  })

  it("shrinks a phone photo to the longest edge, keeping its ratio", () => {
    expect(fitWithin({ width: 4032, height: 3024 }, MAX_COVER_EDGE)).toEqual({
      width: 1024,
      height: 768,
    })
  })

  it("shrinks a portrait photo on its height", () => {
    expect(fitWithin({ width: 3024, height: 4032 }, MAX_COVER_EDGE)).toEqual({
      width: 768,
      height: 1024,
    })
  })

  it("never rounds a thin image down to zero", () => {
    expect(fitWithin({ width: 4000, height: 1 }, MAX_COVER_EDGE)).toEqual({
      width: 1024,
      height: 1,
    })
  })
})
