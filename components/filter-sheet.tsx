"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { X, Check } from "lucide-react"
import type { FilterOptions } from "@/types/product"
import { getAllColors, getAllSizes, getPriceRange } from "@/data/products"

interface FilterSheetProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterOptions
  onApplyFilters: (filters: FilterOptions) => void
}

export default function FilterSheet({ isOpen, onClose, filters, onApplyFilters }: FilterSheetProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters)
  const allSizes = getAllSizes()
  const allColors = getAllColors()
  const [minPrice, maxPrice] = getPriceRange()

  // Reset local filters when the sheet opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters)
    }
  }, [isOpen, filters])

  const toggleSize = (size: string) => {
    setLocalFilters((prev) => {
      const newSizes = prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size]
      return { ...prev, sizes: newSizes }
    })
  }

  const toggleColor = (color: string) => {
    setLocalFilters((prev) => {
      const newColors = prev.colors.includes(color) ? prev.colors.filter((c) => c !== color) : [...prev.colors, color]
      return { ...prev, colors: newColors }
    })
  }

  const handlePriceChange = (min: number, max: number) => {
    setLocalFilters((prev) => ({
      ...prev,
      priceRange: [min, max],
    }))
  }

  const handleApply = () => {
    onApplyFilters(localFilters)
    onClose()
  }

  const handleClear = () => {
    const clearedFilters: FilterOptions = {
      sizes: [],
      colors: [],
      priceRange: [minPrice, maxPrice],
      sort: filters.sort,
    }
    setLocalFilters(clearedFilters)
    onApplyFilters(clearedFilters)
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <SheetTitle>Filter</SheetTitle>
            <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100" aria-label="Close filter">
              <X className="h-5 w-5" />
            </button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Size filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Storlek</h3>
            <div className="flex flex-wrap gap-2">
              {allSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1 border rounded-md text-sm ${
                    localFilters.sizes.includes(size)
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Färg</h3>
            <div className="flex flex-wrap gap-3">
              {allColors.map((color) => (
                <button key={color.name} onClick={() => toggleColor(color.name)} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full border relative ${
                      localFilters.colors.includes(color.name) ? "border-black border-2" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.value }}
                  >
                    {localFilters.colors.includes(color.name) && (
                      <Check
                        className={`absolute inset-0 m-auto h-4 w-4 ${
                          color.value === "#FFFFFF" || color.value === "#F5F5DC" || color.value === "#FFFF00"
                            ? "text-black"
                            : "text-white"
                        }`}
                      />
                    )}
                  </div>
                  <span className="text-xs mt-1">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price range filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Pris</h3>
            <div className="px-2">
              <div className="flex justify-between mb-2 text-sm">
                <span>{localFilters.priceRange[0]} kr</span>
                <span>{localFilters.priceRange[1]} kr</span>
              </div>
              <div className="relative mb-4">
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={localFilters.priceRange[0]}
                  onChange={(e) => handlePriceChange(Number.parseInt(e.target.value), localFilters.priceRange[1])}
                  className="w-full"
                />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={localFilters.priceRange[1]}
                  onChange={(e) => handlePriceChange(localFilters.priceRange[0], Number.parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Min</label>
                  <input
                    type="number"
                    min={minPrice}
                    max={localFilters.priceRange[1]}
                    value={localFilters.priceRange[0]}
                    onChange={(e) => handlePriceChange(Number.parseInt(e.target.value), localFilters.priceRange[1])}
                    className="w-full border border-gray-300 rounded-md px-2 py-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Max</label>
                  <input
                    type="number"
                    min={localFilters.priceRange[0]}
                    max={maxPrice}
                    value={localFilters.priceRange[1]}
                    onChange={(e) => handlePriceChange(localFilters.priceRange[0], Number.parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-2 py-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="border-t pt-4 flex flex-col gap-2">
          <button onClick={handleApply} className="btn-primary">
            ANVÄND FILTER
          </button>
          <button onClick={handleClear} className="py-2 text-center underline">
            Rensa filter
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
