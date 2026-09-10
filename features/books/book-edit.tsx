import { useRouter } from "expo-router"
import { ScrollView } from "react-native"
import { BookDetailSkeleton } from "@/components/books/book-detail-skeleton"
import { BookForm } from "@/components/books/book-form"
import { BookNotFoundState } from "@/components/books/book-not-found-state"
import { ErrorState } from "@/components/error-state"
import { type BookDraft, diffDraft, toDraft } from "@/domain/book"
import { NotFoundError } from "@/services/api/errors"
import { useBook, usePatchBook } from "@/services/query/books"

type BookEditProps = {
  id: string
}

export const BookEdit = ({ id }: BookEditProps) => {
  const router = useRouter()
  const query = useBook(id)
  const patch = usePatchBook()

  if (query.isPending) {
    return <BookDetailSkeleton />
  }

  if (query.isError) {
    if (query.error instanceof NotFoundError) {
      return <BookNotFoundState />
    }

    return (
      <ErrorState
        title="Impossible de charger cette fiche"
        onRetry={() => void query.refetch()}
        isRetrying={query.isFetching}
      />
    )
  }

  const book = query.data

  const onSubmit = async (values: BookDraft) => {
    const changes = diffDraft(toDraft(book), values)

    if (Object.keys(changes).length > 0) {
      await patch.mutateAsync({ id: book.id, version: book.version, changes })
    }

    router.replace({ pathname: "/books/[id]", params: { id: book.id } })
  }

  return (
    <ScrollView contentContainerClassName="gap-6 p-4" className="bg-background">
      <BookForm
        defaultValues={toDraft(book)}
        submitLabel="Enregistrer"
        onSubmit={onSubmit}
        onCancel={() => router.back()}
      />
    </ScrollView>
  )
}
