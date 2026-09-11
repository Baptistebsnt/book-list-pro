import { NotebookPen } from "lucide-react-native"
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
  const query = useNotes(bookId)
  const createNote = useCreateNote()
  const deleteNote = useDeleteNote()

  const submitNote = async (draft: NoteDraft) => {
    await createNote.mutateAsync({ bookId, draft })
    toast.show(`Note ajoutée à « ${bookTitle} ».`, { type: "success" })
  }

  const removeNote = (noteId: string): void => {
    deleteNote.mutate(
      { bookId, noteId },
      {
        onSuccess: () => {
          toast.show("Note supprimée.", { type: "success" })
        },
        onError: () => {
          toast.show(
            `Impossible de supprimer cette note de « ${bookTitle} ». Réessayez plus tard.`,
            { type: "error" },
          )
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
        title="Impossible d'afficher les notes"
        description={`Les notes de lecture de « ${bookTitle} » n'ont pas pu être chargées. Vérifiez la connexion de la boutique, puis réessayez.`}
        onRetry={() => void query.refetch()}
        isRetrying={query.isFetching}
      />
    )
  }

  const notes = sortNotesByNewest(query.data)

  return (
    <View className="gap-4 rounded-lg border border-border bg-card p-4">
      <Text variant="h4">Notes de lecture</Text>

      {notes.length > 0 ? (
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
          icon={NotebookPen}
          title="Aucune note de lecture"
          description={`Personne n'a encore noté de remarque sur « ${bookTitle} ». Votre première note apparaîtra ici.`}
        />
      )}

      <ReadingNoteForm disabled={createNote.isPending} onSubmit={submitNote} />
    </View>
  )
}
