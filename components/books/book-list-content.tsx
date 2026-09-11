import { router } from "expo-router"
import { SearchX } from "lucide-react-native"
import { useEffect, useRef } from "react"
import { FlatList } from "react-native"
import { BookListFooter } from "@/components/books/book-list-footer"
import { BookListItem } from "@/components/books/book-list-item"
import { BookListSkeleton } from "@/components/books/book-list-skeleton"
import { Button } from "@/components/ui/button"
import { Centered } from "@/components/ui/centered"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { Text } from "@/components/ui/text"
import { type Book, type NormalizedBookFilters } from "@/domain/book"
import { type useInfiniteBooks } from "@/services/query/books"

const RELOAD_SKELETON_ROWS = 3

type BookListContentProps = {
  books: Book[]
  filters: NormalizedBookFilters
  isFiltered: boolean
  isReloading: boolean
  onReset: () => void
  query: ReturnType<typeof useInfiniteBooks>
}

const openBook = (book: Book) =>
  router.push({ pathname: "/books/[id]", params: { id: book.id } })

const emptyTitle = (searchedTerm: string): string =>
  searchedTerm.length > 0
    ? `Aucun résultat pour « ${searchedTerm} »`
    : "Aucun ouvrage ne correspond"

export const BookListContent = ({
  books,
  filters,
  isFiltered,
  isReloading,
  onReset,
  query,
}: BookListContentProps) => {
  const list = useRef<FlatList<Book>>(null)

  useEffect(() => {
    list.current?.scrollToOffset({ offset: 0, animated: false })
  }, [filters])

  if (query.status === "pending") {
    return <BookListSkeleton />
  }

  if (query.status === "error") {
    return (
      <Centered>
        <ErrorState
          title="Impossible de charger le fonds"
          onRetry={() => void query.refetch()}
          isRetrying={query.isRefetching}
        />
      </Centered>
    )
  }

  if (isReloading) {
    return <BookListSkeleton rows={RELOAD_SKELETON_ROWS} />
  }

  if (books.length === 0) {
    return (
      <Centered>
        {isFiltered ? (
          <EmptyState
            icon={SearchX}
            title={emptyTitle(filters.q ?? "")}
            description="Aucun ouvrage du fonds ne répond à cette recherche et à ces filtres."
          >
            <Button variant="outline" onPress={onReset}>
              <Text>Réinitialiser</Text>
            </Button>
          </EmptyState>
        ) : (
          <EmptyState
            title="Aucun ouvrage"
            description="Le fonds est vide pour le moment. Ajoutez un premier ouvrage pour démarrer le catalogue."
          />
        )}
      </Centered>
    )
  }

  const loadMore = () => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage()
    }
  }

  return (
    <FlatList
      ref={list}
      data={books}
      keyExtractor={(book) => book.id}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => (
        <BookListItem book={item} onPress={() => openBook(item)} />
      )}
      ListFooterComponent={
        <BookListFooter
          isFetchingNextPage={query.isFetchingNextPage}
          hasNextPage={query.hasNextPage}
          count={books.length}
        />
      }
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      onRefresh={query.refetch}
      refreshing={query.isRefetching}
    />
  )
}
