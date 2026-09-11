type Href = { pathname: string; params?: Record<string, string> }

export const navigations: Href[] = []

const record = (href: Href) => {
  navigations.push(href)
}

export const router = {
  push: record,
  replace: record,
  back: record,
}
