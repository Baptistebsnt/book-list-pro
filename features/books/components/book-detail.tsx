import { type UseQueryResult } from "@tanstack/react-query"
import { View } from "react-native"
import { ErrorState } from "@/components/error-state"
import { type Book } from "@/domain/book"
import { isNotFoundError } from "@/services/api/errors"
import { BookDetailActions } from "./book-detail-actions"
import { BookDetailCard } from "./book-detail-card"
import { BookDetailSkeleton } from "./book-detail-skeleton"
import { BookNotFoundState } from "./book-not-found-state"

type BookDetailProps = {
  query: UseQueryResult<Book, Error>
}

export const BookDetail = ({ query }: BookDetailProps) => {
  if (query.isPending) {
    return <BookDetailSkeleton />
  }

  if (query.isError) {
    if (isNotFoundError(query.error)) {
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
      <BookDetailActions book={query.data} />
    </View>
  )
}
