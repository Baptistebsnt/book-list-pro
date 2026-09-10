import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"
import { useDeleteBook } from "@/services/query/books"

export const UNDO_DELAY_SECONDS = 5

const MS_PER_SECOND = 1000

export const UNDO_DELAY_MS = UNDO_DELAY_SECONDS * MS_PER_SECOND

export type PendingDeletion = {
  id: string
  titre: string
}

type DeferredDeletionValue = {
  pending: PendingDeletion | null
  failed: PendingDeletion | null
  requestDeletion: (book: PendingDeletion) => void
  cancelDeletion: () => void
  dismissFailure: () => void
  excludeDeleted: <T extends { id: string }>(items: T[]) => T[]
}

const DeferredDeletionContext = createContext<DeferredDeletionValue | null>(
  null,
)

type DeferredDeletionProviderProps = {
  children: ReactNode
}

export const DeferredDeletionProvider = ({
  children,
}: DeferredDeletionProviderProps) => {
  const { mutate } = useDeleteBook()
  const [pending, setPending] = useState<PendingDeletion | null>(null)
  const [failed, setFailed] = useState<PendingDeletion | null>(null)
  const [deleted, setDeleted] = useState<string[]>([])
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingRef = useRef<PendingDeletion | null>(null)

  const setPendingDeletion = useCallback((next: PendingDeletion | null) => {
    pendingRef.current = next
    setPending(next)
  }, [])

  const stopTimer = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  const restore = useCallback((id: string) => {
    setDeleted((current) => current.filter((deletedId) => deletedId !== id))
  }, [])

  const commit = useCallback(
    (book: PendingDeletion) => {
      stopTimer()
      setPendingDeletion(null)
      mutate(book.id, {
        onSuccess: () => restore(book.id),
        onError: () => {
          restore(book.id)
          setFailed(book)
        },
      })
    },
    [mutate, restore, setPendingDeletion, stopTimer],
  )

  const requestDeletion = useCallback(
    (book: PendingDeletion) => {
      const previous = pendingRef.current

      if (previous !== null) {
        commit(previous)
      }

      setFailed(null)
      setDeleted((current) => [...current, book.id])
      setPendingDeletion(book)
      timer.current = setTimeout(() => commit(book), UNDO_DELAY_MS)
    },
    [commit, setPendingDeletion],
  )

  const cancelDeletion = useCallback(() => {
    const { current } = pendingRef

    if (current === null) {
      return
    }

    stopTimer()
    setPendingDeletion(null)
    restore(current.id)
  }, [restore, setPendingDeletion, stopTimer])

  const dismissFailure = useCallback(() => setFailed(null), [])

  const excludeDeleted = useCallback(
    <T extends { id: string }>(items: T[]) =>
      items.filter((item) => !deleted.includes(item.id)),
    [deleted],
  )

  const value = useMemo(
    () => ({
      pending,
      failed,
      requestDeletion,
      cancelDeletion,
      dismissFailure,
      excludeDeleted,
    }),
    [
      cancelDeletion,
      dismissFailure,
      excludeDeleted,
      failed,
      pending,
      requestDeletion,
    ],
  )

  return (
    <DeferredDeletionContext.Provider value={value}>
      {children}
    </DeferredDeletionContext.Provider>
  )
}

export const useDeferredDeletion = (): DeferredDeletionValue => {
  const value = useContext(DeferredDeletionContext)

  if (value === null) {
    throw new Error(
      "useDeferredDeletion must be used inside a DeferredDeletionProvider",
    )
  }

  return value
}
