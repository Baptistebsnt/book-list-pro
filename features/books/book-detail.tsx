import { type UseQueryResult } from "@tanstack/react-query"
import { View } from "react-native"
import { BookDetailActions } from "@/components/books/book-detail-actions"
import { BookDetailCard } from "@/components/books/book-detail-card"
import { BookDetailSkeleton } from "@/components/books/book-detail-skeleton"
import { BookNotFoundState } from "@/components/books/book-not-found-state"
import { DeleteBookDialog } from "@/components/books/delete-book-dialog"
import { ErrorState } from "@/components/error-state"
import { type Book } from "@/domain/book"
import { useBookDeletion } from "@/hooks/use-book-deletion"
import { isNotFoundError } from "@/services/api/errors"

type BookDetailProps = {
  id: string
  query: UseQueryResult<Book, Error>
}

export const BookDetail = ({ id, query }: BookDetailProps) => {
  const deletion = useBookDeletion(id)

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
      <BookDetailActions
        bookId={query.data.id}
        onDelete={() => deletion.setConfirming(true)}
      />
      <DeleteBookDialog
        open={deletion.isConfirming}
        title={query.data.titre}
        isDeleting={deletion.isDeleting}
        hasFailed={deletion.hasFailed}
        onOpenChange={deletion.setConfirming}
        onConfirm={deletion.confirm}
      />
    </View>
  )
}
