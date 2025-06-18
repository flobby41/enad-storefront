"use client"

import { TAGS, WalleyPayment } from "@enadhq/commerce/brink"
import { SuperLink } from "@enadhq/commerce/storefront"
import { useQueryClient } from "@tanstack/react-query"
import { deleteCookie } from "cookies-next"
import { Check } from "lucide-react"
import { useEffect } from "react"
import { Button } from "../ui/button"

export default function Confirmation({ orderId }: { orderId: string }) {
  const queryClient = useQueryClient()

  // if (!orderId) {
  //   return (
  //     <div className="py-24">
  //       <div className="flex flex-col items-center text-center mb-8">
  //         <h1 className="text-2xl font-bold mb-2">Ingen order hittades</h1>
  //         <p className="text-gray-600">
  //           Vi kunde inte hitta någon order med det angivna ordernumret.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  const clearSession = () => {
    deleteCookie("cartToken")
    deleteCookie("checkoutToken")
    window.sessionStorage.removeItem("_giftcard")
    queryClient.invalidateQueries({ queryKey: [TAGS.cart] })
    queryClient.invalidateQueries({ queryKey: [TAGS.checkout] })
    queryClient.removeQueries({ queryKey: [TAGS.cart] })
    queryClient.removeQueries({ queryKey: [TAGS.checkout] })
  }

  useEffect(() => {
    clearSession()
  }, [])

  return (
    <div className="py-24">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Order placerad! {orderId ? `#${orderId}` : ""}</h1>
        <p className="text-gray-600">
          Du kan nu följa din orderstatus och hantera dina köp på ditt <br />
          konto. Vi skickar en orderbekräftelse till din e-post inom kort.
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <Button variant="outline" size="lg">
          <SuperLink href="/"> Fortsätt handla</SuperLink>
        </Button>
        <Button size="lg" asChild>
          <SuperLink href={`/account/orders/`}>Se orderöversikt</SuperLink>
        </Button>
      </div>
      {orderId !== undefined && <WalleyPayment isConfirmationPage />}
    </div>
  )
}
