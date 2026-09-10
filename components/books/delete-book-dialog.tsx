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
import { UNDO_DELAY_SECONDS } from "@/providers/deferred-deletion"

type DeleteBookDialogProps = {
  titre: string
  onConfirm: () => void
}

export const DeleteBookDialog = ({
  titre,
  onConfirm,
}: DeleteBookDialogProps) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="destructive">
        <Text>Supprimer la fiche</Text>
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Supprimer « {titre} » ?</AlertDialogTitle>
        <AlertDialogDescription>
          La fiche disparaît immédiatement de la liste. Vous disposez de{" "}
          {UNDO_DELAY_SECONDS} secondes pour annuler avant la suppression
          définitive côté serveur.
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
