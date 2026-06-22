import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "@/components/Layout"
import ProductsListPage from "@/pages/ProductsListPage"
import ProductDetailsPage from "@/pages/ProductDetailsPage"

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsListPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}


function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <p className="text-6xl font-bold text-muted-foreground">404</p>
      <p className="text-xl font-semibold">Page not found</p>
      <p className="text-sm text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
      <a
        href="/products"
        className="text-sm underline hover:no-underline text-foreground"
      >
        Back to Products
      </a>
    </div>
  )
}

export default App