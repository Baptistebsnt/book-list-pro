import { forwardRef } from "react"
import { TextInput, type TextInputProps } from "react-native"
import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"

type InputProps = TextInputProps & {
  hasError?: boolean
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ hasError, className, ...props }, ref) => {
    const theme = useTheme()

    return (
      <TextInput
        ref={ref}
        placeholderTextColor={theme.mutedForeground}
        className={cn(
          "rounded-md border border-border bg-background px-3 py-2 text-base text-foreground",
          hasError && "border-destructive",
          className,
        )}
        {...props}
      />
    )
  },
)

Input.displayName = "Input"
