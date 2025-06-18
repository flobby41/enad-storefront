"use client"

import BroderyIcon from "@/app/icons/brodery"
import NameIcon from "@/app/icons/name"
import PrintIcon from "@/app/icons/print"
import { cn } from "@/lib/utils"
import { Session, useBrink } from "@enadhq/commerce/brink"
import { useApp } from "@enadhq/commerce/enad"
import { localizedPrice, SuperLink } from "@enadhq/commerce/storefront"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export default function CartItem({ market, item }: { market: any; item: Session.ShopperCartItem }) {
  const { isCartOpen, setIsCartOpen } = useApp()
  const { isLoading: initalLoad, session, changeQuantity, removeCartItem, addToCart } = useBrink()
  const [isLoading, setIsLoading] = useState<boolean>(initalLoad)
  const [newQtyChange, setNewQtyChange] = useState({ variantId: "", quantity: 1 })
  const inputTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleChangeQuantity = async (baseItem: any) => {
    const newQty = baseItem.quantity - 1
    setIsLoading(true)

    // Ändra huvudprodukt
    await changeQuantity(baseItem, newQty, market.engageLocale, baseItem.options)

    // Ändra tillhörande tryck
    const brandingItems = cartItems.filter((item) => item.options?.relatedTo === baseItem.id)

    for (const brandingItem of brandingItems) {
      await changeQuantity(brandingItem, newQty, market.engageLocale, brandingItem.options)
    }

    setTimeout(() => setIsLoading(false), 700)
  }

  const handleRemoveItem = async (baseItem: any) => {
    setIsLoading(true)

    const relatedBranding = cartItems.filter((item) => item.options?.relatedTo === baseItem.id)

    await removeCartItem(baseItem, market.engageLocale)

    for (const item of relatedBranding) {
      await removeCartItem(item, market.engageLocale)
    }

    setTimeout(() => {
      setIsLoading(false)
    }, 700)
  }

  const handleAddItem = async (variantId: string, qty: number, baseItem: any) => {
    setIsLoading(true)

    // 1. Uppdatera huvudprodukt
    const mainProduct = await addToCart({
      productVariantId: variantId,
      quantity: qty,
      market: market.country,
      lang: market.language,
      store: process.env.NEXT_PUBLIC_BRINK_STORE_GROUP_ID || "",
      engageLocale: market.engageLocale,
    })

    // Om huvudprodukten inte finns eller är "out of stock error", avsluta
    if (mainProduct === "out of stock error") {
      setIsLoading(false)
      return
    }

    // 2. Hämta nuvarande cartItems från session
    const updatedCartItems = [...(session?.cart?.items || [])]

    // 3. Hitta brandingItems relaterade till just denna baseItem
    const brandingItems = updatedCartItems.filter((i) => i.options?.relatedTo === baseItem?.id)

    for (const brandingItem of brandingItems) {
      await changeQuantity(
        brandingItem,
        brandingItem.quantity + qty,
        market.engageLocale,
        brandingItem.options
      )
    }

    setTimeout(() => setIsLoading(false), 700)
  }

  const cartItems = [...(session?.cart?.items || [])]

  const isDiscounted: boolean =
    ((item?.salePriceAmount ?? 0) > 0 &&
      (item?.salePriceAmount ?? 0) !== (item?.basePriceAmount ?? 0)) ||
    (item?.totalDiscountAmount ?? 0) > 0

  return (
    <div key={`${item.id}`} className="py-4 px-4 border-b">
      <div className="flex">
        {/* Product image */}
        <SuperLink
          href={`/p/${item?.customAttributes?.["productSlug"]}`}
          className="relative h-24 w-20 shrink-0"
          onClick={() => setIsCartOpen(false)}
        >
          <Image
            unoptimized
            src={item.imageUrl || "/placeholder.svg?height=200&width=150&query=product"}
            alt={item.name}
            fill
            className="object-cover"
          />
        </SuperLink>

        {/* Product details */}
        <div className="ml-4 flex-1">
          <SuperLink
            href={`/p/${item?.customAttributes?.["productSlug"]}`}
            onClick={() => setIsCartOpen(false)}
          >
            <div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold uppercase text-sm mb-1">
                    {item?.customAttributes?.["parentName"]}
                  </h3>
                  <p className="font-normal text-xs">Storlek: {item.displayName}</p>
                  {item?.customAttributes?.["color"] && (
                    <p className="font-normal mb-2 text-xs">
                      Färg: {item?.customAttributes?.["color"]}
                    </p>
                  )}
                </div>
                {isDiscounted ? (
                  <div className="flex flex-col">
                    <div className={cn(`flex space-x-2 w-full`)}>
                      <ins className={cn("!no-underline font-bold whitespace-nowrap")}>
                        {item.basePriceAmount &&
                          localizedPrice(
                            item.basePriceAmount * item.quantity,
                            false,
                            market.language,
                            market.currency
                          )}
                      </ins>
                      <del className={cn("line-through font-normal opacity-80")}>
                        {item?.totalPriceAmount &&
                          localizedPrice(
                            item.totalPriceAmount * item.quantity,
                            false,
                            market.language,
                            market.currency
                          )}
                      </del>
                    </div>
                  </div>
                ) : (
                  <div className={cn(`font-bold flex flex-col`)}>
                    <span>
                      {item.basePriceAmount &&
                        localizedPrice(
                          item.basePriceAmount * item.quantity,
                          false,
                          market.language,
                          market.currency
                        )}
                    </span>
                  </div>
                )}
              </div>
              {/* <p className="text-xs text-gray-400">{item.id}</p> */}
              {/* {item?.options &&
                                Object.entries(item.options).map(
                                  ([key, value]) => (
                                    <span
                                      key={key}
                                      className="block text-sm text-gray-500"
                                    >
                                      {key}: {value}
                                    </span>
                                  )
                                )} */}
              {cartItems?.filter((c) =>
                Object.entries(c.options).some(
                  ([key]) => key.includes("brandingAddon") && c.options?.relatedTo === item.id
                )
              ).length > 0 && (
                <div className="mt-2 flex-1 border-t pt-2">
                  {cartItems
                    ?.filter((c) =>
                      Object.entries(c.options).some(
                        ([key]) => key.includes("brandingAddon") && c.options?.relatedTo === item.id
                      )
                    )
                    .map((brandingItem) => (
                      <div className="flex items-start space-x-2 border-b pb-2 mb-3">
                        <div className="bg-gray-100 rounded p-1.5">
                          {brandingItem?.productParentId === "tryck" && (
                            <PrintIcon className="w-3.5 h-3.5" />
                          )}
                          {brandingItem?.productParentId === "brodyr" && (
                            <BroderyIcon className="w-3.5 h-3.5" />
                          )}
                          {brandingItem?.productVariantId === "namntryck" && (
                            <NameIcon className="w-3.5 h-3.5" />
                          )}
                          {brandingItem?.productVariantId === "namnbrodyr" && (
                            <NameIcon className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="flex flex-col space-y-1 w-full">
                          <div className="flex items-center justify-between">
                            <span className="text-xs mr-4">
                              {brandingItem?.customAttributes?.["parentName"]} (
                              {brandingItem.displayName})
                            </span>
                            <span className="text-xs">
                              {localizedPrice(
                                brandingItem?.totalPriceAmount,
                                false,
                                market.language,
                                market.currency
                              )}
                            </span>
                          </div>
                          {brandingItem?.totalDiscountAmount > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs mr-4">(Mängdrabatt)</span>

                              <span className="text-xs text-gray-500">
                                -
                                {localizedPrice(
                                  brandingItem?.totalDiscountAmount,
                                  false,
                                  market.language,
                                  market.currency
                                )}
                              </span>
                            </div>
                          )}
                          <div className="text-xs ">
                            <span>Position: {brandingItem.options?.["position"]}</span>
                          </div>

                          {/* <div className="text-xs text-muted-foreground">
                              <span>Antal: {brandingItem.quantity}</span>
                            </div> */}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </SuperLink>

          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none"
                disabled={Object.entries(item.options).some(([key]) =>
                  key.includes("brandingAddon")
                )}
                onMouseDown={() =>
                  item.quantity !== 1 ? handleChangeQuantity(item) : handleRemoveItem(item)
                }
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                className="w-14 h-8 text-center ring-0! border-0! rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                defaultValue={item.quantity}
                value={
                  newQtyChange.variantId === item.productVariantId
                    ? newQtyChange.quantity
                    : item.quantity
                }
                type="number"
                min={1}
                onChange={(e) => {
                  let value = Number(e.target.value)
                  if (value < 1) value = 1 // Block change to 0 or less
                  setNewQtyChange({ variantId: item.productVariantId, quantity: value })
                  if (inputTimeout.current) clearTimeout(inputTimeout.current)
                  inputTimeout.current = setTimeout(() => {
                    handleAddItem(item.productVariantId, value - item.quantity, item)
                    setNewQtyChange({ variantId: "", quantity: 1 })
                  }, 700)
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none"
                disabled={Object.entries(item.options).some(([key]) =>
                  key.includes("brandingAddon")
                )}
                onMouseDown={() => handleAddItem(item.productVariantId, 1, item)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:text-foreground"
              onClick={() => handleRemoveItem(item)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
