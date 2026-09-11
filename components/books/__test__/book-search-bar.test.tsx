import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Text } from "react-native"
import { describe, expect, it } from "vitest"
import { BookSearchBar } from "@/components/books/book-search-bar"
import {
  BookSearchProvider,
  SEARCH_DEBOUNCE_MS,
  useSearchedTerm,
} from "@/services/query/books"
import { createQueryWrapper } from "@/test/query"

const LABEL = "Rechercher un ouvrage par titre ou auteur"

const SearchedTerm = () => {
  const { searchedTerm } = useSearchedTerm()

  return <Text>{`recherché : ${searchedTerm}`}</Text>
}

const renderSearchBar = () => {
  const { Wrapper } = createQueryWrapper()

  render(
    <Wrapper>
      <BookSearchProvider>
        <BookSearchBar />
        <SearchedTerm />
      </BookSearchProvider>
    </Wrapper>,
  )

  return screen.getByLabelText(LABEL)
}

describe("BookSearchBar", () => {
  it("exposes the search field to assistive technology", async () => {
    const field = renderSearchBar()

    await userEvent.type(field, "dune")

    expect(field).toHaveValue("dune")
  })

  it("keeps every keystroke local until the debounce elapses", async () => {
    const field = renderSearchBar()

    await userEvent.type(field, "dune")

    expect(screen.getByText("recherché :")).toBeInTheDocument()

    await waitFor(
      () => expect(screen.getByText("recherché : dune")).toBeInTheDocument(),
      { timeout: SEARCH_DEBOUNCE_MS * 4 },
    )
  })

  it("clears the term when the clear button is pressed", async () => {
    const field = renderSearchBar()

    await userEvent.type(field, "dune")
    await userEvent.click(
      screen.getByRole("button", { name: "Effacer la recherche" }),
    )

    expect(field).toHaveValue("")
  })
})
