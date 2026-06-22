import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import FilterBar from "@/components/FilterBar"

function renderFilterBar(overrides = {}) {
  const props = {
    search: "",
    category: "",
    sort: "newest" as const,
    categories: ["electronics", "beauty", "furniture"],
    onSearchChange: vi.fn(),
    onCategoryChange: vi.fn(),
    onSortChange: vi.fn(),
    ...overrides,
  }

  return {
    ...render(<FilterBar {...props} />),
    props,
  }
}

describe("FilterBar", () => {
  it("renders search input, category select and sort select", () => {
    renderFilterBar()

    expect(
      screen.getByPlaceholderText("Search products...")
    ).toBeInTheDocument()
    expect(
      screen.getByRole("combobox", { name: /filter by category/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("combobox", { name: /sort products/i })
    ).toBeInTheDocument()
  })

  it("calls onSearchChange after user types in search input", async () => {
    const user = userEvent.setup()
    const { props } = renderFilterBar()

    const searchInput = screen.getByPlaceholderText("Search products...")
    await user.type(searchInput, "phone")

    await new Promise((r) => setTimeout(r, 500))

    expect(props.onSearchChange).toHaveBeenCalledWith("phone")
  })

  it("shows clear button when search prop has a value", () => {
    renderFilterBar({ search: "phone" })

    expect(screen.getByLabelText("Clear search")).toBeInTheDocument()
  })

  it("does not show clear button when search is empty", () => {
    renderFilterBar({ search: "" })

    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument()
  })
})