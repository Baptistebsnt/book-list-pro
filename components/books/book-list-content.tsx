import { router } from "expo-router"
import { BookPlus, SearchX } from "lucide-react-native"
import { useCallback, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { FlatList, type ListRenderItem, View } from "react-native"
import { BookListFooter } from "@/components/books/book-list-footer"
import {
  BOOK_ROW_HEIGHT,
  BookListItem,
} from "@/components/books/book-list-item"
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

const openNewBook = () => router.push("/new")

const INITIAL_RENDER_COUNT = 12
const MAX_RENDER_PER_BATCH = 12
const BATCHING_PERIOD_MS = 50
const WINDOW_SIZE = 11
const END_REACHED_THRESHOLD = 0.5

const keyExtractor = (book: Book): string => book.id

const renderItem: ListRenderItem<Book> = ({ item }) => (
  <BookListItem book={item} onPress={openBook} />
)

const getItemLayout = (
  _: ArrayLike<Book> | null | undefined,
  index: number,
) => ({
  length: BOOK_ROW_HEIGHT,
  offset: BOOK_ROW_HEIGHT * index,
  index,
})

export const BookListContent = ({
  books,
  filters,
  isFiltered,
  isReloading,
  onReset,
  query,
}: BookListContentProps) => {
  const { t } = useTranslation()
  const list = useRef<FlatList<Book>>(null)
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query

  const emptyTitle = (searchedTerm: string): string =>
    searchedTerm.length > 0
      ? t("books.empty.searchTitle", { term: searchedTerm })
      : t("books.empty.filterTitle")

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
          title={t("books.list.loadError")}
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
            description={t("books.empty.filterDescription")}
          >
            <Button variant="outline" onPress={onReset}>
              <Text>{t("common.reset")}</Text>
            </Button>
          </EmptyState>
        ) : (
          <EmptyState
            icon={BookPlus}
            title={t("books.empty.title")}
            description={t("books.empty.description")}
          >
            <Button onPress={openNewBook}>
              <Text>{t("books.empty.addButton")}</Text>
            </Button>
          </EmptyState>
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
        aria-label={t("books.list.label")}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps="handled"
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        removeClippedSubviews
        initialNumToRender={INITIAL_RENDER_COUNT}
        maxToRenderPerBatch={MAX_RENDER_PER_BATCH}
        updateCellsBatchingPeriod={BATCHING_PERIOD_MS}
        windowSize={WINDOW_SIZE}
        ListFooterComponent={
          <BookListFooter
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            count={books.length}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={END_REACHED_THRESHOLD}
        onRefresh={query.refetch}
        refreshing={query.isRefetching}
      />
    </View>
  )
}
