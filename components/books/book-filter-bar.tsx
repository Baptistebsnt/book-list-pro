import { ArrowDown, ArrowUp, Heart } from "lucide-react-native"
import { ScrollView, View } from "react-native"
import { Chip } from "@/components/ui/chip"
import { Text } from "@/components/ui/text"
import { type BookSort, type BookStatus } from "@/domain/book"
import { type BookControls } from "@/services/query/books"

type BookFilterBarProps = {
  controls: BookControls
  onChange: (changes: Partial<BookControls>) => void
}

const STATUS_OPTIONS: { label: string; value: BookStatus | null }[] = [
  { label: "Tous", value: null },
  { label: "Lus", value: "lu" },
  { label: "Non lus", value: "nonlu" },
]

const SORT_OPTIONS: { label: string; value: BookSort }[] = [
  { label: "Titre", value: "titre" },
  { label: "Auteur", value: "auteur" },
  { label: "Année", value: "annee" },
  { label: "Note", value: "note" },
]

const ORDER_LABEL = {
  asc: "croissant",
  desc: "décroissant",
} as const

export const BookFilterBar = ({ controls, onChange }: BookFilterBarProps) => {
  const sortLabel = (label: string, value: BookSort): string =>
    value === controls.sort
      ? `Trier par ${label.toLowerCase()}, ordre ${ORDER_LABEL[controls.order]}`
      : `Trier par ${label.toLowerCase()}`

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
            key={option.label}
            label={option.label}
            role="radio"
            isActive={controls.status === option.value}
            onPress={() => onChange({ status: option.value })}
          />
        ))}
        <Chip
          label="Coups de cœur"
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
        <Text variant="muted">Trier par</Text>
        {SORT_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            role="radio"
            icon={option.value === controls.sort ? orderIcon : null}
            isActive={option.value === controls.sort}
            accessibilityLabel={sortLabel(option.label, option.value)}
            onPress={() => pickSort(option.value)}
          />
        ))}
      </ScrollView>
    </View>
  )
}
