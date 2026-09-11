import { useTranslation } from "react-i18next"
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
}: DeleteBookDialogProps) => {
  const { t } = useTranslation()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Text>{t("books.delete.trigger")}</Text>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("books.delete.title", { title: titre })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("books.delete.description", { seconds: UNDO_DELAY_SECONDS })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Text>{t("common.keep")}</Text>
          </AlertDialogCancel>
          <AlertDialogAction className="bg-destructive" onPress={onConfirm}>
            <Text>{t("common.delete")}</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
