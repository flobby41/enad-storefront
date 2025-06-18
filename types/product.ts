export interface Product {
  id: number
  name: string
  price: number
  currency: string
  colors: ProductColor[]
  sizes: ProductSize[]
  images: ProductImage[]
  isNew?: boolean
  isSale?: boolean
  salePrice?: number
  category: string
  subcategory: string
  productType?: string // Added for size guide matching
}

export interface ProductColor {
  name: string
  value: string
  images: ProductImage[]
}

export interface ProductImage {
  url: string
  alt: string
  colorId?: string
}

export interface ProductSize {
  name: string
  available: boolean
}

export interface FilterOptions {
  sizes: string[]
  colors: string[]
  priceRange: [number, number]
  sort: string
}
