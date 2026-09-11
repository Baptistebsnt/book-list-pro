import { View } from "react-native"
import { DeleteNoteDialog } from "@/components/books/delete-note-dialog"
import { Text } from "@/components/ui/text"
import { type Note } from "@/domain/note"

type ReadingNoteItemProps = {
  disabled?: boolean
  note: Note
  onDelete: (noteId: string) => void
}

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
})

const formatCreatedAt = (value: string): string =>
  DATE_FORMATTER.format(new Date(value))

export const ReadingNoteItem = ({
  disabled = false,
  note,
  onDelete,
}: ReadingNoteItemProps) => (
  <View className="gap-3 rounded-lg border border-border bg-card p-4">
    <View className="gap-1">
      <Text>{note.contenu}</Text>
      <Text variant="muted">{formatCreatedAt(note.createdAt)}</Text>
    </View>
    <DeleteNoteDialog disabled={disabled} onConfirm={() => onDelete(note.id)} />
  </View>
)
