"use client"

import type React from "react"

import BroderyIcon from "@/app/icons/brodery"
import PrintIcon from "@/app/icons/print"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  BrandingContent,
  type BrandingOption,
  type BrandingType,
  calculateArea,
  calculateBrandingPrice,
  getPricingTier,
  getRecommendedDimensions,
  getTierLabel,
  MAX_LOGO_DIMENSION,
  MIN_LOGO_DIMENSION,
} from "@/data/branding-pricing"
import {
  ArrowRightIcon as ArrowsOutCardinal,
  ChevronDown,
  ImageIcon,
  Info,
  Type,
  X,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { LogoPosition } from "./commerce/size-selection"

interface BrandingOptionItemProps {
  option: BrandingOption
  totalQuantity: number
  onUpdate: (updatedOption: BrandingOption) => void
  onRemove: () => void
  currency: string
  logoPositions: LogoPosition[]
  index: number
  brandingOptions: BrandingOption[]
}

export default function BrandingOptionItem({
  option,
  totalQuantity,
  onUpdate,
  onRemove,
  currency,
  logoPositions,
  index,
  brandingOptions,
}: BrandingOptionItemProps) {
  const [expanded, setExpanded] = useState(true)
  const [width, setWidth] = useState(option.width)
  const [height, setHeight] = useState(option.height)
  const [calculatedArea, setCalculatedArea] = useState(option.size)
  const [pricingTier, setPricingTier] = useState(getPricingTier(option.type, option.size))

  // Update local state when props change
  useEffect(() => {
    setWidth(option.width)
    setHeight(option.height)
    setCalculatedArea(option.size)
    setPricingTier(getPricingTier(option.type, option.size))
  }, [option.width, option.height, option.size, option.type])

  // Update price whenever relevant inputs change
  useEffect(() => {
    const area = calculateArea(width, height)
    const newPrice = calculateBrandingPrice(option.type, option.content, area, totalQuantity)
    const newPricingTier = getPricingTier(option.type, area)

    if (
      width !== option.width ||
      height !== option.height ||
      area !== option.size ||
      newPrice !== option.pricePerItem
    ) {
      onUpdate({
        ...option,
        width,
        height,
        size: area,
        pricePerItem: newPrice,
      })
    }
  }, [width, height, option.type, option.content, totalQuantity])

  const handleTypeChange = useCallback(
    (type: BrandingType) => {
      let newWidth = MIN_LOGO_DIMENSION
      let newHeight = MIN_LOGO_DIMENSION

      if (option.content === "logo") {
        const recommended = getRecommendedDimensions(option.position)
        newWidth = recommended.width
        newHeight = recommended.height
      }

      const area = option.content === "logo" ? calculateArea(newWidth, newHeight) : 0

      setWidth(newWidth)
      setHeight(newHeight)
      setCalculatedArea(area)
      setPricingTier(getPricingTier(type, area))

      onUpdate({
        ...option,
        type,
        width: newWidth,
        height: newHeight,
        size: area,
        pricePerItem: calculateBrandingPrice(type, option.content, area, totalQuantity),
      })
    },
    [option, onUpdate, totalQuantity]
  )

  const handlePositionChange = useCallback(
    (position: BrandingPosition) => {
      if (option.content === "logo") {
        const recommended = getRecommendedDimensions(position)
        setWidth(recommended.width)
        setHeight(recommended.height)
        const area = calculateArea(recommended.width, recommended.height)
        setCalculatedArea(area)
        setPricingTier(getPricingTier(option.type, area))

        onUpdate({
          ...option,
          position,
          width: recommended.width,
          height: recommended.height,
          size: area,
          pricePerItem: calculateBrandingPrice(option.type, option.content, area, totalQuantity),
        })
      } else {
        onUpdate({
          ...option,
          position,
        })
      }
    },
    [option, onUpdate, totalQuantity]
  )

  const handleContentChange = useCallback(
    (content: BrandingContent) => {
      let newWidth = MIN_LOGO_DIMENSION
      let newHeight = MIN_LOGO_DIMENSION
      let area = 0

      if (content === "logo") {
        const recommended = getRecommendedDimensions(option.position)
        newWidth = recommended.width
        newHeight = recommended.height
        area = calculateArea(newWidth, newHeight)
      }

      setWidth(newWidth)
      setHeight(newHeight)
      setCalculatedArea(area)
      setPricingTier(getPricingTier(option.type, area))

      onUpdate({
        ...option,
        content,
        width: newWidth,
        height: newHeight,
        size: area,
        pricePerItem: calculateBrandingPrice(option.type, content, area, totalQuantity),
      })
    },
    [option, onUpdate, totalQuantity]
  )

  const handleWidthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Math.max(
      MIN_LOGO_DIMENSION,
      Math.min(MAX_LOGO_DIMENSION, Number.parseInt(e.target.value) || MIN_LOGO_DIMENSION)
    )
    setWidth(newWidth)
  }, [])

  const handleHeightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Math.max(
      MIN_LOGO_DIMENSION,
      Math.min(MAX_LOGO_DIMENSION, Number.parseInt(e.target.value) || MIN_LOGO_DIMENSION)
    )
    setHeight(newHeight)
  }, [])

  const handleInputBlur = useCallback(() => {
    // Intentionally left blank since price update now handled by useEffect
  }, [])

  const getHeaderIcon = () => {
    if (option.type === "printing") {
      return <PrintIcon className="h-4 w-4 mr-2" />
    } else if (option.type === "embroidery") {
      return <BroderyIcon className="h-4 w-4 mr-2" />
    }
    return null
  }

  const getHeaderText = () => {
    const typeText = option.type === "printing" ? "Tryck" : "Brodyr"
    const contentText = option.content === "logo" ? "Logo" : "Namn"
    const sameTypeOptions = brandingOptions.filter((o) => o.type === option.type)
    const typeIndex = sameTypeOptions.findIndex((o) => o === option) + 1
    return `${typeText} ${typeIndex} - ${contentText}`
  }

  return (
    <div className="border border-gray-200  overflow-hidden mb-3">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-50 p-3">
        <div className="flex flex-col">
          <div className="flex items-center">
            {getHeaderIcon()}
            <span className="font-medium text-sm">
              {getHeaderText()}
              {option.content === "logo" && (
                <span>
                  {" "}
                  ({option.width} × {option.height} cm = {option.size} cm²)
                </span>
              )}
            </span>
          </div>

          {logoPositions.find((pos) => pos.key === option.position) ? (
            <span className="text-sm text-gray-600">
              {logoPositions.find((pos) => pos.key === option.position)?.name}
            </span>
          ) : (
            <span className="text-sm text-red-600">Position saknas</span>
          )}
        </div>
        <div className="flex items-center">
          <span className="font-medium text-sm mr-2">
            +{option.pricePerItem} {currency}/st
          </span>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-gray-500 hover:text-gray-700 mr-1"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 text-gray-500 hover:text-red-500"
            aria-label="Remove branding option"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {expanded && (
        <div className="p-3 border-t border-gray-200">
          <div className="flex flex-col gap-4">
            {/* Type selection */}
            <div>
              <label className="block text-sm font-bold mb-1">1. Typ</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleTypeChange("printing")}
                  className={`flex flex-col items-center justify-center p-2 border  ${
                    option.type === "printing"
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <PrintIcon
                    className={`h-5 w-5 mb-1 ${
                      option.type === "printing" ? "text-black" : "text-gray-500"
                    }`}
                  />
                  <span className="text-xs">Tryck</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("embroidery")}
                  className={`flex flex-col items-center justify-center p-2 border  ${
                    option.type === "embroidery"
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <BroderyIcon
                    className={`h-5 w-5 mb-1 ${
                      option.type === "embroidery" ? "text-black" : "text-gray-500"
                    }`}
                  />
                  <span className="text-xs">Brodyr</span>
                </button>
              </div>
            </div>

            {/* Content selection */}
            <div>
              <div className="flex mb-1">
                <label className="flex text-sm font-bold">2. Innehåll</label>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 ml-2" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-xs max-w-xs">
                        Maila oss er logotyp eller en lista med namn – det behövs för att vi ska
                        kunna trycka eller brodera era plagg.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleContentChange("logo")}
                  className={`flex flex-col items-center justify-center p-2 border ${
                    option.content === "logo"
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <ImageIcon
                    className={`h-5 w-5 mb-1 ${
                      option.content === "logo" ? "text-black" : "text-gray-500"
                    }`}
                  />
                  <span className="text-xs">Logo</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleContentChange("name")}
                  className={`flex flex-col items-center justify-center p-2 border ${
                    option.content === "name"
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Type
                    className={`h-5 w-5 mb-1 ${
                      option.content === "name" ? "text-black" : "text-gray-500"
                    }`}
                  />
                  <span className="text-xs">Namn</span>
                </button>
              </div>
            </div>

            {/* Position selection */}
            <div>
              <label className="block text-sm font-bold mb-1">3. Position</label>
              <Select
                value={option.position}
                onValueChange={(value) => handlePositionChange(value as BrandingPosition)}
              >
                <SelectTrigger className="w-full border-gray-300 rounded-none">
                  <SelectValue placeholder="Välj position" />
                </SelectTrigger>
                <SelectContent className="">
                  {logoPositions?.map((position) => (
                    <SelectItem key={position.key} value={position.key}>
                      {position.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dimensions selection - only for logo content */}
            {option.content === "logo" && (
              <div className="">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-bold">4. Dimensioner</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-1">
                            Prisnivå: {getTierLabel(option.type, calculatedArea)}
                          </span>
                          <Info className="h-3 w-3" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          Priset baseras på storleksnivån. Aktuell nivå:{" "}
                          {getTierLabel(option.type, calculatedArea)}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="mb-3">
                  <div className="flex items-center mb-3">
                    <ArrowsOutCardinal className="h-5 w-5 mr-2 text-gray-400" />
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Bredd (cm)</label>
                        <input
                          type="number"
                          min={MIN_LOGO_DIMENSION}
                          max={MAX_LOGO_DIMENSION}
                          value={width}
                          onChange={handleWidthChange}
                          onBlur={handleInputBlur}
                          className="w-full h-9 border border-gray-200  px-2"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Höjd (cm)</label>
                        <input
                          type="number"
                          min={MIN_LOGO_DIMENSION}
                          max={MAX_LOGO_DIMENSION}
                          value={height}
                          onChange={handleHeightChange}
                          onBlur={handleInputBlur}
                          className="w-full h-9 border border-gray-200  px-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Area display */}
                  <div className="bg-gray-50 p-2 flex justify-between items-center">
                    <span className="text-sm">Total area:</span>
                    <span className="font-medium text-sm">{calculatedArea} cm²</span>
                  </div>
                </div>

                {/* Size tier indicator */}
                <div className="bg-gray-50 p-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Prisnivå:</span>
                    <span className="font-medium text-sm">
                      {getTierLabel(option.type, calculatedArea)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Pris baserat på {pricingTier} cm² storlek
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
