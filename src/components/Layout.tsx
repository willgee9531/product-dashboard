import { Link } from "react-router-dom"

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/products" className="hover:opacity-80 transition-opacity flex flex-col leading-none">
            <span className="font-bold text-2xl tracking-tight text-slate-900">ZeeCo</span>
            <span className="text-[10px] tracking-[0.40em] text-slate-500 font-normal">DASHBOARD</span>
           </Link>
          <nav>
            <Link
              to="/products"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Products
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout