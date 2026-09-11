import { useTranslation } from "react-i18next"
import { Platform, Pressable } from "react-native"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"
import { useAppLanguage } from "@/providers/language"

export const LanguageToggle = () => {
  const { t } = useTranslation()
  const { language, toggle } = useAppLanguage()
  const isFrench = language === "fr"

  return (
    <Pressable
      onPress={toggle}
      role="switch"
      aria-checked={isFrench}
      aria-label={
        isFrench ? t("language.switchToEnglish") : t("language.switchToFrench")
      }
      className={cn(
        "h-11 w-11 items-center justify-center rounded-full active:bg-muted",
        Platform.select({ web: "hover:bg-muted" }),
      )}
    >
      <Text variant="small" className="font-semibold">
        {t("language.code")}
      </Text>
    </Pressable>
  )
}
