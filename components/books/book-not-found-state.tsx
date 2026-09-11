import { useRouter } from "expo-router"
import { BookX } from "lucide-react-native"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Text } from "@/components/ui/text"

export const BookNotFoundState = () => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <EmptyState
      icon={BookX}
      title={t("books.notFound.title")}
      description={t("books.notFound.description")}
    >
      <Button variant="outline" onPress={() => router.replace("/")}>
        <Text>{t("books.notFound.back")}</Text>
      </Button>
    </EmptyState>
  )
}
