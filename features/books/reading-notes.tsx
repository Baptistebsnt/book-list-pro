import { useState } from "react"
import { View } from "react-native"
import { ReadingNoteForm } from "@/components/books/reading-note-form"
import { ReadingNoteItem } from "@/components/books/reading-note-item"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Text } from "@/components/ui/text"
import { type NoteDraft, sortNotesByNewest } from "@/domain/note"
import { useCreateNote, useDeleteNote, useNotes } from "@/services/query/notes"

type ReadingNotesProps = {
  bookId: string
}

const ReadingNotesSkeleton = () => (
  <View className="gap-3">
    <Skeleton className="h-24" />
    <Skeleton className="h-24" />
  </View>
)

export const ReadingNotes = ({ bookId }: ReadingNotesProps) => {
  const [showSuccess, setShowSuccess] = useState(false)
  const query = useNotes(bookId)
  const createNote = useCreateNote()
  const deleteNote = useDeleteNote()

  const submitNote = async (draft: NoteDraft) => {
    setShowSuccess(false)
    await createNote.mutateAsync({ bookId, draft })
    setShowSuccess(true)
  }

  const removeNote = (noteId: string): void => {
    deleteNote.mutate({ bookId, noteId })
  }

  if (query.isPending) {
    return <ReadingNotesSkeleton />
  }

  if (query.isError) {
    return (
      <ErrorState
        title="Impossible d'afficher les notes"
        onRetry={() => void query.refetch()}
        isRetrying={query.isFetching}
      />
    )
  }

  const notes = sortNotesByNewest(query.data)
  const hasNotes = notes.length > 0

  return (
    <View className="gap-4 rounded-lg border border-border bg-card p-4">
      <View className="gap-1">
        <Text variant="h4">Notes de lecture</Text>
        {showSuccess ? (
          <Text
            role="alert"
            aria-live="polite"
            className="text-sm text-primary"
          >
            Note ajoutée.
          </Text>
        ) : null}
      </View>

      {hasNotes ? (
        <View className="gap-3" role="list" aria-label="Notes de lecture">
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
          title="Aucune note"
          description="Aucune note de lecture n'a encore été ajoutée."
        />
      )}

      <ReadingNoteForm disabled={createNote.isPending} onSubmit={submitNote} />
    </View>
  )
}
