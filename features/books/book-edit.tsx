import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { BookDetailSkeleton } from "@/components/books/book-detail-skeleton"
import { BookForm } from "@/components/books/book-form"
import { BookNotFoundState } from "@/components/books/book-not-found-state"
import { Centered } from "@/components/ui/centered"
import { ErrorState } from "@/components/ui/error-state"
import { type BookDraft, diffDraft, toDraft } from "@/domain/book"
import { NotFoundError } from "@/services/api/errors"
import { useBook, usePatchBook } from "@/services/query/books"

type BookEditProps = {
  id: string
}

export const BookEdit = ({ id }: BookEditProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const query = useBook(id)
  const patch = usePatchBook()

  if (query.isPending) {
    return (
      <ScrollView
        contentContainerClassName="grow gap-6 p-4"
        className="bg-background"
      >
        <BookDetailSkeleton />
      </ScrollView>
    )
  }

  if (query.isError) {
    return (
      <Centered>
        {query.error instanceof NotFoundError ? (
          <BookNotFoundState />
        ) : (
          <ErrorState
            title={t("books.edit.loadError")}
            onRetry={() => void query.refetch()}
            isRetrying={query.isFetching}
          />
        )}
      </Centered>
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
    <ScrollView
      contentContainerClassName="grow gap-6 p-4"
      className="bg-background"
    >
      <BookForm
        defaultValues={toDraft(book)}
        submitLabel={t("common.save")}
        onSubmit={onSubmit}
        onCancel={() => router.back()}
      />
    </ScrollView>
  )
}
