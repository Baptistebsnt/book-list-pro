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

type DeleteNoteDialogProps = {
  disabled?: boolean
  onConfirm: () => void
}

export const DeleteNoteDialog = ({
  disabled = false,
  onConfirm,
}: DeleteNoteDialogProps) => {
  const { t } = useTranslation()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={disabled}>
          <Text>{t("notes.delete.button")}</Text>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("notes.delete.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("notes.delete.description")}
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
