"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useWishlist } from "@enadhq/commerce/enad";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import EnadPrice from "./commerce/price/enad-price/price";
import { Button } from "./ui/button";

export default function WishlistSheet({ market }: { market: any }) {
  const {
    wishlistOpen,
    wishlist,
    setWishlistOpen,
    wishlistIds,
    toggleWishlist,
  } = useWishlist();

  return (
    <Sheet open={wishlistOpen} onOpenChange={setWishlistOpen}>
      <SheetContent className="w-full sm:max-w-md  flex flex-col">
        <SheetHeader className="border-b pb-4 ">
          <div className="flex justify-between items-center">
            <SheetTitle>Din önskelista ({wishlistIds?.length})</SheetTitle>
          </div>
        </SheetHeader>

        {wishlist?.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <p className="text-lg font-medium mb-2">Din önskelista är tom</p>
            <p className="text-gray-500 mb-6">
              Spara produkter genom att klicka på stjärnan
            </p>
            <button
              onClick={() => setWishlistOpen(false)}
              className="btn-primary max-w-xs"
            >
              Fortsätt handla
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-2 px-4">
              {wishlist?.map((item) => (
                <div key={`${item.id}`} className="flex py-4 border-b">
                  {/* Product image */}
                  <div className="relative h-24 w-20 shrink-0">
                    <Image
                      src={
                        item?.images?.[0]?.url ||
                        "/placeholder.svg?height=200&width=150&query=product"
                      }
                      alt={item?.images?.[0]?.alt}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product details */}
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{item.product_name}</h3>
                        {/* <p className="text-sm text-gray-500">
                          {item.attributes}, {item.size}
                        </p> */}
                      </div>

                      <EnadPrice
                        enadPrice={item?.variants?.[0]?.prices
                          ?.find(
                            (p) => p.store_group_id === market.storeGroupId
                          )
                          ?.markets?.find(
                            (m) => m.country_code === market.country
                          )}
                        market={market}
                      ></EnadPrice>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-between items-center mt-4 ">
                      {/* <button
                        onClick={() => handleAddToCart(item)}
                        className="flex items-center text-sm font-medium hover:underline"
                      >
                        <ShoppingBag className="h-4 w-4 mr-1" />
                        Lägg i varukorg
                      </button> */}
                      <Button
                        onMouseDown={() =>
                          toggleWishlist(item?.product_number || "")
                        }
                        className=""
                        variant={"ghost"}
                      >
                        <TrashIcon className="w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <SheetFooter className="border-t pt-4">
              <button
                onClick={() => setWishlistOpen(false)}
                className="btn-primary w-full"
              >
                FORTSÄTT HANDLA
              </button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
