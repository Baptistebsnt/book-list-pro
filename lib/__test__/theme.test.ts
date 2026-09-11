import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { THEME } from "@/lib/theme"

const CSS = readFileSync(resolve(process.cwd(), "global.css"), "utf8")

const HSL = /^[\d.]+ [\d.]+% [\d.]+%$/u

const DECLARATION = /--([\w-]+):\s*([^;]+);/gu

const capitalize = (part: string): string =>
  `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`

const camelize = (token: string): string =>
  token
    .split("-")
    .map((part, index) => (index === 0 ? part : capitalize(part)))
    .join("")

const readBlock = (selector: string): Record<string, string> => {
  const block = new RegExp(`${selector}\\s*\\{([^}]*)\\}`, "u").exec(CSS)

  if (block === null) {
    throw new Error(`Bloc ${selector} introuvable dans global.css`)
  }

  return Object.fromEntries(
    [...block[1].matchAll(DECLARATION)].map((declaration) => {
      const value = declaration[2].trim()

      return [
        camelize(declaration[1]),
        HSL.test(value) ? `hsl(${value})` : value,
      ]
    }),
  )
}

describe("tokens de thème", () => {
  it("garde le thème clair aligné entre global.css et THEME", () => {
    expect(readBlock(":root")).toEqual(THEME.light)
  })

  it("garde le thème sombre aligné entre global.css et THEME", () => {
    expect(readBlock("\\.dark:root")).toEqual(THEME.dark)
  })
})
