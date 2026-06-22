import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Star, Package, Tag, Truck, ShieldCheck } from "lucide-react"
import { useProduct } from "@/hooks/useProduct"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ProductImage from "@/components/ProductImage"

function getStockBadge(status: string) {
  if (status === "In Stock") {
    return <Badge variant="outline" className="text-green-600 border-green-600">In Stock</Badge>
  }
  if (status === "Low Stock") {
    return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Low Stock</Badge>
  }
  return <Badge variant="outline" className="text-red-600 border-red-600">Out of Stock</Badge>
}

function DetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-80 w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    </div>
  )
}

function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: product, isLoading, isError, error, refetch } = useProduct(id!)

  if (isLoading) {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 -ml-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <DetailsSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-lg font-medium text-destructive">
          Failed to load product
        </p>
        <p className="text-sm text-muted-foreground">
          {(error as Error).message}
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </Button>
          <Button onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!product) return null

  const formattedDate = new Date(product.meta.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  document.title = `${product.title} | ZeeCo`

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 -ml-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} className="mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-3">
          <div className="w-full h-80 rounded-lg border bg-muted overflow-hidden">
            <ProductImage
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.slice(1, 5).map((img, i) => (
              <ProductImage
                src={img}
                alt={`${product.title} view ${i + 2}`}
                className="w-full h-20 object-cover rounded-md border bg-muted"
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground capitalize mb-1">
              {product.category} · {product.brand}
            </p>
            <h1 className="text-2xl font-bold">{product.title}</h1>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">
              ${product.price.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                {product.discountPercentage.toFixed(1)}% off
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-muted-foreground text-sm">
              ({product.reviews.length} reviews)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {getStockBadge(product.availabilityStatus)}
            <span className="text-sm text-muted-foreground">
              {product.stock} units available
            </span>
          </div>

          <div className="text-sm text-muted-foreground">
            Listed on {formattedDate}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package size={14} />
              SKU
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm">{product.sku}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Tag size={14} />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Truck size={14} />
              Shipping
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{product.shippingInformation}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShieldCheck size={14} />
              Warranty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{product.warrantyInformation}</p>
          </CardContent>
        </Card>
      </div>

      {product.reviews.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Customer Reviews
          </h2>
          <div className="space-y-3">
            {product.reviews.map((review, i) => (
              <Card key={i}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">
                        {review.reviewerName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(review.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailsPage