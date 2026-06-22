import { useQuery } from "@tanstack/react-query"
import { fetchProductById } from "@/api/products"


export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  })
}