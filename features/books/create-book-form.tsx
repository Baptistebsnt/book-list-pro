import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useRouter } from "expo-router"
import { type Control, Controller, useForm } from "react-hook-form"
import { Switch, TextInput, View } from "react-native"
import { type z } from "zod"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { type BookDraft, EMPTY_DRAFT, bookDraftSchema } from "@/domain/book"
import { ValidationError } from "@/services/api/errors"
import { useCreateBook } from "./mutations"

type BookDraftInput = z.input<typeof bookDraftSchema>

type BookDraftField = keyof BookDraft

type TextBookDraftField = Extract<
  BookDraftField,
  "titre" | "auteur" | "editeur" | "annee"
>

type BookFormControl = Control<BookDraftInput, undefined, BookDraft>

const FORM_DEFAULTS: BookDraftInput = {
  ...EMPTY_DRAFT,
  annee: String(EMPTY_DRAFT.annee),
}

const isBookDraftField = (field: string): field is BookDraftField =>
  Object.hasOwn(FORM_DEFAULTS, field)

const TEXT_FIELDS = [
  { label: "Titre", name: "titre" },
  { label: "Auteur", name: "auteur" },
  { label: "Editeur", name: "editeur" },
  { label: "Annee", name: "annee", numeric: true },
] as const satisfies readonly TextFieldConfig[]

const inputClassName =
  "border-input bg-background text-foreground h-11 rounded-md border px-3 text-base"

const errorClassName = "text-destructive mt-1 text-sm"

type TextFieldConfig = {
  label: string
  name: TextBookDraftField
  numeric?: boolean
}

type FormControlProps = {
  control: BookFormControl
  disabled: boolean
}

type TextFieldProps = TextFieldConfig & FormControlProps

const TextField = ({
  control,
  disabled,
  label,
  name,
  numeric = false,
}: TextFieldProps) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <View>
        <Text className="mb-2 font-medium">{label}</Text>
        <TextInput
          className={inputClassName}
          editable={!disabled}
          inputMode={numeric ? "numeric" : "text"}
          keyboardType={numeric ? "number-pad" : "default"}
          onBlur={field.onBlur}
          onChangeText={field.onChange}
          value={String(field.value)}
        />
        {fieldState.error ? (
          <Text className={errorClassName}>{fieldState.error.message}</Text>
        ) : null}
      </View>
    )}
  />
)

const ReadingStatusField = ({ control, disabled }: FormControlProps) => (
  <Controller
    control={control}
    name="lu"
    render={({ field, fieldState }) => (
      <View>
        <View className="flex-row items-center justify-between gap-4">
          <Text className="font-medium">Lu</Text>
          <Switch
            disabled={disabled}
            onValueChange={field.onChange}
            value={field.value}
          />
        </View>
        {fieldState.error ? (
          <Text className={errorClassName}>{fieldState.error.message}</Text>
        ) : null}
      </View>
    )}
  />
)

export const CreateBookForm = () => {
  const router = useRouter()
  const createBook = useCreateBook()
  const form = useForm<BookDraftInput, undefined, BookDraft>({
    defaultValues: FORM_DEFAULTS,
    resolver: zodResolver(bookDraftSchema),
  })

  const applyApiError = (error: Error): void => {
    if (error instanceof ValidationError) {
      for (const [field, message] of Object.entries(error.fields)) {
        if (isBookDraftField(field)) {
          form.setError(field, { type: "server", message })
        }
      }

      return
    }

    form.setError("root", { type: "server", message: error.message })
  }

  const submit = form.handleSubmit((draft) => {
    if (createBook.isPending) {
      return
    }

    createBook.mutate(draft, {
      onError: applyApiError,
      onSuccess: () => {
        router.replace("/")
      },
    })
  })

  const disabled = createBook.isPending || form.formState.isSubmitting
  const rootMessage = form.formState.errors.root?.message

  return (
    <View className="flex-1 justify-center p-6">
      <View className="w-full max-w-md gap-5 self-center">
        <Text variant="h3">Ajouter un ouvrage</Text>

        {TEXT_FIELDS.map((field) => (
          <TextField
            control={form.control}
            disabled={disabled}
            key={field.name}
            {...field}
          />
        ))}
        <ReadingStatusField control={form.control} disabled={disabled} />

        {rootMessage ? (
          <Text className={errorClassName}>{rootMessage}</Text>
        ) : null}

        <Button disabled={disabled} onPress={submit}>
          <Text>
            {createBook.isPending ? "Creation..." : "Creer l'ouvrage"}
          </Text>
        </Button>
        <Link href="/">Annuler et revenir à la liste</Link>
      </View>
    </View>
  )
}
