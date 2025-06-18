"use client"

import { getSizeGuideForProduct } from "@/data/size-guides"
import { cn } from "@/lib/utils"
import { EnadProduct, EnadUser } from "@enadhq/commerce/enad"
import { SuperLink } from "@enadhq/commerce/storefront"
import { ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { BreadcrumbComponent } from "./Breadcrumbs"
import EnadPrice from "./commerce/price/enad-price/price"
import SizeSelection, { useStocks } from "./commerce/size-selection"
import ProductImageCarousel from "./product-image-carousel"
import ProductStackedImages from "./product-stacked-images"
import SizeGuideDialog from "./size-guide-dialog"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import WishlistTrigger from "./wishlist-trigger"

export default function ProductDetail({
  product,
  market,
  user,
  searchParams,
}: {
  product: EnadProduct
  market: any
  user: EnadUser
  searchParams: any
}) {
  const {
    data: stocks,
    error: stocksError,
    isLoading: loadingStocks,
    refetch,
  } = useStocks({
    parentProductId: product.product_number,
    storeGroupId: market.storeGroupId,
    countryCode: market.country,
  })
  const isLoggedOut = !user?.id
  const [expandedSection, setExpandedSection] = useState<string | null>("details")
  const sizeGuide = getSizeGuideForProduct(product.product_name)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [openSizes, setopenSizes] = useState({ open: false, size: "" })
  const brinkStore = process.env.NEXT_PUBLIC_BRINK_STORE_GROUP_ID
  const enadPrice = product?.variants?.[0]?.prices
    ?.find((p) => p.store_group_id === brinkStore)
    ?.markets?.find((m) => m.country_code === market.country)

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  const onImageTags = product?.tags
    ?.filter((t) => t.attributes?.["tag-position"])
    .filter((t) => t.attributes["tag-position"].some((pos) => pos.key === "on-image"))
  // Determine active color: from searchParams or fallback to first available color
  const allColors = product.variants
    ?.flatMap((v) => v.attributes?.["color"] || [])
    .map((color) => color.key)
    .filter(Boolean)

  const defaultColor = allColors?.[0] || ""
  const activeColor = searchParams?.color || defaultColor

  const activeColorVariant = product.variants?.find((v) =>
    v?.attributes?.["color"]?.some((c) => c.key === activeColor)
  )?.attributes?.["color"]?.[0]?.name

  const productSizes = product.variants
    ?.filter(
      (v) =>
        v.attributes &&
        v.attributes["size"] &&
        v.attributes?.["color"]?.some((c) => c.key === activeColor)
    )
    .map((v) => v)

  console.log("productSizes", productSizes)

  const productColors = Array.from(
    new Map(
      product.variants?.flatMap((v) =>
        (v?.attributes?.["color"] || []).map((color) => [color.key, v])
      ) || []
    ).values()
  )

  const variantImages =
    product.variants?.find((v) => v?.attributes?.["color"]?.some((c) => c.key === activeColor))
      ?.images || []
  const productImages = variantImages || product.images

  console.log("productColors", productColors?.[0])

  // Desktop view
  return (
    <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-6 px-4 lg:pt-4 pb-10">
      {/* Product Images */}
      <div className="lg:col-span-1 max-w-[1200px] relative">
        <div className="hidden lg:block">
          <ProductStackedImages product={product} productImages={productImages} />
        </div>
        <div className="lg:hidden -mx-4 mb-4">
          <ProductImageCarousel images={productImages} productName={product.product_name} />
        </div>
        {(onImageTags?.length || enadPrice?.on_sale) && (
          <div className="absolute top-3 left-0 lg:left-28 space-x-2">
            {onImageTags?.map((tag) => (
              <Badge key={tag.id} className="">
                {tag.name}
              </Badge>
            ))}
            {enadPrice?.on_sale && (
              <Badge className="" variant={"outline"}>
                Sale
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="lg:col-span-1 lg:sticky lg:top-4 lg:self-start">
        <div className="mb-4">
          <div className="flex justify-between items-start mb-0.5">
            <div className="">
              <BreadcrumbComponent
                crumbs={[
                  { label: "Home", href: "/" },
                  ...(() => {
                    if (!product.categories || product.categories.length === 0) return []
                    // Find the category with the longest full_path_name
                    const maxLen = Math.max(
                      ...product.categories.map((cat) => cat.full_path_name?.length || 0)
                    )
                    // Get the first category with that max length
                    const mainCat = product.categories.find(
                      (cat) => (cat.full_path_name?.length || 0) === maxLen
                    )
                    if (!mainCat || !mainCat.full_path_name) return []
                    // Build breadcrumbs from the full_path_name
                    return mainCat.full_path_name
                      .map((name, idx) => {
                        // Find the matching category for each name in the path
                        const match = product.categories.find(
                          (c) =>
                            c.name === name &&
                            c.full_path_name &&
                            c.full_path_name.length === idx + 1
                        )
                        return match
                          ? {
                              label: match.name,
                              href: `/c/${match.uri}`,
                            }
                          : null
                      })
                      .filter((crumb): crumb is { label: string; href: string } => crumb !== null)
                  })(),
                ]}
              />
              <h1 className="text-base font-bold uppercase mt-2.5">{product?.product_name}</h1>
            </div>
            <WishlistTrigger
              className="bg-transparent -mr-2 p-2 h-auto! w-auto!"
              classNameHeart="h-6! w-6!"
              productNumber={product.product_number}
              variant="secondary"
              size="icon"
            />
          </div>
          <EnadPrice market={market} enadPrice={enadPrice} className="" discountClassName="" />
        </div>

        {/* Size selection */}
        {productSizes?.length ? (
          <div className="mb-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Storlek:</span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-sm underline underline-offset-4 flex items-cente"
              >
                Storleksguide
              </button>
            </div>
            <div className="flex flex-wrap gap-4 mb-6">
              {productSizes?.map((size, index) => (
                <Button
                  onClick={() => setopenSizes({ open: true, size: size.variant_number })}
                  key={index}
                  variant={"outline"}
                  className="min-w-[44px]"
                  disabled={
                    (stocks?.productParent?.productVariants?.find(
                      (s) => s.id === size.variant_number
                    )?.availableQuantity ?? 0) <= 0 || !size.validate_stock
                  }
                >
                  {size.attributes?.["size"]?.[0]?.name || size.variant_name}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <Badge className="mb-4">{activeColorVariant} har inga storlekar tillgängliga.</Badge>
        )}

        {product?.related_products?.find((t) => t.type === "color-options")?.products?.length ? (
          <div className="mb-6">
            <h3 className="text-sm mb-2">Färg:</h3>
            <div>
              <div className="flex flex-wrap gap-4">
                {product?.related_products
                  ?.find((t) => t.type === "color-options")
                  ?.products?.map((relatedProduct) => (
                    <SuperLink
                      href={`/p/${relatedProduct.slug}`}
                      key={relatedProduct.id}
                      className={cn(
                        "overflow-hidden",
                        product?.id === relatedProduct.id && "border border-black"
                      )}
                    >
                      {relatedProduct?.images?.[0]?.url && (
                        <Image
                          src={relatedProduct?.images?.[0]?.url}
                          alt={relatedProduct?.images?.[0]?.alt}
                          width={44}
                          height={44}
                          className="mx-auto w-[44px] h-[44px]"
                          unoptimized
                        />
                      )}
                    </SuperLink>
                  ))}
              </div>
            </div>
          </div>
        ) : null}

        {productColors?.length ? (
          <div className="mb-6">
            <h3 className="text-sm mb-2">Färg: {activeColorVariant}</h3>
            <div>
              <div className="flex flex-wrap gap-4">
                {productColors?.map((relatedProduct) => (
                  <SuperLink
                    href={`/p/${product.slug}?color=${relatedProduct.attributes?.["color"]?.[0]?.key}`}
                    key={relatedProduct.id}
                    className={cn(
                      "overflow-hidden",
                      activeColor === relatedProduct.attributes?.["color"]?.[0]?.key &&
                        "border border-black"
                    )}
                  >
                    {relatedProduct?.image_url ? (
                      <Image
                        src={relatedProduct?.image_url}
                        alt={relatedProduct?.description || ""}
                        width={44}
                        height={44}
                        className="mx-auto w-[44px] h-[44px]"
                        unoptimized
                      />
                    ) : (
                      <div
                        style={{
                          backgroundColor:
                            relatedProduct?.attributes?.["color"]?.[0]?.values?.["swatch"]?.[0]
                              ?.value,
                        }}
                        className="mx-auto w-[44px] h-[44px] bg-gray-200 flex items-center justify-center"
                      ></div>
                    )}
                  </SuperLink>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <Sheet
          open={openSizes.open}
          onOpenChange={() => setopenSizes({ open: !openSizes.open, size: "" })}
        >
          <SheetTrigger asChild>
            <Button className="w-full" disabled={productSizes?.length === 0}>
              Köp nu
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-auto lg:max-w-120 w-full px-0">
            <SheetHeader className="flex items-center justify-between flex-row pb-4 border-b border-gray-200 px-4">
              <SheetTitle className="text-sm font-bold uppercase">Välj storlek</SheetTitle>
            </SheetHeader>
            <SizeSelection
              basePrice={enadPrice?.base_price_amount || 0}
              color={"black"}
              logoCount={0}
              hasBothSides={false}
              onBack={() => setopenSizes({ open: false, size: "" })}
              onComplete={() => setopenSizes({ open: false, size: "" })}
              product={product}
              market={market}
              productSizes={productSizes}
              isLoggedOut={isLoggedOut}
              selectedSize={openSizes.size}
              stocks={stocks}
            />
          </SheetContent>
        </Sheet>

        {/* Add to cart button */}
        {/* <AddToBag
          product={product}
          market={market}
          selectedSize={selectedSize || ""}
        /> */}
        <div className="space-y-6 mt-6">
          {/* Accordion sections */}
          <div className="mt-8 border-t border-gray-200">
            {/* Product details */}
            <div className="py-4 border-b border-gray-200">
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => toggleSection("details")}
              >
                <h2 className="font-bold">Produktdetaljer</h2>
                {expandedSection === "details" ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>

              {expandedSection === "details" && (
                <div className="mt-4 text-sm">
                  {product.html_description && (
                    <div
                      className="mb-4"
                      dangerouslySetInnerHTML={{
                        __html: product.html_description,
                      }}
                    />
                  )}
                  {product.html_short_description && (
                    <div
                      className="mb-4"
                      dangerouslySetInnerHTML={{
                        __html: product.html_short_description,
                      }}
                    />
                  )}
                  <ul className="list-disc pl-5 space-y-1">
                    {/* {product.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))} */}
                  </ul>
                </div>
              )}
            </div>

            {/* Material */}
            <div className="py-4 border-b border-gray-200">
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => toggleSection("material")}
              >
                <h2 className="font-bold">Material</h2>
                {expandedSection === "material" ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>

              {expandedSection === "material" && (
                <div className="mt-4 text-sm">
                  <ul className="list-disc pl-5 space-y-1">
                    {/* {product.material.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))} */}
                  </ul>
                </div>
              )}
            </div>

            {/* Care instructions */}
            <div className="py-4 border-b border-gray-200">
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => toggleSection("care")}
              >
                <h2 className="font-bold">Tvättråd</h2>
                {expandedSection === "care" ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>

              {expandedSection === "care" && (
                <div className="mt-4 text-sm">
                  <ul className="list-disc pl-5 space-y-1">
                    {/* {product.care.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))} */}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Dialog */}
      {sizeGuide && (
        <SizeGuideDialog
          isOpen={isSizeGuideOpen}
          onClose={() => setIsSizeGuideOpen(false)}
          sizeGuide={sizeGuide}
        />
      )}
      {/* {product?.related_products?.find((t) => t.type === "color-options")
        ?.products?.length ? (
        <div className="wrapper mt-16 mb-12">
          <h2 className="mobile-headline-m mb-4">You might also like</h2>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {product?.related_products
              ?.find((t) => t.type === "color-options")
              ?.products?.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.product_number}
                  product={relatedProduct}
                  market={market}
                />
              ))}
          </div>
        </div>
      ) : null} */}
    </div>
  )
}
