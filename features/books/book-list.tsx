import { router } from "expo-router"
import { SearchX } from "lucide-react-native"
import { FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { BookListFooter } from "@/components/books/book-list-footer"
import { BookListHeader } from "@/components/books/book-list-header"
import { BookListItem } from "@/components/books/book-list-item"
import { BookListSkeleton } from "@/components/books/book-list-skeleton"
import { BookSearchBar } from "@/components/books/book-search-bar"
import { Button } from "@/components/ui/button"
import { Centered } from "@/components/ui/centered"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { Text } from "@/components/ui/text"
import { type Book } from "@/domain/book"
import { useDeferredDeletion } from "@/providers/deferred-deletion"
import { useBookSearch } from "@/services/query/books"

const SEARCH_SKELETON_ROWS = 3

const openBook = (book: Book) =>
  router.push({ pathname: "/books/[id]", params: { id: book.id } })

export const BooksList = () => {
  const { excludeDeleted } = useDeferredDeletion()
  const { term, setTerm, searchedTerm, isSearching, query } = useBookSearch()
  const {
    data,
    status,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = query

  const books = excludeDeleted(data?.pages.flatMap((page) => page.items) ?? [])
  const total = data?.pages[0]?.total ?? books.length

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }

  const content = () => {
    if (status === "pending") {
      return <BookListSkeleton />
    }

    if (isSearching) {
      return <BookListSkeleton rows={SEARCH_SKELETON_ROWS} />
    }

    if (status === "error") {
      return (
        <Centered>
          <ErrorState
            title="Impossible de charger le fonds"
            onRetry={() => void refetch()}
            isRetrying={isRefetching}
          />
        </Centered>
      )
    }

    if (books.length === 0) {
      if (searchedTerm.length > 0) {
        return (
          <Centered>
            <EmptyState
              icon={SearchX}
              title={`Aucun résultat pour « ${searchedTerm} »`}
              description="Aucun titre ni auteur du fonds ne correspond à cette recherche."
            >
              <Button variant="outline" onPress={() => setTerm("")}>
                <Text>Effacer la recherche</Text>
              </Button>
            </EmptyState>
          </Centered>
        )
      }

      return (
        <Centered>
          <EmptyState
            title="Aucun ouvrage"
            description="Le fonds est vide pour le moment. Ajoutez un premier ouvrage pour démarrer le catalogue."
          />
        </Centered>
      )
    }

    return (
      <FlatList
        data={books}
        keyExtractor={(book) => book.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <BookListItem book={item} onPress={() => openBook(item)} />
        )}
        ListFooterComponent={
          <BookListFooter
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            count={books.length}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        onRefresh={refetch}
        refreshing={isRefetching}
      />
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <BookListHeader
        count={status === "success" && !isSearching ? books.length : null}
        total={status === "success" && !isSearching ? total : null}
        searchedTerm={searchedTerm}
      />
      <BookSearchBar value={term} onChange={setTerm} />
      {content()}
    </SafeAreaView>
  )
}
