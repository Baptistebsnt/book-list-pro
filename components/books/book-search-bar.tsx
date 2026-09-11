import { Search, X } from "lucide-react-native"
import { memo } from "react"
import { Platform, Pressable, View } from "react-native"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"
import { useSearchInput } from "@/services/query/books"

const ICON_SIZE = 18

const PLACEHOLDER = "Titre ou auteur"

export const BookSearchBar = memo(() => {
  const theme = useTheme()
  const { term, setTerm } = useSearchInput()

  return (
    <View className="flex-row items-center gap-2 px-4 pb-3">
      <View className="flex-1 flex-row items-center">
        <View className="absolute left-3 z-10">
          <Search size={ICON_SIZE} color={theme.mutedForeground} />
        </View>
        <Input
          value={term}
          onChangeText={setTerm}
          placeholder={PLACEHOLDER}
          role="searchbox"
          aria-label="Rechercher un ouvrage par titre ou auteur"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          className="h-11 flex-1 pl-9 pr-3"
        />
      </View>
      <View className="h-11 w-11 items-center justify-center">
        {term.length > 0 && (
          <Pressable
            onPress={() => setTerm("")}
            role="button"
            aria-label="Effacer la recherche"
            className={cn(
              "h-11 w-11 items-center justify-center rounded-full active:bg-muted",
              Platform.select({ web: "hover:bg-muted" }),
            )}
          >
            <X size={ICON_SIZE} color={theme.mutedForeground} />
          </Pressable>
        )}
      </View>
    </View>
  )
})

BookSearchBar.displayName = "BookSearchBar"
