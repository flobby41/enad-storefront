export type BrandingType = "printing" | "embroidery" | "none"
export type BrandingContent = "logo" | "name" | "none"

export interface BrandingOption {
  id: string
  type: BrandingType
  content: BrandingContent
  position: string
  width: number
  height: number
  size: number // Calculated area (width × height)
  pricePerItem: number
}

export const printingSizeTiers = [
  { maxSize: 100, label: "Small (up to 100 cm²)" },
  { maxSize: 300, label: "Medium (101-300 cm²)" },
  { maxSize: 600, label: "Large (301-600 cm²)" },
  // { maxSize: Number.POSITIVE_INFINITY, label: "Extra Large (601+ cm²)" },
]

export const embroiderySizeTiers = [
  { maxSize: 40, label: "Small (up to 40 cm²)" },
  { maxSize: 200, label: "Medium (41-200 cm²)" },
  { maxSize: 400, label: "Large (201-400 cm²)" },
  // { maxSize: Number.POSITIVE_INFINITY, label: "Extra Large (401+ cm²)" },
]

export const MIN_LOGO_DIMENSION = 1
export const MAX_LOGO_DIMENSION = 100
export const MIN_LOGO_SIZE = 1
export const MAX_LOGO_SIZE = 1000

export const MIN_BRANDING_QUANTITY = 25

export const printingPricing = {
  100: [
    { minQuantity: 0, maxQuantity: 100, price: 45 },
    { minQuantity: 101, maxQuantity: 200, price: 35 },
    { minQuantity: 201, maxQuantity: 400, price: 32 },
    { minQuantity: 401, maxQuantity: Number.POSITIVE_INFINITY, price: 28 },
  ],
  300: [
    { minQuantity: 0, maxQuantity: 100, price: 55 },
    { minQuantity: 101, maxQuantity: 200, price: 50 },
    { minQuantity: 201, maxQuantity: 400, price: 32 },
    { minQuantity: 401, maxQuantity: Number.POSITIVE_INFINITY, price: 40 },
  ],
  600: [
    { minQuantity: 0, maxQuantity: 100, price: 75 },
    { minQuantity: 101, maxQuantity: 200, price: 65 },
    { minQuantity: 201, maxQuantity: 400, price: 60 },
    { minQuantity: 401, maxQuantity: Number.POSITIVE_INFINITY, price: 50 },
  ],
  // 1000: [
  //   { minQuantity: 0, maxQuantity: 100, price: 95 },
  //   { minQuantity: 101, maxQuantity: 200, price: 85 },
  //   { minQuantity: 201, maxQuantity: 400, price: 75 },
  //   { minQuantity: 401, maxQuantity: Number.POSITIVE_INFINITY, price: 65 },
  // ],
}

export const embroideryPricing = {
  40: [
    { minQuantity: 0, maxQuantity: 100, price: 55 },
    { minQuantity: 101, maxQuantity: Number.POSITIVE_INFINITY, price: 55 },
  ],
  200: [
    { minQuantity: 0, maxQuantity: 100, price: 85 },
    { minQuantity: 101, maxQuantity: Number.POSITIVE_INFINITY, price: 65 },
  ],
  400: [
    { minQuantity: 0, maxQuantity: 100, price: 100 },
    { minQuantity: 101, maxQuantity: Number.POSITIVE_INFINITY, price: 85 },
  ],
  // 1000: [
  //   { minQuantity: 0, maxQuantity: 100, price: 120 },
  //   { minQuantity: 101, maxQuantity: Number.POSITIVE_INFINITY, price: 100 },
  // ],
}

export const namePricing = {
  price: 70,
  minQuantity: 0,
}

export function getPricingTier(type: BrandingType, size: number): number {
  if (type === "printing") {
    for (const tier of printingSizeTiers) {
      if (size <= tier.maxSize) {
        return tier.maxSize
      }
    }
    return printingSizeTiers[printingSizeTiers.length - 1].maxSize
  } else if (type === "embroidery") {
    for (const tier of embroiderySizeTiers) {
      if (size <= tier.maxSize) {
        return tier.maxSize
      }
    }
    return embroiderySizeTiers[embroiderySizeTiers.length - 1].maxSize
  }
  return 0
}

export function getTierLabel(type: BrandingType, size: number): string {
  if (type === "printing") {
    for (const tier of printingSizeTiers) {
      if (size <= tier.maxSize) {
        return tier.label
      }
    }
    return printingSizeTiers[printingSizeTiers.length - 1].label
  } else if (type === "embroidery") {
    for (const tier of embroiderySizeTiers) {
      if (size <= tier.maxSize) {
        return tier.label
      }
    }
    return embroiderySizeTiers[embroiderySizeTiers.length - 1].label
  }
  return ""
}

export function calculateBrandingPrice(
  type: BrandingType,
  content: BrandingContent,
  size: number,
  quantity: number
): number {
  if (type === "none") {
    return 0
  }

  // Fixed price for name content regardless of type
  if (content === "name") {
    return namePricing.price
  }

  const pricingTier = getPricingTier(type, size)

  if (type === "printing") {
    const priceTiers = printingPricing[pricingTier as keyof typeof printingPricing]
    if (!priceTiers) return 0

    for (const tier of priceTiers) {
      if (quantity >= tier.minQuantity && quantity <= tier.maxQuantity) {
        return tier.price
      }
    }
  }

  if (type === "embroidery") {
    const priceTiers = embroideryPricing[pricingTier as keyof typeof embroideryPricing]
    if (!priceTiers) return 0

    for (const tier of priceTiers) {
      if (quantity >= tier.minQuantity && quantity <= tier.maxQuantity) {
        return tier.price
      }
    }
  }

  return 0
}

export function getTotalWithBranding(
  basePrice: number,
  brandingOptions: BrandingOption[],
  quantity: number
): number {
  const brandingTotal = brandingOptions.reduce((sum, option) => sum + option.pricePerItem, 0)
  return basePrice + brandingTotal * quantity
}

export function generateBrandingId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Calculate area from width and height
export function calculateArea(width: number, height: number): number {
  return width * height
}

// Get default dimensions based on size
export function getDefaultDimensions(size: number): {
  width: number
  height: number
} {
  // Try to make a square or close to it
  const dimension = Math.sqrt(size)
  return {
    width: Math.round(dimension),
    height: Math.round(size / Math.round(dimension)),
  }
}

// Get recommended dimensions based on position
export function getRecommendedDimensions(position: string): {
  width: number
  height: number
} {
  switch (position) {
    case "vanster-brost":
    case "hoger-brost":
      return { width: 10, height: 5 } // 50 cm²
    case "rygg":
      return { width: 20, height: 15 } // 300 cm²
    case "sleeve-left":
    case "sleeve-right":
      return { width: 8, height: 5 } // 40 cm²
    default:
      return { width: 10, height: 10 } // 100 cm²
  }
}

export const printingSizes = [
  { value: 100, label: "Small (up to 100 cm²)" },
  { value: 300, label: "Medium (101-300 cm²)" },
  { value: 600, label: "Large (301-600 cm²)" },
  // { value: 1000, label: "Extra Large (601+ cm²)" },
]
