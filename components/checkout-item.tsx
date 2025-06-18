"use client";

import { useBrink } from "@enadhq/commerce/brink";
import { useApp } from "@enadhq/commerce/enad";
import { localizedPrice, SuperLink } from "@enadhq/commerce/storefront";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";

export default function CheckoutItem({
  market,
  item,
}: {
  market: any;
  isLoading?: boolean;
  item: any;
}) {
  const { isCartOpen, setIsCartOpen } = useApp();
  const {
    isLoading: initalLoad,
    session,
    changeQuantity,
    removeCartItem,
    addToCart,
  } = useBrink();
  const [isLoading, setIsLoading] = useState<boolean>(initalLoad);

  const handleChangeQuantity = async (baseItem: any) => {
    const newQty = baseItem.quantity - 1;
    setIsLoading(true);

    // Ändra huvudprodukt
    await changeQuantity(
      baseItem,
      newQty,
      market.engageLocale,
      baseItem.options
    );

    // Ändra tillhörande tryck
    const brandingItems = cartItems.filter(
      (item) => item.options?.relatedTo === baseItem.id
    );

    for (const brandingItem of brandingItems) {
      await changeQuantity(
        brandingItem,
        newQty,
        market.engageLocale,
        brandingItem.options
      );
    }

    setTimeout(() => setIsLoading(false), 700);
  };

  const handleRemoveItem = async (baseItem: any) => {
    setIsLoading(true);

    const relatedBranding = cartItems.filter(
      (item) => item.options?.relatedTo === baseItem.id
    );

    await removeCartItem(baseItem, market.engageLocale);

    for (const item of relatedBranding) {
      await removeCartItem(item, market.engageLocale);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 700);
  };

  const handleAddItem = async (
    variantId: string,
    qty: number,
    baseItem: any
  ) => {
    setIsLoading(true);

    // 1. Uppdatera huvudprodukt
    await addToCart({
      productVariantId: variantId,
      quantity: qty,
      market: market.country,
      lang: market.language,
      store: process.env.NEXT_PUBLIC_BRINK_STORE_GROUP_ID || "",
      engageLocale: market.engageLocale,
    });

    // 2. Hämta nuvarande cartItems från session
    const updatedCartItems = [...(session?.cart?.items || [])];

    // 3. Hitta brandingItems relaterade till just denna baseItem
    const brandingItems = updatedCartItems.filter(
      (i) => i.options?.relatedTo === baseItem?.id
    );

    for (const brandingItem of brandingItems) {
      await changeQuantity(
        brandingItem,
        brandingItem.quantity + qty,
        market.engageLocale,
        brandingItem.options
      );
    }

    setTimeout(() => setIsLoading(false), 700);
  };

  const cartItems = [...(session?.cart?.items || [])];

  return (
    <div key={`${item.id}`} className="py-4 px-4 border-b">
      <div className="flex">
        {/* Product image */}
        <SuperLink
          href={`/p/${item?.customAttributes?.["productSlug"]}`}
          className="relative h-24 w-20 shrink-0"
        >
          <Image
            unoptimized
            src={
              item.imageUrl ||
              "/placeholder.svg?height=200&width=150&query=product"
            }
            alt={item.name}
            fill
            className="object-cover"
          />
        </SuperLink>

        {/* Product details */}
        <div className="ml-4 flex-1">
          <SuperLink
            href={`/p/${item?.customAttributes?.["productSlug"]}`}
            className=""
          >
            <div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium uppercase text-xs mb-1">
                    {item?.customAttributes?.["parentName"]}
                  </h3>
                  <p className="font-normal text-xs">
                    Storlek: {item.displayName}
                  </p>
                  {item?.customAttributes?.["color"] && (
                    <p className="font-normal mb-2 text-xs">
                      Färg: {item?.customAttributes?.["color"]}
                    </p>
                  )}
                </div>
                <p className="font-medium">
                  {localizedPrice(
                    item?.totalPriceAmount,
                    false,
                    market.language,
                    market.currency
                  )}
                </p>
                {item?.totalDiscountAmount > 0 && (
                  <p className="font-medium text-red-500 text-xs">
                    -
                    {localizedPrice(
                      item?.totalDiscountAmount,
                      false,
                      market.language,
                      market.currency
                    )}
                  </p>
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
                  ([key]) =>
                    key.includes("brandingAddon") &&
                    c.options?.relatedTo === item.id
                )
              ).length > 0 && (
                <div className="mt-2 flex-1">
                  {cartItems
                    ?.filter((c) =>
                      Object.entries(c.options).some(
                        ([key]) =>
                          key.includes("brandingAddon") &&
                          c.options?.relatedTo === item.id
                      )
                    )
                    .map((brandingItem) => (
                      <div className="pl-4 border-l">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground mr-4">
                              {brandingItem?.customAttributes?.["parentName"]} (
                              {brandingItem.displayName})
                            </span>
                            <span className="text-sm">
                              {localizedPrice(
                                brandingItem?.totalPriceAmount,
                                false,
                                market.language,
                                market.currency
                              )}
                            </span>
                            {brandingItem?.totalDiscountAmount > 0 && (
                              <p className="text-xs text-red-500">
                                -
                                {localizedPrice(
                                  brandingItem?.totalDiscountAmount,
                                  false,
                                  market.language,
                                  market.currency
                                )}
                              </p>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <span>Antal: {brandingItem.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </SuperLink>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center border rounded">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none"
                disabled={Object.entries(item.options).some(([key]) =>
                  key.includes("brandingAddon")
                )}
                onMouseDown={() =>
                  item.quantity !== 1
                    ? handleChangeQuantity(item)
                    : handleRemoveItem(item)
                }
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-1">{item.quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none"
                disabled={Object.entries(item.options).some(([key]) =>
                  key.includes("brandingAddon")
                )}
                onMouseDown={() =>
                  handleAddItem(item.productVariantId, 1, item)
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => handleRemoveItem(item)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
