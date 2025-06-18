"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BrandingContent, BrandingOption, BrandingType } from "@/data/branding-pricing"
import { getStocks } from "@enadhq/commerce/backend"
import { Product, useBrink, useUpdateItemOptions } from "@enadhq/commerce/brink"
import { EnadProduct, useApp, Variant } from "@enadhq/commerce/enad"
import { localizedPrice } from "@enadhq/commerce/storefront"
import { useQuery } from "@tanstack/react-query"
import { Loader2, Minus, Plus } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import BrandingOptions from "../branding-options"
import { Input } from "../ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

// Define size type
type SizeQuantity = {
  [key: string]: number
}

interface SizeSelectionProps {
  basePrice: number
  color: string
  logoCount: number
  hasBothSides: boolean
  onBack: () => void
  onComplete: () => void
  product: EnadProduct
  market: any
  productSizes: Variant[]
  isLoggedOut: boolean
  selectedSize: string
  stocks: Product.ProductParentStockTop | undefined
}

export function useStocks({
  parentProductId,
  storeGroupId,
  countryCode,
}: {
  parentProductId: string
  storeGroupId: string
  countryCode: string
}) {
  return useQuery({
    enabled: !!parentProductId,
    queryFn: () =>
      getStocks({
        productParentId: parentProductId ?? "",
        storeGroupId: storeGroupId,
        countryCode: countryCode,
        cache: "no-store",
      }),
    queryKey: ["stocks", parentProductId],
  })
}

const brinkStore = process.env.NEXT_PUBLIC_BRINK_STORE_GROUP_ID || ""

export type LogoPosition = {
  id: string
  key: string
  name: string
  description: string
  values: Record<string, any>
}

