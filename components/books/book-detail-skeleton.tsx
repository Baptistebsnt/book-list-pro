import { View } from "react-native"
import { Skeleton } from "@/components/ui/skeleton"

const SkeletonRow = () => (
  <View className="gap-2 border-b border-border py-3">
    <Skeleton className="h-3 w-24" />
    <Skeleton className="h-4 w-48" />
  </View>
)

export const BookDetailSkeleton = () => (
  <View className="gap-4 rounded-lg border border-border bg-card p-4">
    <Skeleton className="h-7 w-3/4" />
    <Skeleton className="h-6 w-28 rounded-full" />
    <View>
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </View>
  </View>
)
