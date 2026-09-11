import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { type NoteDraft, noteDraftSchema } from "@/domain/note"
import { ValidationError } from "@/services/api/errors"

type ReadingNoteFormProps = {
  disabled?: boolean
  onSubmit: (draft: NoteDraft) => Promise<void>
}

const DEFAULT_VALUES: NoteDraft = { contenu: "" }

export const ReadingNoteForm = ({
  disabled = false,
  onSubmit,
}: ReadingNoteFormProps) => {
  const { control, formState, handleSubmit, reset, setError } =
    useForm<NoteDraft>({
      defaultValues: DEFAULT_VALUES,
      resolver: zodResolver(noteDraftSchema),
    })

  const submit = handleSubmit(async (draft) => {
    try {
      await onSubmit(draft)
      reset()
    } catch (error) {
      if (error instanceof ValidationError) {
        setError("contenu", { message: error.fields.contenu })

        return
      }

      setError("root", {
        message:
          error instanceof Error ? error.message : "Une erreur est survenue.",
      })
    }
  })

  const isSubmitting = disabled || formState.isSubmitting

  return (
    <View className="gap-3">
      <Controller
        control={control}
        name="contenu"
        render={({ field, fieldState }) => (
          <Field label="Nouvelle note" error={fieldState.error?.message}>
            <Input
              editable={!isSubmitting}
              multiline
              numberOfLines={3}
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              placeholder="Ajouter une note de lecture"
              value={field.value}
            />
          </Field>
        )}
      />

      {formState.errors.root ? (
        <Text className="text-sm text-destructive">
          {formState.errors.root.message}
        </Text>
      ) : null}

      <Button onPress={submit} disabled={isSubmitting}>
        <Text>{isSubmitting ? "Ajout en cours…" : "Ajouter la note"}</Text>
      </Button>
    </View>
  )
}
