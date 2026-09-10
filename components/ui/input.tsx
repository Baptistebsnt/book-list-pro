import { forwardRef } from "react"
import { TextInput, type TextInputProps } from "react-native"
import { cn } from "@/lib/utils"

type InputProps = TextInputProps & {
  hasError?: boolean
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ hasError, className, ...props }, ref) => (
    <TextInput
      ref={ref}
      placeholderTextColor="#9ca3af"
      className={cn(
        "rounded-md border border-border bg-background px-3 py-2 text-base text-foreground",
        hasError && "border-destructive",
        className,
      )}
      {...props}
    />
  ),
)

Input.displayName = "Input"
