"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Filter, ChevronDown, X } from "lucide-react"
import { products, getPriceRange } from "@/data/products"
import type { FilterOptions, Product } from "@/types/product"
import ProductCard from "@/components/product-card"
import FilterSheet from "@/components/filter-sheet"

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.slug as string

  // Initialize filters
  const [priceRange] = getPriceRange()
  const initialFilters: FilterOptions = {
    sizes: [],
    colors: [],
    priceRange: [0, priceRange],
    sort: "recommended",
  }

  const [filters, setFilters] = useState<FilterOptions>(initialFilters)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortMenuOpen, setSortMenuOpen] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  // Get category name for display
  const getCategoryName = () => {
    switch (categorySlug) {
      case "kille":
        return "Kille"
      case "tjej":
        return "Tjej"
      case "barn":
        return "Barn"
      default:
        return categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
    }
  }

  // Filter and sort products
  useEffect(() => {
    let result = [...products]

    // Filter by category
    result = result.filter((product) => product.category === categorySlug)

    // Filter by size
    if (filters.sizes.length > 0) {
      result = result.filter((product) =>
        product.sizes.some((size) => filters.sizes.includes(size.name) && size.available),
      )
    }

    // Filter by color
    if (filters.colors.length > 0) {
      result = result.filter((product) => product.colors.some((color) => filters.colors.includes(color.name)))
    }

    // Filter by price
    result = result.filter((product) => {
      const price = product.salePrice || product.price
      return price >= filters.priceRange[0] && price <= filters.priceRange[1]
    })

    // Sort products
    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => {
          const priceA = a.salePrice || a.price
          const priceB = b.salePrice || b.price
          return priceA - priceB
        })
        break
      case "price-desc":
        result.sort((a, b) => {
          const priceA = a.salePrice || a.price
          const priceB = b.salePrice || b.price
          return priceB - priceA
        })
        break
      case "newest":
        result = result.filter((p) => p.isNew).concat(result.filter((p) => !p.isNew))
        break
      case "sale":
        result = result.filter((p) => p.isSale).concat(result.filter((p) => !p.isSale))
        break
      // Default is "recommended" - no sorting needed
    }

    setFilteredProducts(result)
  }, [categorySlug, filters])

  const handleSortChange = (sortValue: string) => {
    setFilters((prev) => ({ ...prev, sort: sortValue }))
    setSortMenuOpen(false)
  }

  const getSortLabel = () => {
    switch (filters.sort) {
      case "recommended":
        return "Rekommenderade"
      case "price-asc":
        return "Pris: Lågt till högt"
      case "price-desc":
        return "Pris: Högt till lågt"
      case "newest":
        return "Nyast"
      case "sale":
        return "Rea"
      default:
        return "Rekommenderade"
    }
  }

  const hasActiveFilters =
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < priceRange

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl font-bold mb-6">{getCategoryName()}</h1>

      {/* Filter and sort controls */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setIsFilterOpen(true)}
          className={`flex items-center gap-2 py-2 px-4 border rounded-md ${
            hasActiveFilters ? "border-black bg-black text-white" : "border-gray-300"
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>Filter</span>
          {hasActiveFilters && (
            <span className="bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {filters.sizes.length +
                filters.colors.length +
                (filters.priceRange[0] > 0 || filters.priceRange[1] < priceRange ? 1 : 0)}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setSortMenuOpen(!sortMenuOpen)}
            className="flex items-center gap-2 py-2 px-4 border border-gray-300 rounded-md"
          >
            <span>{getSortLabel()}</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {sortMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <ul>
                <li>
                  <button
                    onClick={() => handleSortChange("recommended")}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      filters.sort === "recommended" ? "font-medium" : ""
                    }`}
                  >
                    Rekommenderade
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSortChange("price-asc")}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      filters.sort === "price-asc" ? "font-medium" : ""
                    }`}
                  >
                    Pris: Lågt till högt
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSortChange("price-desc")}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      filters.sort === "price-desc" ? "font-medium" : ""
                    }`}
                  >
                    Pris: Högt till lågt
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSortChange("newest")}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      filters.sort === "newest" ? "font-medium" : ""
                    }`}
                  >
                    Nyast
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSortChange("sale")}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      filters.sort === "sale" ? "font-medium" : ""
                    }`}
                  >
                    Rea
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.sizes.map((size) => (
            <div key={size} className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
              <span>{size}</span>
              <button
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    sizes: prev.sizes.filter((s) => s !== size),
                  }))
                }
                className="ml-2"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {filters.colors.map((color) => (
            <div key={color} className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
              <span>{color}</span>
              <button
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    colors: prev.colors.filter((c) => c !== color),
                  }))
                }
                className="ml-2"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {(filters.priceRange[0] > 0 || filters.priceRange[1] < priceRange) && (
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
              <span>
                {filters.priceRange[0]} kr - {filters.priceRange[1]} kr
              </span>
              <button
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: [0, priceRange],
                  }))
                }
                className="ml-2"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <button onClick={() => setFilters(initialFilters)} className="text-sm underline">
            Rensa alla
          </button>
        </div>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg">Inga produkter hittades med valda filter.</p>
          <button onClick={() => setFilters(initialFilters)} className="mt-4 underline">
            Rensa filter
          </button>
        </div>
      )}

      {/* Filter sheet */}
      <FilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApplyFilters={setFilters}
      />
    </div>
  )
}
