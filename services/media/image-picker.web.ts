import {
  ACCEPTED_COVER_TYPES,
  COVER_QUALITY,
  type CoverImage,
  type CoverPick,
  MAX_COVER_EDGE,
  fitWithin,
} from "./cover-image"

export const canPickCoverImage = (): boolean => typeof document !== "undefined"

const chooseFile = (): Promise<File | null> =>
  new Promise((resolve) => {
    const input = document.createElement("input")

    input.type = "file"
    input.accept = ACCEPTED_COVER_TYPES.join(",")
    input.style.display = "none"
    input.addEventListener("change", () => {
      resolve(input.files?.[0] ?? null)
      input.remove()
    })
    input.addEventListener("cancel", () => {
      resolve(null)
      input.remove()
    })

    document.body.append(input)
    input.click()
  })

const readAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener("load", () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("Fichier illisible.")),
    )
    reader.addEventListener("error", () =>
      reject(new Error("Fichier illisible.")),
    )
    reader.readAsDataURL(file)
  })

const loadImage = (dataUrl: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()

    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", () => reject(new Error("Image illisible.")))
    image.src = dataUrl
  })

const resize = async (
  dataUrl: string,
  mimeType: string,
): Promise<CoverImage> => {
  const image = await loadImage(dataUrl)
  const source = { width: image.naturalWidth, height: image.naturalHeight }
  const target = fitWithin(source, MAX_COVER_EDGE)
  const canvas = document.createElement("canvas")

  canvas.width = target.width
  canvas.height = target.height

  const context = canvas.getContext("2d")

  if (context === null) {
    return { dataUrl, mimeType, ...source }
  }

  context.drawImage(image, 0, 0, target.width, target.height)

  return {
    dataUrl: canvas.toDataURL(mimeType, COVER_QUALITY),
    mimeType,
    ...target,
  }
}

export const pickCoverImage = async (): Promise<CoverPick> => {
  const file = await chooseFile()

  if (file === null) {
    return { status: "cancelled" }
  }

  const dataUrl = await readAsDataUrl(file)

  return { status: "picked", image: await resize(dataUrl, file.type) }
}
