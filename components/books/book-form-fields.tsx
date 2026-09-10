import { type Control, Controller } from "react-hook-form"
import { View } from "react-native"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Text } from "@/components/ui/text"
import { type BookDraft } from "@/domain/book"

type BaseProps = {
  control: Control<BookDraft>
  label: string
  placeholder?: string
}

type TextFieldProps = BaseProps & {
  name: "titre" | "auteur" | "editeur"
}

export const BookTextField = ({
  control,
  name,
  label,
  placeholder,
}: TextFieldProps) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <Field label={label} error={fieldState.error?.message}>
        <Input
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          placeholder={placeholder}
          hasError={Boolean(fieldState.error)}
        />
      </Field>
    )}
  />
)

export const BookYearField = ({ control, label, placeholder }: BaseProps) => (
  <Controller
    control={control}
    name="annee"
    render={({ field, fieldState }) => (
      <Field label={label} error={fieldState.error?.message}>
        <Input
          value={Number.isNaN(field.value) ? "" : String(field.value)}
          onChangeText={(text) =>
            field.onChange(text === "" ? NaN : Number(text))
          }
          onBlur={field.onBlur}
          keyboardType="number-pad"
          placeholder={placeholder}
          hasError={Boolean(fieldState.error)}
        />
      </Field>
    )}
  />
)

type SwitchFieldProps = {
  control: Control<BookDraft>
  name: "lu"
  label: string
}

export const BookSwitchField = ({ control, name, label }: SwitchFieldProps) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <View className="flex-row items-center justify-between">
        <Text variant="small">{label}</Text>
        <Switch checked={field.value} onCheckedChange={field.onChange} />
      </View>
    )}
  />
)
