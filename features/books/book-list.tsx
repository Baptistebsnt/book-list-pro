import { router } from "expo-router"
import { FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { BookListFooter } from "@/components/books/book-list-footer"
import { BookListHeader } from "@/components/books/book-list-header"
import { BookListItem } from "@/components/books/book-list-item"
import { BookListSkeleton } from "@/components/books/book-list-skeleton"
import { Centered } from "@/components/ui/centered"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { type Book } from "@/domain/book"
import { useDeferredDeletion } from "@/providers/deferred-deletion"
import { useInfiniteBooks } from "@/services/query/books"

export const BooksList = () => {
  const { excludeDeleted } = useDeferredDeletion()
  const {
    data,
    status,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteBooks()

  if (status === "pending") {
    return <BookListSkeleton />
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

  const books = excludeDeleted(data.pages.flatMap((page) => page.items))
  const total = data.pages[0]?.total ?? books.length

  if (books.length === 0) {
    return (
      <Centered>
        <EmptyState
          title="Aucun ouvrage"
          description="Le fonds est vide pour le moment. Ajoutez un premier ouvrage pour démarrer le catalogue."
        />
      </Centered>
    )
  }

  const openBook = (book: Book) =>
    router.push({ pathname: "/books/[id]", params: { id: book.id } })

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <FlatList
        data={books}
        keyExtractor={(book) => book.id}
        renderItem={({ item }) => (
          <BookListItem book={item} onPress={() => openBook(item)} />
        )}
        ListHeaderComponent={
          <BookListHeader count={books.length} total={total} />
        }
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
    </SafeAreaView>
  )
}
