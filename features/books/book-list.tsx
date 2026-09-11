import { SafeAreaView } from "react-native-safe-area-context"
import { BookFilterBar } from "@/components/books/book-filter-bar"
import { BookListContent } from "@/components/books/book-list-content"
import { BookListHeader } from "@/components/books/book-list-header"
import { BookSearchBar } from "@/components/books/book-search-bar"
import { hasActiveFilter } from "@/domain/book"
import { useDeferredDeletion } from "@/providers/deferred-deletion"
import { useBookBrowse } from "@/services/query/books"

export const BooksList = () => {
  const { excludeDeleted } = useDeferredDeletion()
  const { term, setTerm, controls, apply, reset, filters, isReloading, query } =
    useBookBrowse()

  const books = excludeDeleted(
    query.data?.pages.flatMap((page) => page.items) ?? [],
  )
  const total = query.data?.pages[0]?.total ?? books.length
  const isSettled = query.status === "success" && !isReloading

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <BookListHeader
        count={isSettled ? books.length : null}
        total={isSettled ? total : null}
        searchedTerm={filters.q ?? ""}
      />
      <BookSearchBar value={term} onChange={setTerm} />
      <BookFilterBar controls={controls} onChange={apply} />
      <BookListContent
        books={books}
        filters={filters}
        isFiltered={hasActiveFilter(filters)}
        isReloading={isReloading}
        onReset={reset}
        query={query}
      />
    </SafeAreaView>
  )
}
