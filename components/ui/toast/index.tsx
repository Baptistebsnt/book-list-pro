import { type ReactNode } from "react"
import { ToastProvider, useToast } from "./toast-context"
import type {
  ToastOptions,
  ToastPosition,
  ToastProps,
  ToastType,
} from "./types"
import { ToastViewport } from "./viewport"

type ToastRef = {
  show?: (content: ReactNode | string, options?: ToastOptions) => string
  update?: (
    id: string,
    content: ReactNode | string,
    options?: ToastOptions,
  ) => void
  dismiss?: (id: string) => void
  dismissAll?: () => void
}

const toastRef: ToastRef = {}

const NOT_INITIALIZED =
  "Toast provider not initialized. Wrap your app with ToastProviderWithViewport."

const ToastController = () => {
  const controller = useToast()

  toastRef.show = controller.show
  toastRef.update = controller.update
  toastRef.dismiss = controller.dismiss
  toastRef.dismissAll = controller.dismissAll

  return null
}

export const ToastProviderWithViewport = ({ children }: ToastProps) => (
  <ToastProvider>
    <ToastController />
    {children}
    <ToastViewport />
  </ToastProvider>
)

export const toast = {
  show: (content: ReactNode | string, options?: ToastOptions): string => {
    if (!toastRef.show) {
      console.warn(NOT_INITIALIZED)

      return ""
    }

    return toastRef.show(content, options)
  },
  update: (
    id: string,
    content: ReactNode | string,
    options?: ToastOptions,
  ): void => {
    toastRef.update?.(id, content, options)
  },
  dismiss: (id: string): void => {
    toastRef.dismiss?.(id)
  },
  dismissAll: (): void => {
    toastRef.dismissAll?.()
  },
}

export { ToastProvider, useToast }
export type { ToastOptions, ToastPosition, ToastType }
