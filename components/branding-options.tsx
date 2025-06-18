"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  type BrandingOption,
  MIN_BRANDING_QUANTITY,
  calculateBrandingPrice,
  generateBrandingId,
  getRecommendedDimensions,
} from "@/data/branding-pricing"
import { AlertCircle, InfoIcon, Plus } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import BrandingOptionItem from "./branding-option-item"
import { LogoPosition } from "./commerce/size-selection"
import { Button } from "./ui/button"

interface BrandingOptionsProps {
  totalQuantity: number
  onBrandingChange: (brandingOptions: BrandingOption[] | null) => void
  currency: string
  isLoggedOut: boolean
  logoPositions: LogoPosition[]
}

export default function BrandingOptions({
  totalQuantity,
  onBrandingChange,
  currency,
  isLoggedOut,
  logoPositions,
}: BrandingOptionsProps) {
  const [brandingOptions, setBrandingOptions] = useState<BrandingOption[]>([])

  // Update parent component when branding options change
  useEffect(() => {
    if (brandingOptions.length > 0) {
      onBrandingChange(brandingOptions)
    } else {
      onBrandingChange(null)
    }
  }, [brandingOptions, onBrandingChange])

  const addBrandingOption = useCallback(() => {
    // Get recommended dimensions for default position
    const defaultPosition = ""
    const recommended = getRecommendedDimensions(defaultPosition)

    // Create a new branding option with default values
    const newOption: BrandingOption = {
      id: generateBrandingId(),
      type: "printing",
      content: "logo",
      position: defaultPosition,
      width: recommended.width,
      height: recommended.height,
      size: recommended.width * recommended.height,
      pricePerItem: calculateBrandingPrice(
        "printing",
        "logo",
        recommended.width * recommended.height,
        totalQuantity
      ),
    }

    setBrandingOptions((prev) => [...prev, newOption])
  }, [totalQuantity])

  const updateBrandingOption = useCallback((updatedOption: BrandingOption) => {
    setBrandingOptions((prev) =>
      prev.map((option) => (option.id === updatedOption.id ? updatedOption : option))
    )
  }, [])

  const removeBrandingOption = useCallback((id: string) => {
    setBrandingOptions((prev) => prev.filter((option) => option.id !== id))
  }, [])

  // Calculate total branding cost
  const totalBrandingCost = brandingOptions.reduce(
    (sum, option) => sum + option.pricePerItem * totalQuantity,
    0
  )

  return (
    <div className="my-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-sm uppercase">Anpassning & Branding</p>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-gray-500 hover:text-gray-700">
                <InfoIcon className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">
                Priser för tryck och brodyr baseras på antal och storlek. Minsta beställning:{" "}
                {MIN_BRANDING_QUANTITY} st. Du kan lägga till flera tryck/brodyr på olika
                positioner.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {isLoggedOut ? (
        <div className="bg-amber-50 p-3 flex items-start">
          <AlertCircle className="h-5 w-5 text-amber-500 mr-2 shrink-0 mt-0.5" />
          <p className="text-sm">
            Du måste vara inloggad för att lägga till tryck eller brodyr.{" "}
            <Link className="underline" href="/login">
              Logga in
            </Link>{" "}
            eller{" "}
            <Link className="underline" href="/signup/">
              ansök om konto
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          {/* List of branding options */}
          {brandingOptions.length > 0 && (
            <div className="mb-4">
              {brandingOptions.map((option, index) => (
                <BrandingOptionItem
                  key={option.id}
                  option={option}
                  totalQuantity={totalQuantity}
                  onUpdate={updateBrandingOption}
                  onRemove={() => removeBrandingOption(option.id)}
                  currency={currency}
                  logoPositions={logoPositions}
                  index={index + 1}
                  brandingOptions={brandingOptions}
                />
              ))}
            </div>
          )}

          {/* Add branding option button */}
          <Button
            type="button"
            onClick={addBrandingOption}
            disabled={isLoggedOut}
            className="flex normal-case items-center h-auto justify-center w-full p-6 bg-gray-50 border border-dashed border-gray-300 text-sm hover:text-gray-900 text-black hover:border-gray-400 hover:bg-gray-200 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Lägg till tryck/brodyr</span>
          </Button>

          {/* Total branding cost summary */}
          {brandingOptions.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md hidden">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total kostnad för branding</span>
                <span className="font-bold">
                  +{totalBrandingCost} {currency}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {brandingOptions.length} {brandingOptions.length === 1 ? "position" : "positioner"}{" "}
                × {totalQuantity} produkter
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
