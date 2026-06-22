import { useState } from "react"

interface ProductImageProps {
  src: string
  alt: string
  className?: string
}

function ProductImage({ src, alt, className }: ProductImageProps) {
  const [errored, setErrored] = useState(false)

  if (errored) {
    return (
      <div
        className={`flex items-center justify-center bg-muted text-muted-foreground ${className}`}
        aria-label={alt}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  )
}

export default ProductImage