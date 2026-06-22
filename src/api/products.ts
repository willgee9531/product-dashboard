import type { Product, ProductsResponse } from "@/types/product"

const BASE_URL = "https://dummyjson.com"

export interface FetchProductsParams {
  page: number
  pageSize: number
  search?: string
  category?: string
}

export async function fetchProducts({
  page,
  pageSize,
  search,
  category,
}: FetchProductsParams): Promise<ProductsResponse> {
  const skip = (page - 1) * pageSize

  let url: string

  if (search) {
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(search)}&limit=${pageSize}&skip=${skip}`
  } else if (category) {
    url = `${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${pageSize}&skip=${skip}`
  } else {
    url = `${BASE_URL}/products?limit=${pageSize}&skip=${skip}`
  }

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`)
  }

  return res.json()
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`)

  if (!res.ok) {
    throw new Error(`Failed to fetch product ${id}: ${res.status}`)
  }

  return res.json()
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/products/categories`)

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status}`)
  }

  const data = await res.json()
  // DummyJSON returns category objects: { slug, name, url }
  return data.map((c: { slug: string }) => c.slug)
}