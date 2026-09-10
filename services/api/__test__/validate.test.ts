import { describe, expect, it } from "vitest"
import { z } from "zod"
import { ResponseContractError, parseResponse } from "../validate"

const schema = z.object({
  id: z.string(),
  annee: z.number(),
})

describe("parseResponse", () => {
  it("returns the parsed data on a valid payload", () => {
    const data = parseResponse(schema, { id: "book-1", annee: 1949 }, "GET /x")

    expect(data).toEqual({ id: "book-1", annee: 1949 })
  })

  it("throws a ResponseContractError on a contract mismatch", () => {
    expect(() =>
      parseResponse(schema, { id: 1, annee: "old" }, "GET /books"),
    ).toThrow(ResponseContractError)
  })

  it("groups the failing fields and exposes readable details", () => {
    try {
      parseResponse(schema, { id: 1, annee: "old" }, "GET /books")
      expect.unreachable("parseResponse should have thrown")
    } catch (error) {
      expect(error).toBeInstanceOf(ResponseContractError)
      const contractError = error as ResponseContractError
      expect(Object.keys(contractError.fields)).toEqual(["id", "annee"])
      expect(contractError.details).toContain("id:")
      expect(contractError.details).toContain("annee:")
    }
  })
})
