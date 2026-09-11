import { NotebookPen } from "lucide-react-native"
import { useTranslation } from "react-i18next"
import { View } from "react-native"
import { ReadingNoteForm } from "@/components/books/reading-note-form"
import { ReadingNoteItem } from "@/components/books/reading-note-item"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Text } from "@/components/ui/text"
import { toast } from "@/components/ui/toast"
import { type NoteDraft, sortNotesByNewest } from "@/domain/note"
import { useCreateNote, useDeleteNote, useNotes } from "@/services/query/notes"

type ReadingNotesProps = {
  bookId: string
  bookTitle: string
}

const ReadingNotesSkeleton = () => (
  <View className="gap-3">
    <Skeleton className="h-24" />
    <Skeleton className="h-24" />
  </View>
)

export const ReadingNotes = ({ bookId, bookTitle }: ReadingNotesProps) => {
  const { t } = useTranslation()
  const query = useNotes(bookId)
  const createNote = useCreateNote()
  const deleteNote = useDeleteNote()

  const submitNote = async (draft: NoteDraft) => {
    await createNote.mutateAsync({ bookId, draft })
    toast.show(t("notes.addSuccess", { title: bookTitle }), { type: "success" })
  }

  const removeNote = (noteId: string): void => {
    deleteNote.mutate(
      { bookId, noteId },
      {
        onSuccess: () => {
          toast.show(t("notes.deleteSuccess"), { type: "success" })
        },
        onError: () => {
          toast.show(t("notes.deleteError", { title: bookTitle }), {
            type: "error",
          })
        },
      },
    )
  }

  if (query.isPending) {
    return <ReadingNotesSkeleton />
  }

  if (query.isError) {
    return (
      <ErrorState
        title={t("notes.loadErrorTitle")}
        description={t("notes.loadErrorDescription", { title: bookTitle })}
        onRetry={() => void query.refetch()}
        isRetrying={query.isFetching}
      />
    )
  }

  const notes = sortNotesByNewest(query.data)

  return (
    <View className="gap-4 rounded-lg border border-border bg-card p-4">
      <Text variant="h4">{t("notes.title")}</Text>

      {notes.length > 0 ? (
        <View className="gap-3" role="list" aria-label={t("notes.listLabel")}>
          {notes.map((note) => (
            <ReadingNoteItem
              disabled={deleteNote.isPending}
              key={note.id}
              note={note}
              onDelete={removeNote}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          icon={NotebookPen}
          title={t("notes.emptyTitle")}
          description={t("notes.emptyDescription", { title: bookTitle })}
        />
      )}

      <ReadingNoteForm disabled={createNote.isPending} onSubmit={submitNote} />
    </View>
  )
}
