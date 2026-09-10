import { type UseQueryResult } from "@tanstack/react-query"
import { View } from "react-native"
import { BookDetailActions } from "@/components/books/book-detail-actions"
import { BookDetailCard } from "@/components/books/book-detail-card"
import { BookDetailSkeleton } from "@/components/books/book-detail-skeleton"
import { BookNotFoundState } from "@/components/books/book-not-found-state"
import { ErrorState } from "@/components/error-state"
import { type Book } from "@/domain/book"
import { NotFoundError } from "@/services/api/errors"

type BookDetailProps = {
  query: UseQueryResult<Book, Error>
}

export const BookDetail = ({ query }: BookDetailProps) => {
  if (query.isPending) {
    return <BookDetailSkeleton />
  }

  if (query.isError) {
    if (query.error instanceof NotFoundError) {
      return <BookNotFoundState />
    }

    return (
      <ErrorState
        title="Impossible d'afficher cette fiche"
        onRetry={() => void query.refetch()}
        isRetrying={query.isFetching}
      />
    )
  }

  return (
    <View className="gap-6">
      <BookDetailCard book={query.data} />
      <BookDetailActions bookId={query.data.id} />
    </View>
  )
}
