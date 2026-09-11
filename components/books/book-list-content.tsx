import { router } from "expo-router"
import { SearchX } from "lucide-react-native"
import { useCallback, useEffect, useRef } from "react"
import { FlatList, type ListRenderItem, View } from "react-native"
import { BookListFooter } from "@/components/books/book-list-footer"
import { BookListItem } from "@/components/books/book-list-item"
import { BookListSkeleton } from "@/components/books/book-list-skeleton"
import { Button } from "@/components/ui/button"
import { Centered } from "@/components/ui/centered"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { Text } from "@/components/ui/text"
import { type Book, type NormalizedBookFilters } from "@/domain/book"
import { cn } from "@/lib/utils"
import { type useInfiniteBooks } from "@/services/query/books"

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

const keyExtractor = (book: Book): string => book.id

const renderItem: ListRenderItem<Book> = ({ item }) => (
  <BookListItem book={item} onPress={openBook} />
)

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
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query

  useEffect(() => {
    list.current?.scrollToOffset({ offset: 0, animated: false })
  }, [filters])

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

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

  return (
    <View
      className={cn("flex-1", isReloading && "opacity-50")}
      aria-busy={isReloading}
    >
      <FlatList
        ref={list}
        data={books}
        role="list"
        aria-label="Liste des ouvrages"
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps="handled"
        renderItem={renderItem}
        ListFooterComponent={
          <BookListFooter
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            count={books.length}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        onRefresh={query.refetch}
        refreshing={query.isRefetching}
      />
    </View>
  )
}
