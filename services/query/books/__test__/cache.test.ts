import { type InfiniteData } from "@tanstack/react-query"
import { describe, expect, it } from "vitest"
import { type Book, normalizeFilters } from "@/domain/book"
import { type BookPage } from "@/services/api/books"
import { makeBook, makeBookPage } from "@/test/factories"
import { createQueryWrapper } from "@/test/query"
import { patchBookInCaches, restoreBookCaches } from "../cache"
import { bookKeys } from "../keys"

const listKey = bookKeys.list(normalizeFilters({}))
const infiniteKey = bookKeys.infiniteList(normalizeFilters({}))

const seedClient = () => createQueryWrapper().client

describe("patchBookInCaches", () => {
  it("patches the book in the detail, list and infinite caches at once", () => {
    const client = seedClient()
    const book = makeBook({ id: "target", favori: false })
    const other = makeBook({ id: "other", favori: false })

    client.setQueryData(bookKeys.detail(book.id), book)
    client.setQueryData(listKey, makeBookPage({ items: [book, other] }))
    client.setQueryData<InfiniteData<BookPage>>(infiniteKey, {
      pages: [makeBookPage({ items: [book] })],
      pageParams: [1],
    })

    patchBookInCaches(client, book.id, { favori: true })

    expect(client.getQueryData<Book>(bookKeys.detail(book.id))?.favori).toBe(
      true,
    )
    const list = client.getQueryData<BookPage>(listKey)
    expect(list?.items[0]?.favori).toBe(true)
    expect(list?.items[1]?.favori).toBe(false)
    expect(
      client.getQueryData<InfiniteData<BookPage>>(infiniteKey)?.pages[0]
        ?.items[0]?.favori,
    ).toBe(true)
  })

  it("returns a snapshot of the caches before they were patched", () => {
    const client = seedClient()
    const book = makeBook({ id: "target", lu: false })
    client.setQueryData(bookKeys.detail(book.id), book)

    const snapshot = patchBookInCaches(client, book.id, { lu: true })

    const detailEntry = snapshot.find(
      ([key]) => key.at(-1) === book.id,
    )?.[1] as Book | undefined
    expect(detailEntry?.lu).toBe(false)
  })

  it("leaves caches that do not hold the book untouched", () => {
    const client = seedClient()
    const untouched = makeBookPage({
      items: [makeBook({ id: "someone-else" })],
    })
    client.setQueryData(listKey, untouched)

    patchBookInCaches(client, "missing", { favori: true })

    expect(client.getQueryData<BookPage>(listKey)).toBe(untouched)
  })
})

describe("restoreBookCaches", () => {
  it("rolls every cache back to the snapshot taken before the patch", () => {
    const client = seedClient()
    const book = makeBook({ id: "target", favori: false, version: 3 })
    client.setQueryData(bookKeys.detail(book.id), book)
    client.setQueryData(listKey, makeBookPage({ items: [book] }))

    const snapshot = patchBookInCaches(client, book.id, { favori: true })
    // The optimistic write is now visible in both caches.
    expect(client.getQueryData<Book>(bookKeys.detail(book.id))?.favori).toBe(
      true,
    )

    restoreBookCaches(client, snapshot)

    expect(client.getQueryData<Book>(bookKeys.detail(book.id))?.favori).toBe(
      false,
    )
    expect(client.getQueryData<BookPage>(listKey)?.items[0]?.favori).toBe(false)
  })
})
