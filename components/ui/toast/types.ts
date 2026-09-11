import { type ReactNode } from "react"

export type ToastType = "default" | "success" | "error" | "warning" | "info"

export type ToastPosition = "top" | "bottom"

export type ToastProps = {
  children: ReactNode
}

export type ToastAction = {
  label: string
  onPress: () => void
}

export type ToastOptions = {
  duration?: number
  type?: ToastType
  position?: ToastPosition
  onClose?: () => void
  action?: ToastAction | null
}

export type Toast = {
  id: string
  content: ReactNode | string
  options: Required<ToastOptions>
}

export type ToastContextValue = {
  toasts: Toast[]
  show: (content: ReactNode | string, options?: ToastOptions) => string
  update: (
    id: string,
    content: ReactNode | string,
    options?: ToastOptions,
  ) => void
  dismiss: (id: string) => void
  dismissAll: () => void
}
