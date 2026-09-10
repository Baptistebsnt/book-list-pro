import { Modal, View } from "react-native"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

type DeleteBookDialogProps = {
  visible: boolean
  title: string
  isDeleting: boolean
  hasFailed: boolean
  onCancel: () => void
  onConfirm: () => void
}

export const DeleteBookDialog = ({
  visible,
  title,
  isDeleting,
  hasFailed,
  onCancel,
  onConfirm,
}: DeleteBookDialogProps) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onCancel}
  >
    <View className="flex-1 items-center justify-center bg-black/50 p-6">
      <View className="w-full max-w-sm gap-4 rounded-lg border border-border bg-background p-6">
        <Text variant="h4">Supprimer cet ouvrage ?</Text>
        <Text variant="muted">
          « {title} » sera retiré du fonds pour toute l&apos;équipe.
        </Text>
        {hasFailed ? (
          <Text variant="small" className="text-destructive">
            La suppression a échoué. L&apos;ouvrage est toujours au fonds.
          </Text>
        ) : null}
        <View className="flex-row justify-end gap-2">
          <Button variant="outline" onPress={onCancel} disabled={isDeleting}>
            <Text>Annuler</Text>
          </Button>
          <Button
            variant="destructive"
            onPress={onConfirm}
            disabled={isDeleting}
          >
            <Text>{isDeleting ? "Suppression…" : "Supprimer"}</Text>
          </Button>
        </View>
      </View>
    </View>
  </Modal>
)
