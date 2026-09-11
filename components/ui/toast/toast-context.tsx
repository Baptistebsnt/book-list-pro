import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import type { Toast, ToastContextValue, ToastOptions } from "./types"

const noop = () => {
  // Default no-op close handler
}

const DEFAULT_TOAST_OPTIONS: Required<ToastOptions> = {
  duration: 3000,
  type: "default",
  position: "bottom",
  onClose: noop,
  action: null,
}

const ID_RADIX = 36

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return context
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = useCallback(
    (content: ReactNode | string, options?: ToastOptions): string => {
      const id = Math.random().toString(ID_RADIX).substring(2, 9)
      const toast: Toast = {
        id,
        content,
        options: { ...DEFAULT_TOAST_OPTIONS, ...options },
      }

      setToasts((previous) => [...previous, toast])

      return id
    },
    [],
  )

  const update = useCallback(
    (id: string, content: ReactNode | string, options?: ToastOptions) => {
      setToasts((previous) =>
        previous.map((toast) =>
          toast.id === id
            ? {
                ...toast,
                content,
                options: { ...toast.options, ...options },
              }
            : toast,
        ),
      )
    },
    [],
  )

  const dismiss = useCallback((id: string) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id))
  }, [])

  const dismissAll = useCallback(() => setToasts([]), [])

  useEffect(() => {
    const timeouts = toasts
      .filter((toast) => toast.options.duration > 0)
      .map((toast) =>
        setTimeout(() => {
          dismiss(toast.id)
          toast.options.onClose()
        }, toast.options.duration),
      )

    return () => timeouts.forEach(clearTimeout)
  }, [toasts, dismiss])

  const value: ToastContextValue = {
    toasts,
    show,
    update,
    dismiss,
    dismissAll,
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}
