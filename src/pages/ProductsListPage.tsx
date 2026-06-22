import Pagination from "@/components/Pagination"
import { useSearchParams } from "react-router-dom"
import { useProducts } from "@/hooks/useProducts"
import { useCategories } from "@/hooks/useCategories"
import FilterBar from "@/components/FilterBar"
import ProductsTable from "@/components/ProductsTable"

const PAGE_SIZE = 10

document.title = "Products | ZeeCo"

function ProductsListPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get("page") ?? "1")
  const search = searchParams.get("search") ?? ""
  const category = searchParams.get("category") ?? ""
  const sort = (searchParams.get("sort") ?? "newest") as "newest" | "oldest"

  const { data, isLoading, isError, error, isPlaceholderData } = useProducts({
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    category: category || undefined,
  })

  const { data: categories } = useCategories()

  const sortedProducts = [...(data?.products ?? [])].sort((a, b) => {
    const dateA = new Date(a.meta.createdAt).getTime()
    const dateB = new Date(b.meta.createdAt).getTime()
    return sort === "newest" ? dateB - dateA : dateA - dateB
  })

  const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE)

  function updateParam(key: string, value: string) {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (value) {
        next.set(key, value)
        } else {
        next.delete(key)
        }
        if (key !== "page") {
        next.set("page", "1")
        }
        return next
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        {data?.total !== undefined && (
          <span className="text-sm text-muted-foreground">
            {data.total} products found
          </span>
        )}
      </div>

      <FilterBar
        search={search}
        category={category}
        sort={sort}
        categories={categories ?? []}
        onSearchChange={(val) => updateParam("search", val)}
        onCategoryChange={(val) => updateParam("category", val)}
        onSortChange={(val) => updateParam("sort", val)}
      />

      {isError && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 mb-6 flex items-center justify-between">
          <p className="text-sm text-destructive">
            {(error as Error).message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-destructive underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      <ProductsTable
        products={sortedProducts}
        isLoading={isLoading}
        isPlaceholderData={isPlaceholderData}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        isPlaceholderData={isPlaceholderData}
        onPageChange={(newPage) => updateParam("page", String(newPage))}
       />
    </div>
  )
}

export default ProductsListPage