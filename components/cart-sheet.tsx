"use client"

import CartIcon from "@/app/icons/cart"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MIN_BRANDING_QUANTITY } from "@/data/branding-pricing"
import { useBrink } from "@enadhq/commerce/brink"
import { useApp } from "@enadhq/commerce/enad"
import { localizedPrice } from "@enadhq/commerce/storefront"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import CartItem from "./cart-item"
import { Button } from "./ui/button"

export default function CartSheet({ market }: { market: any }) {
  const { isCartOpen, setIsCartOpen } = useApp()
  const { isLoading: initalLoad, session, changeQuantity, removeCartItem, addToCart } = useBrink()
  const [isLoading, setIsLoading] = useState<boolean>(initalLoad)

  const cartItems = [...(session?.cart?.items || [])]
  const totalItems =
    (session?.cart?.items
      ?.filter((c) => !Object.entries(c.options).some(([key]) => key.includes("brandingAddon")))
      ?.reduce((acc, item) => acc + item.quantity, 0) || 0) +
    (session?.giftCardProducts?.length || 0)
  const shippingTotal = session?.cart?.totals.shippingTotal || 0
  const subTotal = session?.cart?.totals.subTotal || 0
  const grandTotal = session?.cart?.totals.grandTotal || 0
  const discountTotal = session?.cart?.totals.discountTotal || 0
  const hasBrandingProducts = cartItems.some((c) =>
    Object.entries(c.options).some(([key]) => key.includes("brandingAddon"))
  )
  const amountPrintableCartItems = cartItems
    .filter((c) => Object.entries(c.options).some(([key]) => key.includes("brandingAddon")))
    .reduce((sum, item) => sum + (item.quantity || 0), 0)

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative w-auto h-auto p-2 group">
          <CartIcon className="h-6! w-6!" />
          {totalItems > 0 && (
            <span className="absolute bottom-1 pl-1 py-1 right-0 h-4 group-hover:text-black group-hover:bg-accent w-auto rounded-full bg-black text-xs font-medium text-white flex items-center justify-center">
              {totalItems}
            </span>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col gap-0">
        <SheetHeader className="border-b pb-4 mb-0">
          <div className="flex justify-between items-center">
            <SheetTitle>Din varukorg ({totalItems})</SheetTitle>
          </div>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <p className="text-lg font-medium mb-2">Din varukorg är tom</p>
            <p className="text-gray-500 mb-6">Lägg till produkter för att fortsätta handla</p>
            <button onClick={() => setIsCartOpen(false)} className="btn-primary max-w-xs">
              Fortsätt handla
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-2">
              {cartItems
                ?.filter(
                  (c) => !Object.entries(c.options).some(([key]) => key.includes("brandingAddon"))
                )
                .map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    market={market}
                    session={session}
                    isLoading={isLoading}
                  />
                ))}
            </div>

            {/* Cart summary */}

            <SheetFooter className="border-t pt-4 px-4">
              {hasBrandingProducts && amountPrintableCartItems < MIN_BRANDING_QUANTITY && (
                <div className="bg-amber-50 p-3 flex items-start mb-2">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2 shrink-0 mt-0.5" />
                  <p className="text-sm">
                    För tryck och brodyr krävs minst {MIN_BRANDING_QUANTITY} exemplar. Du har valt{" "}
                    {amountPrintableCartItems} st.
                  </p>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delsumma</span>
                <span>{localizedPrice(subTotal, false, market.language, market.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frakt</span>
                <span className="">Beräknas i kassan</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Rabatt</span>
                <span>
                  {localizedPrice(discountTotal, false, market.language, market.currency)}
                </span>
              </div>
              <div className="flex justify-between mt-2 font-bold text-lg p-4 bg-gray-100">
                <span>
                  Totalt
                  <span className="text-xxs uppercase font-light tracking-wide ml-2">
                    exkl. moms
                  </span>
                </span>
                <span>{localizedPrice(grandTotal, false, market.language, market.currency)}</span>
              </div>
              {hasBrandingProducts && amountPrintableCartItems < MIN_BRANDING_QUANTITY ? (
                <Button disabled className="w-full mt-1">
                  GÅ TILL KASSAN
                </Button>
              ) : (
                <Button asChild className="w-full mt-1">
                  <Link href="/checkout" className="" onClick={() => setIsCartOpen(false)}>
                    GÅ TILL KASSAN
                  </Link>
                </Button>
              )}
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
