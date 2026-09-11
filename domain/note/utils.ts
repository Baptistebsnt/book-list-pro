import { type Note } from "./schema"

export const sortNotesByNewest = (notes: readonly Note[]): Note[] =>
  [...notes].sort(
    (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt),
  )
