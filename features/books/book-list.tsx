import { router } from "expo-router"
import { FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { BookListFooter } from "@/components/books/book-list-footer"
import { BookListHeader } from "@/components/books/book-list-header"
import { BookListItem } from "@/components/books/book-list-item"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { Loader } from "@/components/ui/loader"
import { type Book } from "@/domain/book"
import { useDeferredDeletion } from "@/providers/deferred-deletion"
import { useInfiniteBooks } from "@/services/query/books"

export const BooksList = () => {
  const { excludeDeleted } = useDeferredDeletion()
  const {
    data,
    status,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteBooks()

  if (status === "pending") {
    return <Loader />
  }

  if (status === "error") {
    return (
      <ErrorState
        title="Impossible de charger le fonds"
        message={error.message}
        refetch={refetch}
      />
    )
  }

  const books = excludeDeleted(data.pages.flatMap((page) => page.items))
  const total = data.pages[0]?.total ?? books.length

  if (books.length === 0) {
    return (
      <EmptyState
        title="Aucun ouvrage"
        message="Le fonds est vide pour le moment."
      />
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
