import { zodResolver } from "@hookform/resolvers/zod"
import { type UseFormSetError, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { View } from "react-native"
import {
  BookSwitchField,
  BookTextField,
  BookYearField,
} from "@/components/books/book-form-fields"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { type BookDraft, bookDraftSchema } from "@/domain/book"
import { ValidationError } from "@/services/api/errors"

type BookFormProps = {
  defaultValues: BookDraft
  submitLabel: string
  onSubmit: (values: BookDraft) => Promise<void>
  onCancel: () => void
}

const applyFieldErrors = (
  error: ValidationError,
  setError: UseFormSetError<BookDraft>,
) => {
  for (const [field, message] of Object.entries(error.fields)) {
    setError(field as keyof BookDraft, { message })
  }
}

export const BookForm = ({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: BookFormProps) => {
  const { t } = useTranslation()
  const { control, handleSubmit, setError, formState } = useForm<BookDraft>({
    resolver: zodResolver(bookDraftSchema),
    defaultValues,
  })
  const { errors, isSubmitting } = formState

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values)
    } catch (error) {
      if (error instanceof ValidationError) {
        applyFieldErrors(error, setError)

        return
      }

      setError("root", {
        message:
          error instanceof Error ? error.message : t("common.genericError"),
      })
    }
  })

  return (
    <View className="gap-4">
      <BookTextField
        control={control}
        name="titre"
        label={t("books.field.title")}
        placeholder={t("books.form.titlePlaceholder")}
      />
      <BookTextField
        control={control}
        name="auteur"
        label={t("books.field.author")}
        placeholder={t("books.form.authorPlaceholder")}
      />
      <BookTextField
        control={control}
        name="editeur"
        label={t("books.field.publisher")}
        placeholder={t("books.form.publisherPlaceholder")}
      />
      <BookYearField
        control={control}
        label={t("books.field.year")}
        placeholder={t("books.form.yearPlaceholder")}
      />
      <BookSwitchField
        control={control}
        name="lu"
        label={t("books.status.read")}
      />

      {errors.root ? (
        <Text className="text-sm text-destructive">{errors.root.message}</Text>
      ) : null}

      <View className="gap-3">
        <Button onPress={submit} disabled={isSubmitting}>
          <Text>{isSubmitting ? t("books.form.submitting") : submitLabel}</Text>
        </Button>
        <Button variant="outline" onPress={onCancel} disabled={isSubmitting}>
          <Text>{t("common.cancel")}</Text>
        </Button>
      </View>
    </View>
  )
}
