import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Skeleton } from "@/components/ui/skeleton"

const PLACEHOLDER_ROWS = [0, 1, 2, 3, 4, 5]

const BookListSkeletonRow = () => (
  <View className="flex-row items-center gap-3 border-b border-border px-4 py-3">
    <View className="flex-1 gap-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </View>
    <Skeleton className="h-6 w-14 rounded-full" />
    <Skeleton className="h-6 w-10 rounded-full" />
  </View>
)

export const BookListSkeleton = () => (
  <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
    <View className="gap-2 px-4 pb-3 pt-2">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-4 w-32" />
    </View>
    {PLACEHOLDER_ROWS.map((row) => (
      <BookListSkeletonRow key={row} />
    ))}
  </SafeAreaView>
)
