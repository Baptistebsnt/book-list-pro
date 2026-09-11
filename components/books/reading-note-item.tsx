import { View } from "react-native"
import { DeleteNoteDialog } from "@/components/books/delete-note-dialog"
import { Text } from "@/components/ui/text"
import { type Note } from "@/domain/note"
import { useFormatters } from "@/hooks/use-formatters"

type ReadingNoteItemProps = {
  disabled?: boolean
  note: Note
  onDelete: (noteId: string) => void
}

export const ReadingNoteItem = ({
  disabled = false,
  note,
  onDelete,
}: ReadingNoteItemProps) => {
  const { formatDateTime } = useFormatters()

  return (
    <View
      role="listitem"
      className="gap-3 rounded-lg border border-border bg-card p-4"
    >
      <View className="gap-1">
        <Text>{note.contenu}</Text>
        <Text variant="muted">{formatDateTime(note.createdAt)}</Text>
      </View>
      <DeleteNoteDialog
        disabled={disabled}
        onConfirm={() => onDelete(note.id)}
      />
    </View>
  )
}
