import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

type DeleteBookDialogProps = {
  open: boolean
  title: string
  isDeleting: boolean
  hasFailed: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export const DeleteBookDialog = ({
  open,
  title,
  isDeleting,
  hasFailed,
  onOpenChange,
  onConfirm,
}: DeleteBookDialogProps) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Supprimer cet ouvrage ?</AlertDialogTitle>
        <AlertDialogDescription>
          « {title} » sera retiré du fonds pour toute l&apos;équipe.
        </AlertDialogDescription>
      </AlertDialogHeader>
      {hasFailed ? (
        <Text variant="small" className="text-destructive">
          La suppression a échoué. L&apos;ouvrage est toujours au fonds.
        </Text>
      ) : null}
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isDeleting}>
          <Text>Annuler</Text>
        </AlertDialogCancel>
        <Button variant="destructive" onPress={onConfirm} disabled={isDeleting}>
          <Text>{isDeleting ? "Suppression…" : "Supprimer"}</Text>
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)
