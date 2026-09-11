import { View } from "react-native"
import { Skeleton } from "@/components/ui/skeleton"

const DEFAULT_ROWS = 6

const rowKeys = (rows: number): number[] =>
  Array.from({ length: rows }, (value, index) => index)

export const BookListSkeletonRow = () => (
  <View className="flex-row items-center gap-3 border-b border-border px-4 py-3">
    <View className="flex-1 gap-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </View>
    <Skeleton className="h-6 w-14 rounded-full" />
    <Skeleton className="h-6 w-10 rounded-full" />
  </View>
)

type BookListSkeletonProps = {
  rows?: number
}

export const BookListSkeleton = ({
  rows = DEFAULT_ROWS,
}: BookListSkeletonProps) => (
  <View>
    {rowKeys(rows).map((row) => (
      <BookListSkeletonRow key={row} />
    ))}
  </View>
)
