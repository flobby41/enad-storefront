"use client";

import BroderyIcon from "@/app/icons/brodery";
import NameIcon from "@/app/icons/name";
import PrintIcon from "@/app/icons/print";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Api, useBrink, useUpdateItemOptions } from "@enadhq/commerce/brink";
import { useApp } from "@enadhq/commerce/enad";
import { localizedPrice } from "@enadhq/commerce/storefront";
import {
  AlertTriangle,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ReorderItem {
  id: number;
  name: string;
  color: string;
  colorName: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
  currency: string;
  availableQuantity: number;
}

interface ReorderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: Api.BrinkOrder;
  orderId: string;
  market: any;
}

export default function ReorderDialog({
  isOpen,
  onClose,
  order,
  orderId,
  market,
}: ReorderDialogProps) {
  const orderItems = order?.orderLines || [];
  const { isCartOpen, setIsCartOpen } = useApp();

  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initialQuantities: Record<string, number> = {};
    orderItems.forEach((item) => {
      // If item.options.relatedTo exists, get availableQuantity from the item it refers to
      if (item.options?.relatedTo) {
        const relatedItem = orderItems.find(
          (oi) => oi.id === item.options.relatedTo
        );
        initialQuantities[item.id] = Math.min(
          item.quantity,
          relatedItem?.stock?.availableQuantity ?? 0
        );
      } else {
        initialQuantities[item.id] = Math.min(
          item.quantity,
          item?.stock?.availableQuantity
        );
      }
    });
    return initialQuantities;
  });
  const handleQuantityChange = (
    itemKey: string,
    newQuantity: number,
    maxQuantity: number
  ) => {
    const clampedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
    setQuantities((prev) => {
      const updated = { ...prev, [itemKey]: clampedQuantity };
      // Uppdatera även relaterade brandingAddon-items
      orderItems.forEach((item) => {
        if (item.options?.relatedTo === itemKey) {
          updated[item.id] = clampedQuantity;
        }
      });
      return updated;
    });
  };

  const incrementQuantity = (itemKey: string, maxQuantity: number) => {
    setQuantities((prev) => {
      const newQty = Math.min((prev[itemKey] || 0) + 1, maxQuantity);
      const updated = { ...prev, [itemKey]: newQty };
      orderItems.forEach((item) => {
        if (item.options?.relatedTo === itemKey) {
          updated[item.id] = newQty;
        }
      });
      return updated;
    });
  };

  const decrementQuantity = (itemKey: string) => {
    setQuantities((prev) => {
      const newQty = Math.max((prev[itemKey] || 0) - 1, 0);
      const updated = { ...prev, [itemKey]: newQty };
      orderItems.forEach((item) => {
        if (item.options?.relatedTo === itemKey) {
          updated[item.id] = newQty;
        }
      });
      return updated;
    });
  };

  const { addToCart } = useBrink();
  const updateItemOptions = useUpdateItemOptions();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    const itemsToAdd = orderItems
      .map((item) => {
        const selectedQuantity = quantities[item.id] || 0;
        return {
          id: item.id,
          productParentId: item.productParentId,
          productVariantId: item.productVariantId,
          quantity: selectedQuantity,
          options: item.options,
        };
      })
      .filter((item) => item.quantity > 0);

    const addedItems: {
      orderItemId: string;
      cartItemId: string;
      productVariantId: string;
      qty: number;
    }[] = [];

    const brandingLinks: Record<string, Record<string, string>> = {};

    // 1. Lägg till huvudprodukter
    for (const item of itemsToAdd) {
      const isBranding = item.options?.brandingAddon === "true";
      if (isBranding) continue;

      const response = await addToCart({
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        market: market.country,
        lang: market.language,
        store: market.storeGroupId,
        engageLocale: market.language,
        updateCurrent: false,
      });

      const cartItem = response?.cart?.items?.find(
        (i) => i.productVariantId === item.productVariantId
      );

      if (cartItem) {
        addedItems.push({
          orderItemId: item.id,
          cartItemId: cartItem.id,
          productVariantId: item.productVariantId,
          qty: item.quantity,
        });
        brandingLinks[cartItem.id] = {};
      }

      await new Promise((res) => setTimeout(res, 200));
    }

    // 2. Lägg till brandingAddon-produkter
    for (const brandingItem of itemsToAdd) {
      const isBranding = brandingItem.options?.brandingAddon === "true";
      if (!isBranding) continue;

      const parentItem = addedItems.find(
        (item) => item.orderItemId === brandingItem.options?.relatedTo
      );
      if (!parentItem) continue;

      const response = await addToCart({
        productVariantId: brandingItem.productVariantId,
        quantity: brandingItem.quantity,
        market: market.country,
        lang: market.language,
        store: market.storeGroupId,
        engageLocale: market.language,
        options: {
          ...brandingItem.options,
          relatedTo: parentItem.cartItemId,
        },
        updateCurrent: false,
      });

      const brandingCartItem = response?.cart?.items?.find(
        (i) =>
          i.productVariantId === brandingItem.productVariantId &&
          i.options?.relatedTo === parentItem.cartItemId
      );

      if (brandingCartItem) {
        const type = brandingItem.options?.type || "branding";
        brandingLinks[parentItem.cartItemId][type] = brandingCartItem.id;
      }

      await new Promise((res) => setTimeout(res, 500));
    }

    // 3. Koppla huvudprodukter till brandingCartItems
    for (const { cartItemId } of addedItems) {
      const linkMap = brandingLinks[cartItemId];
      if (!linkMap || Object.keys(linkMap).length === 0) continue;

      const optionsToUpdate: Record<string, string> = {};
      for (const [type, brandingCartItemId] of Object.entries(linkMap)) {
        optionsToUpdate[`branding_${type}`] = brandingCartItemId;
      }

      await updateItemOptions.mutateAsync({
        itemId: cartItemId,
        quantity: 1,
        options: optionsToUpdate,
      });

      await new Promise((res) => setTimeout(res, 200));
    }

    onClose();
    setLoading(false);
    setIsCartOpen(true);
  };

  const totalItems = orderItems
    .filter((item) => !item.options?.["brandingAddon"])
    .reduce((sum, item) => sum + (quantities[item.id] || 0), 0);

  const totalPrice = orderItems.reduce((sum, item) => {
    const selectedQuantity = quantities[item.id] || 0;
    return sum + (item.totalPriceAmount / item.quantity) * selectedQuantity;
  }, 0);

  const hasUnavailableItems = orderItems
    ?.filter((p) => !p.options?.["brandingAddon"])
    .some((item) => item?.stock?.availableQuantity === 0);

  const hasReducedQuantities = orderItems
    ?.filter((p) => !p.options?.["brandingAddon"])
    .some((item) => {
      return (
        item?.stock?.availableQuantity < item.quantity &&
        item?.stock?.availableQuantity > 0
      );
    });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Beställ igen - Order {order.reference}</DialogTitle>
          <DialogDescription>
            Återbeställ denna order. Detta kommer att lägga till alla varor från
            ordern i din kundvagn.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {(hasUnavailableItems || hasReducedQuantities) && (
            <div className="bg-amber-50 border border-amber-200  p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 mb-1">Observera:</p>
                  {hasUnavailableItems && (
                    <p className="text-amber-700 mb-1">
                      Vissa produkter är inte längre tillgängliga.
                    </p>
                  )}
                  {hasReducedQuantities && (
                    <p className="text-amber-700">
                      Vissa produkter har begränsad tillgänglighet och
                      kvantiteten har justerats.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {orderItems
              ?.filter(
                (c) =>
                  !Object.entries(c?.options || {}).some(([key]) =>
                    key.includes("brandingAddon")
                  )
              )
              .map((item) => {
                const key = item.id;
                const selectedQuantity = quantities[key] || 0;
                const availableQuantity = item.stock.availableQuantity || 0;
                const isUnavailable = item?.stock?.validateStock
                  ? availableQuantity <= 0
                  : false;
                const hasReducedQuantity = availableQuantity < item.quantity;

                return (
                  <div
                    key={key}
                    className={`border  p-4 ${
                      isUnavailable ? "bg-gray-50 opacity-60" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="relative w-16 h-16  overflow-hidden flex-shrink-0">
                        <Image
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <p className="text-sm font-bold uppercase">
                          {item.name} - {item.productVariantId}
                        </p>
                        <p className="text-sm font-medium">
                          {localizedPrice(
                            item.totalPriceAmount,
                            false,
                            market.language,
                            market.currency
                          )}
                        </p>

                        <div className="flex items-center text-sm text-gray-500">
                          <span>Antal: {item.quantity}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span
                            className={
                              isUnavailable
                                ? "text-red-600"
                                : hasReducedQuantity
                                ? "text-amber-600"
                                : "text-green-600"
                            }
                          >
                            {isUnavailable
                              ? "Ej tillgänglig"
                              : `Tillgängliga: ${availableQuantity}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        {!isUnavailable ? (
                          <div className="flex items-center ">
                            <Button
                              disabled={availableQuantity <= 0}
                              variant="ghost"
                              size="icon"
                              aria-label="Minska antal"
                              className="h-8 w-8 rounded-none"
                              onMouseDown={() => decrementQuantity(key)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <input
                              type="number"
                              min="0"
                              max={availableQuantity}
                              value={selectedQuantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  key,
                                  Number.parseInt(e.target.value) || 0,
                                  availableQuantity
                                )
                              }
                              className="w-16 h-8 text-center text-sm"
                              aria-label={`Antal för ${item.name}`}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              aria-label="Öka antal"
                              onClick={() =>
                                incrementQuantity(key, availableQuantity)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 px-3 py-2">
                            Ej tillgänglig
                          </div>
                        )}

                        {availableQuantity > 0 && (
                          <div className="text-sm font-medium">
                            {localizedPrice(
                              (item.totalPriceAmount / item.quantity) *
                                selectedQuantity,
                              false,
                              market.language,
                              market.currency
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {order?.orderLines?.filter((c) =>
                      Object.entries(c.options).some(
                        ([key]) =>
                          key.includes("brandingAddon") &&
                          c.options?.relatedTo === item.id
                      )
                    ).length > 0 && (
                      <div className="flex-1">
                        {order?.orderLines
                          ?.filter((c) =>
                            Object.entries(c.options).some(
                              ([key]) =>
                                key.includes("brandingAddon") &&
                                c.options?.relatedTo === item.id
                            )
                          )
                          .map((brandingItem) => (
                            <div className="flex items-start space-x-2 border-t pt-3 mt-3">
                              <div className="bg-gray-100 rounded p-1.5">
                                {brandingItem?.productParentId === "tryck" && (
                                  <PrintIcon className="w-3.5 h-3.5" />
                                )}
                                {brandingItem?.productParentId === "brodyr" && (
                                  <BroderyIcon className="w-3.5 h-3.5" />
                                )}
                                {brandingItem?.productVariantId ===
                                  "namntryck" && (
                                  <NameIcon className="w-3.5 h-3.5" />
                                )}
                                {brandingItem?.productVariantId ===
                                  "namnbrodyr" && (
                                  <NameIcon className="w-3.5 h-3.5" />
                                )}
                              </div>
                              <div className="flex flex-col space-y-1 w-full">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs mr-4">
                                    {
                                      brandingItem?.customAttributes?.[
                                        "parentName"
                                      ]
                                    }{" "}
                                    ({brandingItem.displayName})
                                  </span>
                                  <span className="text-xs">
                                    {localizedPrice(
                                      (brandingItem?.totalPriceAmount /
                                        brandingItem.quantity) *
                                        selectedQuantity,
                                      false,
                                      market.language,
                                      market.currency
                                    )}
                                  </span>
                                </div>
                                {/* {brandingItem?.totalDiscountAmount > 0 && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs mr-4">
                                      (Mängdrabatt)
                                    </span>

                                    <span className="text-xs text-gray-500">
                                      -
                                      {localizedPrice(
                                        brandingItem?.totalDiscountAmount / brandingItem.quantity, 
                                        false,
                                        market.language,
                                        market.currency
                                      )}
                                    </span>
                                  </div>
                                )} */}
                                <div className="text-xs ">
                                  <span>
                                    Position:{" "}
                                    {brandingItem.options?.["position"]}
                                  </span>
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
                );
              })}
          </div>

          {totalItems > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-medium">
                <span>Totalt ({totalItems} st)</span>
                <span>
                  {localizedPrice(
                    totalPrice,
                    false,
                    market.language,
                    market.currency
                  )}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Avbryt
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={totalItems === 0 || loading}
              className="flex items-center"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-2" />
              )}
              Lägg till i varukorg ({totalItems})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
