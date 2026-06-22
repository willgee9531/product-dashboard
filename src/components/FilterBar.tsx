import { useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FilterBarProps {
  search: string
  category: string
  sort: "newest" | "oldest"
  categories: string[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onSortChange: (value: "newest" | "oldest") => void
}

function FilterBar({
  search,
  category,
  sort,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: FilterBarProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sortDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      onSearchChange(value)
    }, 400)
  }

  function handleSortChange(value: string) {
    if (sortDebounceRef.current) {
      clearTimeout(sortDebounceRef.current)
    }
    sortDebounceRef.current = setTimeout(() => {
      onSortChange(value as "newest" | "oldest")
    }, 150)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={16}
        />
        <Input
          type="search"
          placeholder="Search products..."
          defaultValue={search}
          onChange={handleSearchChange}
          className="pl-9 pr-9"
          aria-label="Search products"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <Select value={category || "all"} onValueChange={(val) => onCategoryChange(val === "all" ? "" : val)}>
        <SelectTrigger className="w-full sm:w-48" aria-label="Filter by category">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-full sm:w-40" aria-label="Sort products">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default FilterBar