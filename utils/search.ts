import type { Product } from "@/types/product"

export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) {
    return []
  }

  const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean)

  if (searchTerms.length === 0) {
    return []
  }

  return products.filter((product) => {
    // Search in product name
    const nameMatch = searchTerms.some((term) => product.name.toLowerCase().includes(term))

    // Search in product category and subcategory
    const categoryMatch = searchTerms.some(
      (term) => product.category.toLowerCase().includes(term) || product.subcategory.toLowerCase().includes(term),
    )

    // Search in product colors
    const colorMatch = searchTerms.some((term) =>
      product.colors.some((color) => color.name.toLowerCase().includes(term)),
    )

    return nameMatch || categoryMatch || colorMatch
  })
}
