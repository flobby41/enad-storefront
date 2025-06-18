"use client"

import { cn } from "@/lib/utils"
import { EnadProduct, Variant } from "@enadhq/commerce/enad"
import { localizedPrice, SuperLink } from "@enadhq/commerce/storefront"
import Image from "next/image"
import { useState } from "react"
import { Badge } from "./ui/badge"
import WishlistTrigger from "./wishlist-trigger"

interface ProductCardProps {
  product: EnadProduct
  market: any
}

const brinkStore = process.env.NEXT_PUBLIC_BRINK_STORE_GROUP_ID
const onlineStore = process.env.NEXT_PUBLIC_ENAD_WAREHOUSE_ONLINE_ID

export default function ProductCard({ product, market }: ProductCardProps) {
  const [hoverColor, sethoverColor] = useState("")
  const currentColor = product?.attributes?.["color"]?.[0]
  const displayedColors = product?.related_products
    ?.filter((t) => t.type === "color-options")
    .slice(0, 5)

  const availableSizes = Array.from(
    new Map(
      (product?.variants || [])
        .filter((size) => size.is_active && size.attributes?.["size"]?.length > 0)
        .map((size) => [size.attributes?.["size"]?.[0]?.key, size])
    ).values()
  )
  const enadPrice = product?.variants?.[0]?.prices
    ?.find((p) => p.store_group_id === brinkStore)
    ?.markets?.find((m) => m.country_code === market.country)

  const onImageTags = product?.tags
    ?.filter((t) => t.attributes?.["tag-position"])
    .filter((t) => t.attributes["tag-position"].some((pos) => pos.key === "on-image"))

  const productColors = Array.from(
    new Map(
      product.variants?.flatMap((v) =>
        (v.attributes?.["color"] || []).map((color) => [color.key, v])
      ) || []
    ).values()
  )

  const hoverColorImage =
    product.variants?.find((v) => v.attributes?.["color"]?.some((c) => c.key === hoverColor))
      ?.images || []

  const variantImages =
    hoverColor && hoverColorImage?.length ? hoverColorImage : product.variants?.[0]?.images || []

  function getStockStatus(v: Variant) {
    const onlineStock = v && v?.inventories?.find((i) => i?.warehouse?.id === onlineStore)
    return onlineStock
  }

  return (
    <div className="group relative">
      {/* Product image with wishlist button */}
      <div className="relative overflow-hidden bg-gray-100">
        <SuperLink href={`/p/${product.slug}`}>
          <Image
            src={variantImages?.[0]?.url || "/placeholder.svg"}
            alt={variantImages?.[0]?.alt || "Product image"}
            className={cn(
              "object-cover aspect-square w-full",
              variantImages?.[1]?.url && "group-hover:hidden"
            )}
            width={500}
            height={500}
            unoptimized
          />
          {variantImages?.[1] && (
            <Image
              src={variantImages?.[1]?.url || "/placeholder.svg"}
              alt={variantImages?.[1].alt}
              className="object-cover aspect-square group-hover:block hidden w-full"
              width={500}
              height={500}
              unoptimized
            />
          )}
        </SuperLink>

        {(onImageTags?.length || enadPrice?.on_sale) && (
          <div className="absolute top-1 left-1.5 space-x-1">
            {onImageTags?.map((tag) => (
              <Badge key={tag.id} className="bg-primary text-white rounded-none ">
                {tag.name}
              </Badge>
            ))}
            {enadPrice?.on_sale && (
              <Badge className="rounded-none" variant={"destructive"}>
                Sale
              </Badge>
            )}
          </div>
        )}

        <div className="absolute top-2 right-2 z-10">
          <WishlistTrigger
            className="h-8 w-8 bg-transparent"
            productNumber={product.product_number}
            variant="secondary"
            size="icon"
          />
        </div>
      </div>

      {/* Product info */}
      <div className="mt-2">
        <h3 className="text-sm font-medium uppercase tracking-wider">{product.product_name}</h3>
        <p className="text-xs text-gray-500">{product?.attributes?.["color"]?.[0]?.name}</p>
        <div className="mt-1 flex items-center uppercase">
          {enadPrice?.on_sale ? (
            <>
              <span className="text-base font-medium text-red-600">
                {localizedPrice(
                  enadPrice?.sale_price_amount,
                  true,
                  market.language,
                  market.currency
                )}
              </span>
              <span className="ml-2 text-base text-gray-500 line-through">
                {localizedPrice(
                  enadPrice?.base_price_amount,
                  true,
                  market.language,
                  market.currency
                )}
              </span>
            </>
          ) : (
            <span className="text-base font-medium">
              {enadPrice?.base_price_amount &&
                localizedPrice(
                  enadPrice?.base_price_amount,
                  true,
                  market.language,
                  market.currency
                )}
            </span>
          )}
        </div>
        {/* Color options */}
        <div className="mt-2 flex space-x-1">
          {/* Display color options */}
          {productColors?.slice(0, 5)?.map((color, index) => (
            <SuperLink
              key={color.product_number}
              className={`w-4 h-4 rounded-full border`}
              style={{
                backgroundColor: color?.attributes?.["color"]?.[0]?.values?.["swatch"]?.[0]?.value,
              }}
              aria-label={`View ${product.product_name} color`}
              href={`/p/${product.slug}?color=${color.attributes?.["color"]?.[0]?.key}`}
              onMouseEnter={() => sethoverColor(color.attributes?.["color"]?.[0]?.key || "")}
              onMouseLeave={() => sethoverColor("")}
            ></SuperLink>
          ))}
          {productColors?.length > 5 && (
            <div className="w-4 h-4 flex items-center justify-center text-xs">
              +{productColors.length - 5}
            </div>
          )}
        </div>
        {/* Size options */}
        <div className="mt-2 flex flex-wrap gap-2">
          {availableSizes?.slice(0, 5).map((size) => (
            <span
              key={size.variant_number}
              className={cn(
                "text-xs text-black",
                (getStockStatus(size)?.quantity ?? 0) > 0 || !size.validate_stock
                  ? ""
                  : "opacity-40"
              )}
            >
              {size.attributes?.["size"]?.[0]?.name || ""}
            </span>
          ))}
          {availableSizes?.length > 5 && (
            <span className="text-xs text-gray-600">+{availableSizes.length - 5}</span>
          )}
        </div>
      </div>
    </div>
  )
}
