import { ArrowDown, ArrowUp, Heart } from "lucide-react-native"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, View } from "react-native"
import { Chip } from "@/components/ui/chip"
import { Text } from "@/components/ui/text"
import { type BookSort, type BookStatus } from "@/domain/book"
import { type BookControls } from "@/services/query/books"

type BookFilterBarProps = {
  controls: BookControls
  onChange: (changes: Partial<BookControls>) => void
}

const STATUS_OPTIONS: { key: string; value: BookStatus | null }[] = [
  { key: "all", value: null },
  { key: "read", value: "lu" },
  { key: "unread", value: "nonlu" },
]

const SORT_OPTIONS: { key: string; value: BookSort }[] = [
  { key: "title", value: "titre" },
  { key: "author", value: "auteur" },
  { key: "year", value: "annee" },
  { key: "rating", value: "note" },
]

export const BookFilterBar = memo(
  ({ controls, onChange }: BookFilterBarProps) => {
    const { t } = useTranslation()

    const sortLabel = (label: string, value: BookSort): string =>
      value === controls.sort
        ? t("books.sort.byWithOrder", {
            label: label.toLowerCase(),
            order: t(`books.order.${controls.order}`),
          })
        : t("books.sort.by", { label: label.toLowerCase() })

    const orderIcon = controls.order === "asc" ? ArrowUp : ArrowDown

    const pickSort = (value: BookSort) =>
      value === controls.sort
        ? onChange({ order: controls.order === "asc" ? "desc" : "asc" })
        : onChange({ sort: value })

    return (
      <View className="gap-2 pb-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="gap-2 px-4"
        >
          {STATUS_OPTIONS.map((option) => (
            <Chip
              key={option.key}
              label={t(`books.filter.${option.key}`)}
              role="radio"
              isActive={controls.status === option.value}
              onPress={() => onChange({ status: option.value })}
            />
          ))}
          <Chip
            label={t("books.filter.favorites")}
            role="switch"
            icon={Heart}
            isActive={controls.favori === true}
            onPress={() =>
              onChange({ favori: controls.favori === true ? null : true })
            }
          />
        </ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="items-center gap-2 px-4"
        >
          <Text variant="muted">{t("books.sort.label")}</Text>
          {SORT_OPTIONS.map((option) => {
            const label = t(`books.sort.${option.key}`)

            return (
              <Chip
                key={option.value}
                label={label}
                role="radio"
                icon={option.value === controls.sort ? orderIcon : null}
                isActive={option.value === controls.sort}
                accessibilityLabel={sortLabel(label, option.value)}
                onPress={() => pickSort(option.value)}
              />
            )
          })}
        </ScrollView>
      </View>
    )
  },
)

BookFilterBar.displayName = "BookFilterBar"
