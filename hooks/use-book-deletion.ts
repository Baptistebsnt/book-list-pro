import { useRouter } from "expo-router"
import { useState } from "react"
import { useDeleteBook } from "@/services/query/books"

export const useBookDeletion = (id: string) => {
  const [isConfirming, setConfirming] = useState(false)
  const router = useRouter()
  const deletion = useDeleteBook()

  const confirm = () => {
    deletion.mutate(id, {
      onSuccess: () => {
        setConfirming(false)
        router.replace("/")
      },
    })
  }

  return {
    isConfirming,
    setConfirming,
    isDeleting: deletion.isPending,
    hasFailed: deletion.isError,
    confirm,
  }
}
