export const noteKeys = {
  root: ["notes"] as const,

  lists: () => [...noteKeys.root, "list"] as const,

  list: (bookId: string) => [...noteKeys.lists(), bookId] as const,
}
