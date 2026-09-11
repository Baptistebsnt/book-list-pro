import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

type DeleteNoteDialogProps = {
  disabled?: boolean
  onConfirm: () => void
}

export const DeleteNoteDialog = ({
  disabled = false,
  onConfirm,
}: DeleteNoteDialogProps) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="destructive" size="sm" disabled={disabled}>
        <Text>Supprimer</Text>
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Supprimer cette note ?</AlertDialogTitle>
        <AlertDialogDescription>
          Cette action retire définitivement la note de lecture.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>
          <Text>Conserver</Text>
        </AlertDialogCancel>
        <AlertDialogAction className="bg-destructive" onPress={onConfirm}>
          <Text>Supprimer</Text>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)
