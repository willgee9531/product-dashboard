import { useNavigate } from "react-router-dom"
import type { Product } from "@/types/product"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import ProductImage from "@/components/ProductImage"

interface ProductsTableProps {
  products: Product[]
  isLoading: boolean
  isPlaceholderData: boolean
}

function getStockBadge(status: string) {
  if (status === "In Stock") {
    return <Badge variant="outline" className="text-green-600 border-green-600">In Stock</Badge>
  }
  if (status === "Low Stock") {
    return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Low Stock</Badge>
  }
  return <Badge variant="outline" className="text-red-600 border-red-600">Out of Stock</Badge>
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-8" /></TableCell>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-4 w-40" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

function ProductsTable({ products, isLoading, isPlaceholderData }: ProductsTableProps) {
  const navigate = useNavigate()

  return (
    <div className={`rounded-md border transition-opacity duration-200 ${isPlaceholderData ? "opacity-60" : "opacity-100"}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Stock Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton />
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-16 text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-2">
                  <p className="text-lg font-medium">No products found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                tabIndex={0}
                role="button"
                aria-label={`View details for ${product.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/product/${product.id}`)
                  }
                }}
              >
                <TableCell className="font-mono text-sm text-muted-foreground">
                  #{product.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md overflow-hidden bg-muted shrink-0">
                        <ProductImage
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-full w-full object-cover"
                        />
                    </div>
                    <span className="font-medium line-clamp-1 max-w-48">
                        {product.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>⭐ {product.rating.toFixed(1)}</TableCell>
                <TableCell className="text-muted-foreground">{product.brand}</TableCell>
                <TableCell>{getStockBadge(product.availabilityStatus)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default ProductsTable