export default function SizeSelection({
  basePrice,
  color,
  logoCount,
  hasBothSides,
  onBack,
  onComplete,
  product,
  market,
  productSizes,
  isLoggedOut,
  selectedSize,
  stocks,
}: SizeSelectionProps) {
  const { isCartOpen, setIsCartOpen } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [toolTipOpen, setToolTipOpen] = useState(false)
  const [tooltipVariant, setTooltipVariant] = useState<string | null>(null)

  const [brandingOptions, setBrandingOptions] = useState<BrandingOption[] | null>(null)

  // Initialize quantities for all sizes to 0, except selectedSize to 1
  const [quantities, setQuantities] = useState<SizeQuantity>(
    productSizes?.reduce(
      (acc, variant) => ({
        ...acc,
        [variant?.variant_number]: selectedSize === variant?.variant_number ? 1 : 0,
      }),
      {}
    )
  )

  // State for showing/hiding larger sizes
  const [showLargeSizes, setShowLargeSizes] = useState(false)

  // Calculate total quantity and price
  const totalQuantity = Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
  // Calculate total price with branding
  const totalPrice = useMemo(() => {
    const baseTotal = basePrice * totalQuantity
    const brandingTotal =
      brandingOptions?.reduce((sum, option) => sum + option.pricePerItem * totalQuantity, 0) || 0
    return baseTotal + brandingTotal
  }, [basePrice, totalQuantity, brandingOptions])

  const getMaxQuantityForVariant = (variantNumber: string): number => {
    const brinkVariant = stocks?.productParent?.productVariants?.find(
      (v) => v.id.toLowerCase() === variantNumber.toLowerCase()
    )

    if (brinkVariant?.validateStock) {
      return brinkVariant?.availableQuantity ?? 0
    }

    return Infinity
  }

  // Handle quantity change
  const handleQuantityChange = (size: string, value: number) => {
    const newValue = Math.max(0, Math.floor(value))
    const max = getMaxQuantityForVariant(size)

    setQuantities((prev) => ({
      ...prev,
      [size]: Math.min(newValue, max),
    }))

    setError(null)
    setSuccess(false)
  }

  const incrementQuantity = (size: string) => {
    const max = getMaxQuantityForVariant(size)
    const current = quantities[size]

    if (current + 1 > max) {
      setTooltipVariant(size) // Visa tooltip för denna variant
      setTimeout(() => setTooltipVariant(null), 2000) // Dölj tooltip efter 2 sek
      return
    }

    setQuantities((prev) => ({
      ...prev,
      [size]: current + 1,
    }))

    setError(null)
    setSuccess(false)
  }

  const decrementQuantity = (size: string) => {
    if (quantities[size] > 0) {
      setQuantities((prev) => ({
        ...prev,
        [size]: prev[size] - 1,
      }))
      setError(null)
      setSuccess(false)
    }
  }

  const handleBrandingChange = (options: BrandingOption[] | null) => {
    setBrandingOptions(options)
    setError(null)
    setSuccess(false)
  }

  // Effect to auto-show large sizes if they have quantities
  useEffect(() => {
    if (!showLargeSizes && (quantities["XXL"] > 0 || quantities["3XL"] > 0)) {
      setShowLargeSizes(true)
    }
  }, [quantities, showLargeSizes])

  function getBrandingProductId(
    size: number,
    qty: number,
    type: BrandingType,
    content: BrandingContent
  ): string | null {
    if (size <= 100 && type === "printing" && content === "logo") {
      return "small-tryck"
    } else if (size <= 300 && type === "printing" && content === "logo") {
      return "medium-tryck"
    } else if (size >= 301 && type === "printing" && content === "logo") {
      return "large-tryck"
    } else if (size <= 40 && type === "embroidery" && content === "logo") {
      return "small-brodyr"
    } else if (size <= 200 && type === "embroidery" && content === "logo") {
      return "medium-brodyr"
    } else if (size >= 201 && type === "embroidery" && content === "logo") {
      return "large-brodyr"
    } else if (type === "embroidery" && content === "name") {
      if (qty >= 25) return "namnbrodyr"
    } else if (type === "printing" && content === "name") {
      if (qty >= 25) return "namntryck"
    }

    return null // fallback
  }

  const { addToCart } = useBrink()
  const updateItemOptionsMutation = useUpdateItemOptions()

  const handleAddItem = async (
    quantities: SizeQuantity,
    qty: number,
    totalPrice: number,
    options: BrandingOption[] | null
  ) => {
    setIsLoading(true)

    const quantitiesArray = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([productVariantId, qty]) => ({ productVariantId, qty }))

    try {
      const addedItems: {
        productVariantId: string
        qty: number
        cartItemId: string
      }[] = []

      const brandingLinks: Record<string, Record<string, string>> = {} // cartItemId -> { [type]: brandingItemId }

      // 1. Lägg till huvudprodukterna först
      for (const { productVariantId, qty } of quantitiesArray) {
        const response = await addToCart({
          productVariantId,
          quantity: Number(qty || 1),
          market: market.country,
          lang: market.language,
          store: process.env.NEXT_PUBLIC_BRINK_STORE_GROUP_ID || "",
          engageLocale: market.language,
          enadProduct: product,
          updateCurrent: false,
        })

        const addedItem = response?.cart?.items?.find(
          (item) => item.productVariantId === productVariantId
        )

        if (addedItem) {
          addedItems.push({
            productVariantId,
            qty,
            cartItemId: addedItem.id,
          })
          brandingLinks[addedItem.id] = {}
        }

        await new Promise((res) => setTimeout(res, 200))
      }

      // 2. Lägg till tryck-produkter (brandingOptions) per variant

      if (options?.length) {
        for (const { productVariantId, qty: variantQty, cartItemId } of addedItems) {
          for (const option of options) {
            const brandingProductId = getBrandingProductId(
              option.size,
              variantQty,
              option.type,
              option.content
            )

            console.log(brandingProductId, "brandingProductId")
            if (!brandingProductId) continue

            const response = await addToCart({
              productVariantId: brandingProductId,
              quantity: variantQty,
              market: market.country,
              lang: market.language,
              store: process.env.NEXT_PUBLIC_BRINK_STORE_GROUP_ID || "",
              engageLocale: market.language,
              enadProduct: product,
              options: {
                relatedTo: cartItemId,
                type: option.type,
                position: option.position,
                size: `${option.size}cm²`,
                width: `${option.width}cm`,
                height: `${option.height}cm`,
                brandingAddon: "true",
              },
              updateCurrent: false,
            })

            const matchingItems = response?.cart?.items?.filter(
              (item) =>
                item.productVariantId === brandingProductId &&
                item.options?.relatedTo === cartItemId
            )

            // Välj det senast skapade itemet
            const brandingItem = matchingItems?.sort(
              (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
            )[0]

            if (brandingItem) {
              brandingLinks[cartItemId][option.type] = brandingItem.id
            }

            await new Promise((res) => setTimeout(res, 500))
          }
        }
      }

      // 3. Uppdatera huvudprodukterna med relation till sina tryck
      for (const { cartItemId } of addedItems) {
        const linkMap = brandingLinks[cartItemId]
        if (!linkMap || Object.keys(linkMap).length === 0) continue

        const optionsToUpdate: Record<string, string> = {}
        for (const [type, brandingCartItemId] of Object.entries(linkMap)) {
          optionsToUpdate[`branding_${type}`] = brandingCartItemId
        }

        await updateItemOptionsMutation.mutateAsync({
          itemId: cartItemId,
          quantity: 1,
          options: optionsToUpdate,
        })

        await new Promise((res) => setTimeout(res, 200))
      }
    } catch (error) {
      console.error("Error adding items to cart:", error)
      setError("Failed to add items to cart. Please try again.")
    } finally {
      setIsLoading(false)
      onComplete()
      setIsCartOpen(true)
      setBrandingOptions(null)
    }
  }

  // Remove duplicates by 'id' from logo positions
  const logoPositions: LogoPosition[] = Array.from(
    new Map(
      (
        product.categories
          ?.flatMap((cat) => cat.attributes?.["logo-positions"] || [])
          .filter(Boolean) || []
      ).map((pos) => [pos.id, pos])
    ).values()
  )

  const isBrandingInvalid = brandingOptions?.some((option) => option.position.trim() === "")

  return (
    <div className="h-full ">
      <div className="flex flex-col justify-between h-full">
        {/* Size selection */}
        <div className="">
          <div className="">
            <div className="px-4 flex items-center justify-between py-2">
              <div className="text-sm uppercase font-medium">Storlek</div>
              <Button
                variant={"link"}
                // onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs font-normal flex items-center underline px-0"
              >
                Storleksguide
              </Button>
            </div>

            <div className="space-y-2">
              {productSizes.map((variant) => {
                const brinkVariant = stocks?.productParent?.productVariants?.find(
                  (p) => p.id.toLocaleLowerCase() === variant?.variant_number.toLocaleLowerCase()
                )

                const isAvailable =
                  (brinkVariant?.isAvailable && brinkVariant?.availableQuantity > 0) ||
                  !brinkVariant?.validateStock

                if (variant?.is_active === false) {
                  return null
                }
                return (
                  <div
                    key={variant?.id}
                    className="flex items-center justify-between py-1 border-t border-gray-100 px-4"
                  >
                    <div className="min-w-[103px]">
                      <div className="font-medium bg-gray-100 px-3 py-0.5 rounded-sm text-xs min-w-10 text-center inline-block">
                        {variant?.variant_name}

                        {!isAvailable && (
                          <span className="text-xs text-gray-400 ml-2">(Slut i lager)</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-0 "
                        onMouseDown={() => decrementQuantity(variant?.variant_number)}
                        disabled={!isAvailable}
                      >
                        <Minus size={16} />
                      </Button>
                      <Input
                        type="number"
                        defaultValue={selectedSize === variant.variant_number ? 1 : 0}
                        min="0"
                        disabled={!isAvailable}
                        max={
                          brinkVariant?.validateStock ? brinkVariant?.availableQuantity : 1000000
                        }
                        value={quantities[variant?.variant_number]}
                        onChange={(e) =>
                          handleQuantityChange(
                            variant?.variant_number,
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                        className="w-14 h-8 text-center ring-0! border-0! rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        aria-label={`Antal för storlek ${variant?.variant_number}`}
                      />
                      <TooltipProvider>
                        <Tooltip
                          disableHoverableContent
                          open={tooltipVariant === variant?.variant_number}
                        >
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-0"
                              disabled={!isAvailable}
                              onClick={() => incrementQuantity(variant?.variant_number)}
                            >
                              <Plus size={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>Begränsat tillgängligt lager</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="text-sm">
                      {localizedPrice(
                        variant?.prices
                          ?.find((p) => p.store_group_id === brinkStore)
                          ?.markets?.find((m) => m.country_code === market.country)
                          ?.base_price_amount || 0,
                        true,
                        market.language,
                        market.currency
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-auto space-y-4 ">
            <Separator />

            <div className="flex justify-between items-center px-4">
              <div>
                <div className="text-md font-semibold">{totalQuantity} produkter</div>
              </div>
              <div className="text-right">
                <div className="text-md font-semibold">
                  {localizedPrice(totalPrice, true, market.language, market.currency)}
                </div>
              </div>
            </div>
            <div className="px-4 border-t border-gray-200">
              {/* Branding options */}
              <BrandingOptions
                totalQuantity={totalQuantity}
                onBrandingChange={handleBrandingChange}
                currency={market.currency}
                isLoggedOut={isLoggedOut}
                logoPositions={logoPositions}
              />

              {error && (
                <div className="mt-2 p-2 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>
              )}
              {success && (
                <div className="mt-2 p-2 bg-green-50 text-green-600 rounded-md text-sm">
                  Produkterna har lagts till i varukorgen
                </div>
              )}

              {/* Total price summary */}
              {totalQuantity > 0 && (
                <div className="mt-4 p-4 bg-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Summa ({totalQuantity} st)</span>
                    <span className="font-bold text-lg">
                      {localizedPrice(totalPrice, true, market.language, market.currency)}
                    </span>
                  </div>

                  {brandingOptions && brandingOptions.length > 0 && (
                    <div className="text-sm text-gray-500 mt-2">
                      Inkluderar branding på {brandingOptions.length}{" "}
                      {brandingOptions.length === 1 ? "position" : "positioner"}:{" "}
                      {localizedPrice(
                        brandingOptions.reduce(
                          (sum, option) => sum + option.pricePerItem * totalQuantity,
                          0
                        ),
                        true,
                        market.language,
                        market.currency
                      )}
                    </div>
                  )}
                </div>
              )}

              <Button
                className="w-full rounded-none justify-center uppercase text-sm py-3 px-6 my-4 font-medium h-auto"
                disabled={totalQuantity === 0 || isLoading || isBrandingInvalid}
                onClick={() =>
                  handleAddItem(quantities, totalQuantity, totalPrice, brandingOptions)
                }
              >
                {isLoading ? <Loader2 className="animate-spin" /> : null}
                Köp nu
              </Button>

              {/* <div className="text-xs text-gray-500 text-center pb-4">
                Standard delivery 6-10 days
                <br />
                Shipping from{" "}
                {localizedPrice(69, true, market.language, market.currency)}
              </div> */}
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2 sticky bottom-0 pb-4 hidden">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Product:</span>
            <span className="font-medium">{product?.product_name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Color:</span>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-px"
                style={{
                  backgroundColor:
                    product?.attributes?.["color"]?.[0]?.values?.["swatch"]?.[0]?.value,
                }}
              ></div>
              <span className="font-medium">{product?.attributes?.["color"]?.[0]?.name}</span>
            </div>
          </div>
          {/* <div className="flex justify-between text-sm">
            <span className="text-gray-600">Print sides:</span>
            <span className="font-medium">
              {hasBothSides ? "Front & Back" : "Single side"}
            </span>
          </div> */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Unit price:</span>
            <span className="font-medium">
              {localizedPrice(basePrice, true, market.language, market.currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
