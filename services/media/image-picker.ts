import { type CoverPick } from "./cover-image"

export const canPickCoverImage = (): boolean => false

export const pickCoverImage = (): Promise<CoverPick> =>
  Promise.resolve({ status: "unsupported" })
