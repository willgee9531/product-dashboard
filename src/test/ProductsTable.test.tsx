import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import ProductsTable from "@/components/ProductsTable"
import type { Product } from "@/types/product"

const mockProduct: Product = {
  id: 1,
  title: "Test Product",
  description: "A test product description",
  category: "electronics",
  price: 99.99,
  discountPercentage: 10,
  rating: 4.5,
  stock: 50,
  tags: ["test"],
  brand: "TestBrand",
  sku: "TEST-001",
  weight: 1,
  dimensions: { width: 10, height: 10, depth: 10 },
  warrantyInformation: "1 year warranty",
  shippingInformation: "Ships in 2 days",
  availabilityStatus: "In Stock",
  reviews: [],
  returnPolicy: "30 days return",
  minimumOrderQuantity: 1,
  meta: {
    createdAt: "2025-04-30T09:41:02.053Z",
    updatedAt: "2025-04-30T09:41:02.053Z",
    barcode: "123456789",
    qrCode: "https://example.com/qr.png",
  },
  images: ["https://example.com/image.jpg"],
  thumbnail: "https://example.com/thumb.jpg",
}

function renderTable(
  products: Product[],
  isLoading = false,
  isPlaceholderData = false
) {
  return render(
    <BrowserRouter>
      <ProductsTable
        products={products}
        isLoading={isLoading}
        isPlaceholderData={isPlaceholderData}
      />
    </BrowserRouter>
  )
}

describe("ProductsTable", () => {
  it("renders a list of products correctly", () => {
    renderTable([mockProduct])

    expect(screen.getByText("Test Product")).toBeInTheDocument()
    expect(screen.getByText("TestBrand")).toBeInTheDocument()
    expect(screen.getByText("$99.99")).toBeInTheDocument()
    expect(screen.getByText("electronics")).toBeInTheDocument()
  })

  it("shows empty state when no products are passed", () => {
    renderTable([])

    expect(screen.getByText("No products found")).toBeInTheDocument()
    expect(
      screen.getByText("Try adjusting your search or filters")
    ).toBeInTheDocument()
  })

  it("shows skeleton rows when loading", () => {
    renderTable([], true)

    expect(screen.queryByText("No products found")).not.toBeInTheDocument()
  })

  it("renders correct stock badge for In Stock status", () => {
    renderTable([mockProduct])

    expect(screen.getByText("In Stock")).toBeInTheDocument()
  })

  it("renders multiple products", () => {
    const secondProduct = { ...mockProduct, id: 2, title: "Second Product" }
    renderTable([mockProduct, secondProduct])

    expect(screen.getByText("Test Product")).toBeInTheDocument()
    expect(screen.getByText("Second Product")).toBeInTheDocument()
  })
})