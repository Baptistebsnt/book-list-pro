import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { DeletionFailureBar } from "@/components/books/deletion-failure-bar"
import { UndoDeletionBar } from "@/components/books/undo-deletion-bar"
import {
  UNDO_DELAY_SECONDS,
  useDeferredDeletion,
} from "@/providers/deferred-deletion"

const EDGE_SPACING = 16

export const DeletionBanner = () => {
  const insets = useSafeAreaInsets()
  const { pending, failed, cancelDeletion, dismissFailure } =
    useDeferredDeletion()

  if (pending === null && failed === null) {
    return null
  }

  return (
    <View
      pointerEvents="box-none"
      className="absolute bottom-0 left-0 right-0 gap-2 px-4"
      style={{ paddingBottom: insets.bottom + EDGE_SPACING }}
    >
      {pending && (
        <UndoDeletionBar
          key={pending.id}
          titre={pending.titre}
          seconds={UNDO_DELAY_SECONDS}
          onUndo={cancelDeletion}
        />
      )}
      {failed && (
        <DeletionFailureBar titre={failed.titre} onDismiss={dismissFailure} />
      )}
    </View>
  )
}
