"use client"

import { Button } from "@/components/ui/button"
import {
  createBrinkOrder,
  useBrink,
  useCheckout,
  useStartCheckout,
  WalleyPayment,
} from "@enadhq/commerce/brink"
import {
  cartToGA4EcomItem,
  EnadOrganisation,
  EnadUser,
  trackGA4BeginCheckout,
} from "@enadhq/commerce/enad"
import { CustomerInformationCard, localizedPrice, Voucher } from "@enadhq/commerce/storefront"
import { getCookie } from "cookies-next"
import { AlertCircle, CreditCard, FileText, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useTransition } from "react"

import CartItem from "@/components/cart-item"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { MIN_BRANDING_QUANTITY } from "@/data/branding-pricing"
import { useCustomerInformationCardData } from "@/hooks/useCustomerInformationCardData"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import ErrorDisplay from "./error-display"

const shippingOptions = [
  {
    id: "free",
    name: "Free Shipping",
    description: "Free shipping",
    taxGroupId: "69a97550-0fd5-4c5f-9169-3869d6e6889c",
    price: 0,
  },
  {
    id: "standard",
    name: "Standard",
    description: "Paketet skickas från vårt Tryckeri efter 10 arbetsdagar",
    taxGroupId: "69a97550-0fd5-4c5f-9169-3869d6e6889c",
    price: 25000,
  },
]

export default function CheckoutComponent({
  market,
  user,
  organisations,
}: {
  user: EnadUser
  market: any
  organisations: EnadOrganisation[]
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingCreateOrder, setIsLoadingCreateOrder] = useState<boolean>(false)
  const router = useRouter()
  const [showError, setShowError] = useState(null)

  const {
    selectedUser,
    selectedCompany,
    setSelectedUser,
    selectedBillingAddress,
    handleSelectBillingAddress,
    selectedShippingAddress,
    handleSelectShippingAddress,
    selectedCompanyObj,
    selectedUserObj,
    selectedBillingAddressObj,
    selectedShippingAddressObj,
    organisationUsers,
    handleCompanyChange,
  } = useCustomerInformationCardData(user, organisations)

  const [isUpdatePending, startUpdateTransition] = useTransition()
  const { mutateAsync: startCheckout } = useStartCheckout({
    selectedUser:
      user?.organisations?.find((o) => o.id === selectedCompany)?.role === "agent"
        ? selectedUserObj
        : user,
    selectedCompany: selectedCompanyObj,
    selectedBillingAddress: selectedBillingAddressObj,
    selectedShippingAddress: selectedShippingAddressObj,
  })
  const { session } = useBrink()
  const checkoutData = useCheckout(true)
  const checkoutToken = getCookie("checkoutToken")
  const selectedCompanyIsCreditValid = organisations.find(
    (org) => org.id === selectedCompany && org.credit_check === true
  )
  const [paymentMethod, setPaymentMethod] = useState(
    selectedCompanyIsCreditValid ? "invoice" : "online"
  )
  const [shippingOption, setShippingOption] = useState("standard")
  // Check if session.cart has a discount rule with outcome type FREESHIPPING
  const hasFreeShipping = session?.cart?.discountCodes?.some((rule: any) =>
    rule?.outcomes?.some((outcome: any) => outcome?.type === "FREESHIPPING")
  )

  useEffect(() => {
    if (selectedCompanyObj?.credit_check === false) {
      setPaymentMethod("online")
    }
  }, [selectedCompanyObj])

  useEffect(() => {
    if (hasFreeShipping) {
      setPaymentMethod("invoice")
      setShippingOption("free")
    }
  }, [hasFreeShipping])

  useEffect(() => {
    if (session) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [session])

  const EmptyCart = () => (
    <div className="text-center py-28">
      <h1 className="font-bold text-2xl md:text-4xl mb-4">Cart Empty</h1>
      <Button asChild>
        <Link href={"/"}>Continue Shopping</Link>
      </Button>
    </div>
  )

  const initCheckout = async () => {
    await startCheckout()
  }

  useEffect(() => {
    if (!checkoutToken && session && cartItems?.length > 0) {
      trackGA4BeginCheckout(
        orderItems?.map((product) => cartToGA4EcomItem({ product, overrideQty: product.quantity })),
        checkoutData?.checkout.currencyCode
      )

      initCheckout()
    }
  }, [session, checkoutToken])

  const selectedShippingOption = shippingOptions.find((c) => c.id === shippingOption)

  const cartItems = [...(session?.cart.items || []), ...(session?.giftCardProducts || [])]
  const orderItems = checkoutData?.checkout.items || cartItems || []
  const total =
    paymentMethod === "invoice"
      ? (selectedShippingOption?.price ?? 0) +
        checkoutData?.checkout.totals.grandTotal -
        checkoutData?.checkout.totals.shippingTotal
      : checkoutData?.checkout.totals.grandTotal

  const shippingTotal =
    paymentMethod === "invoice"
      ? selectedShippingOption?.price ?? 0
      : checkoutData?.checkout.totals.shippingTotal

  const subTotal = checkoutData?.checkout?.totals.subTotal || 0
  const discountTotal = checkoutData?.checkout?.totals.discountTotal
  console.log("Checkout Data", checkoutData)
  const is100PercentDiscount = total === 0
  console.log("is100PercentDiscount", is100PercentDiscount)
  console.log("total", total)
  console.log("Checkout Data", checkoutData)

  const hasBrandingProducts = cartItems.some((c) =>
    Object.entries(c.options).some(([key]) => key.includes("brandingAddon"))
  )
  const amountPrintableCartItems = cartItems
    .filter((c) => Object.entries(c.options).some(([key]) => key.includes("brandingAddon")))
    .reduce((sum, item) => sum + (item.quantity || 0), 0)

  const handleSubmitOrder = async () => {
    setIsLoadingCreateOrder(true)
    // if (isAgent && (!selectedCompany || !selectedUser)) {
    //   toast({
    //     title: "Error",
    //     description:
    //       "Please select both a company and a contact person for this order",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    // if (orderItems.length === 0) {
    //   toast({
    //     title: "Error",
    //     description: "Please add at least one product to the order",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    // In a real application, this would be an API call to create the order

    const order = {
      importId: Math.floor(Math.random() * 10000).toString(),
      date: new Date().toISOString(),
      countryCode: market.country,
      languageCode: market.language,
      currencyCode: market.currency,
      storeGroupId: market.storeGroupId,
      payment: {
        providerId: "providerId",
        providerName: "BrinkZeroPayment",
        reference: "1",
        method: "1",
      },
      isTaxIncludedInPrice: true,
      channelType: "B2B",
      isTaxExemptionEligible: true,
      isTaxExempt: true,
      taxationCountry: market.country,
      shippingAddress: {
        country: market.country,
        telephoneNumber: selectedShippingAddressObj?.phone || selectedCompanyObj?.phone,
        stateOrProvince: selectedShippingAddressObj?.state_province,
        streetAddress: selectedShippingAddressObj?.street_address,
        city: selectedShippingAddressObj?.city,
        givenName: selectedCompanyObj?.name,
        familyName: "-",
        postalCode: selectedShippingAddressObj?.postal_code,
        email: selectedCompanyObj?.email || selectedUserObj?.email || selectedUserObj?.email,
      },
      billingAddress: {
        country: market.country,
        telephoneNumber: selectedBillingAddressObj?.phone || selectedCompanyObj?.phone,
        stateOrProvince: selectedBillingAddressObj?.state_province,
        streetAddress: selectedBillingAddressObj?.street_address,
        city: selectedBillingAddressObj?.city,
        givenName: selectedCompanyObj?.name,
        familyName: "-",
        postalCode: selectedBillingAddressObj?.postal_code,
        email:
          selectedCompanyObj?.invoice_email || selectedCompanyObj?.email || selectedUserObj?.email,
      },
      shippingFees: [
        {
          id: selectedShippingOption?.id,
          name: selectedShippingOption?.name,
          taxGroupId: selectedShippingOption?.taxGroupId,
          taxPercentage: 2500,
          taxPercentageDecimals: 2,
          basePriceAmount: selectedShippingOption?.price,
          salePriceAmount: 0,
          discountAmount: 0,
          taxAmount: (selectedShippingOption?.price ?? 0) * 0.25,
        },
      ],
      shipping: {
        providerId: "providerId",
        providerName: "Ingrid",
        reference: "POSTEN",
      },
      orderLines: orderItems.map((item) => {
        const unitPrice = item.salePriceAmount
        const quantity = item.quantity
        const totalPriceAmount = unitPrice * quantity

        return {
          id: item.id,
          productParentId: item.productParentId,
          productVariantId: item.productVariantId,
          name: item.displayName || item.name,
          taxPercentage: item.taxPercentage,
          taxPercentageDecimals: 2,
          quantity,
          imageUrl:
            item?.imageUrl ||
            "https://media.enad.io/4ae9c252-0b14-490b-b65e-13a2a77c7d29/KIrQGR-placeholder.jpeg",
          basePriceAmount: item.basePriceAmount,
          salePriceAmount: is100PercentDiscount ? 0 : unitPrice,
          totalDiscountAmount: is100PercentDiscount
            ? item.basePriceAmount
            : item.totalDiscountAmount,
          totalPriceAmount: is100PercentDiscount ? 0 : totalPriceAmount,
          totalTaxAmount: is100PercentDiscount
            ? 0
            : Math.round(totalPriceAmount * (item.taxPercentage / 10000)),
          taxGroupId: selectedShippingOption?.taxGroupId,
          ...(item.options && { options: { ...item.options } }),
        }
      }),
      attributes: {
        merchantReference1: selectedCompanyObj?.organisation_number.replace("-", ""),
        ...(selectedCompanyObj?.external_ref && {
          merchantReference2: selectedCompanyObj?.external_ref,
        }),
        company: {
          name: selectedCompanyObj?.name,
          registrationNumber: selectedCompanyObj?.organisation_number,
          ...(selectedCompanyObj?.tax_id_vat_number && {
            taxId: selectedCompanyObj?.tax_id_vat_number,
          }),
          reference: selectedUserObj?.first_name + " " + selectedUserObj?.last_name,
        },
      },
      // totals: {
      //   subTotal: subTotal,
      //   shippingTotal: shippingTotal,
      //   taxTotal: checkoutData?.checkout.totals.taxTotal,
      //   grandTotal: total,
      //   discountTotal: discountTotal,
      //   bonusTotal: 0,
      //   giftCardTotal: 0,
      // },
    }

    const createOrder = await createBrinkOrder(order)

    if (createOrder.success) {
      setIsLoadingCreateOrder(false)
      router.push(`/checkout/confirmation/?orderId=${createOrder.data.orderReference}`)
    } else {
      setIsLoadingCreateOrder(false)
      setShowError(createOrder || "Ett fel uppstod vid skapandet av ordern.")
    }
  }

  return (
    <main className="mx-auto px-4 lg:px-6 pt-6 pb-10">
      <h1 className="text-3xl font-bold mb-6 uppercase">Kassa</h1>
      {isLoading ? (
        <div className="max-w-[700px] min-h-[300px] mx-auto p-4 flex items-center justify-center">
          <Loader2 className="w-52 animate-spin" />
        </div>
      ) : !cartItems?.length ? (
        <EmptyCart />
      ) : (
        <div className="grid gap-8 md:grid-cols-5">
          <div
            className={cn(
              "lg:col-span-3",
              hasBrandingProducts && amountPrintableCartItems < MIN_BRANDING_QUANTITY
                ? "pointer-events-none opacity-50"
                : ""
            )}
          >
            <div>
              <div className="space-y-8">
                {user?.id && (
                  <CustomerInformationCard
                    organisations={organisations}
                    selectedCompany={selectedCompany}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    selectedBillingAddress={selectedBillingAddress}
                    handleSelectBillingAddress={handleSelectBillingAddress}
                    selectedShippingAddress={selectedShippingAddress}
                    handleSelectShippingAddress={handleSelectShippingAddress}
                    selectedCompanyObj={selectedCompanyObj}
                    selectedUserObj={selectedUserObj}
                    selectedBillingAddressObj={selectedBillingAddressObj}
                    selectedShippingAddressObj={selectedShippingAddressObj}
                    handleCompanyChange={handleCompanyChange}
                    organisationUsers={organisationUsers?.items || []}
                    style={{
                      cardClassName: "rounded-none",
                      selectClassName: "rounded-none",
                      cardTitle: "uppercase text-lg font-bold",
                    }}
                    user={user}
                    translations={{
                      cardTitle: "Företagsinformation",
                      cardDescription:
                        "Hantera dina företagsuppgifter och faktureringsinformation.",
                      company: "Företag",
                      selectCompany: "Välj företag",
                      selectUser: "Välj användare",
                      billingInformation: "Faktureringsinformation",
                      billingAddress: "Faktureringsadress",
                      shippingInformation: "Leveransinformation",
                      shippingAddress: "Leveransadress",
                      selectShippingAddress: "Välj leveransadress",
                      selectBillingAddress: "Välj faktureringsadress",
                      organisationNumber: "Organisationsnummer",
                      taxId: "Momsregistreringsnummer",
                      invoice_email: "Faktura-e-post",
                    }}
                  />
                )}
                <Card className="rounded-none">
                  <CardHeader>
                    <CardTitle>Betalningsmetod</CardTitle>
                    <CardDescription>Välj hur du vill betala din beställning.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      defaultValue="online"
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <RadioGroupItem
                          value="online"
                          id="online"
                          className="peer sr-only"
                          disabled={hasFreeShipping}
                        />
                        <Label
                          htmlFor="online"
                          className="flex flex-col items-center justify-between  border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <CreditCard className="mb-3 h-6 w-6" />
                          Onlinebetalning
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem
                          value="invoice"
                          id="invoice"
                          className="peer sr-only"
                          disabled={
                            !user?.id || !organisations?.length || !selectedCompanyIsCreditValid
                          }
                        />
                        <Label
                          htmlFor="invoice"
                          className="flex flex-col items-center justify-between  border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <FileText className="mb-3 h-6 w-6" />
                          Faktura
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {paymentMethod === "online" ? (
                  <Card className="rounded-none">
                    <CardHeader>
                      <CardTitle>Onlinebetalning</CardTitle>
                      <CardDescription>Säker betalning med Walley.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border p-4 bg-muted/20 ">
                        <WalleyPayment isVisible={paymentMethod === "online"} />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {/* Shipping Options */}
                    <Card className="rounded-none">
                      <CardHeader>
                        <CardTitle>Frakt</CardTitle>
                        <CardDescription>
                          Välj hur du vill att vi ska skicka din beställning.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup
                          defaultValue="standard"
                          value={shippingOption}
                          onValueChange={setShippingOption}
                          className="space-y-3"
                        >
                          {(() => {
                            const options = hasFreeShipping
                              ? shippingOptions
                              : shippingOptions.filter((s) => s.id !== "free")

                            return options.map((option) => (
                              <div
                                key={option?.id}
                                className="flex items-center space-x-2 border  p-4"
                              >
                                <RadioGroupItem value={option?.id} id={option?.id} />
                                <Label htmlFor={option?.id} className="flex flex-1 justify-between">
                                  <div>
                                    <p className="font-medium">{option?.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {option?.description}
                                    </p>
                                  </div>
                                  <div className="font-medium">
                                    {localizedPrice(
                                      option.price,
                                      false,
                                      market.language,
                                      market.currency
                                    )}
                                  </div>
                                </Label>
                              </div>
                            ))
                          })()}
                        </RadioGroup>
                      </CardContent>
                    </Card>
                    <ErrorDisplay
                      error={showError ? showError : null}
                      onDismiss={() => setShowError(null)}
                    />

                    <Button
                      onClick={handleSubmitOrder}
                      className="w-full btn-primary"
                      size={"lg"}
                      disabled={isLoadingCreateOrder}
                    >
                      Lägg order
                      {isLoadingCreateOrder && (
                        <Loader2 className="ml-2 h-4 w-4 animate-spin text-white" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 w-full">
            <Card className={cn("rounded-none sticky top-4", isLoading && "animate-pulse")}>
              <CardHeader className="border-b p-4">
                <CardTitle>Summering</CardTitle>
              </CardHeader>
              <CardContent className="overflow-auto px-0">
                {hasBrandingProducts && amountPrintableCartItems < MIN_BRANDING_QUANTITY && (
                  <div className="bg-amber-50 p-3 flex items-start mb-2">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 shrink-0 mt-0.5" />
                    <p className="text-sm">
                      För tryck och brodyr krävs minst {MIN_BRANDING_QUANTITY} exemplar. Du har valt{" "}
                      {amountPrintableCartItems} st.
                    </p>
                  </div>
                )}
                <div className="">
                  {cartItems
                    ?.filter(
                      (c) =>
                        !Object.entries(c.options).some(([key]) => key.includes("brandingAddon"))
                    )
                    .map((item) => (
                      <CartItem key={item.id} item={item} market={market} />
                    ))}
                </div>
                <Voucher
                  style={{
                    className: "border-b mb-4",
                  }}
                  settings={{
                    giftCardEnabled: false,
                  }}
                  translations={{
                    subTotal: "Delsumma",
                    cardTitle: "Orderöversikt",
                    shipping: "Frakt",
                    discount: "Rabatt",
                    total: "Totalsumma",
                    voucher: {
                      apply: "Lägg till",
                      promoCode: "Rabattkod",
                      placeholder: "Ange rabattkod",
                      terms: "En rabattkod kan inte kombineras med andra rabatter.",
                      used: "Aktiverad rabattkod",
                    },
                    giftCard: {
                      giftCard: "Presentkort",
                      pin: "PIN",
                      code: "Kod",
                      used: "Aktiv kod",
                    },
                    error: {
                      missingDiscount: "Vänligen ange en rabattkod.",
                      conditionDiscount: "Denna rabatt kan inte användas.",
                      conditionDiscountExternal: "Denna rabattkod är inte giltig här.",
                      expiredDiscount: "Denna rabattkod har gått ut.",
                      alreadyAddedDiscount: "Denna rabattkod är redan tillagd.",
                      discountIsInactive: "Denna rabatt är inaktiv.",
                      discountBadRequest: "Ogiltig rabattkod.",
                      unableAddUpdateGiftcard:
                        "Det gick inte att lägga till eller uppdatera presentkort.",
                      giftCardInsufficientBalance: "Otillräckligt saldo på presentkortet.",
                    },
                  }}
                  activeCodes={
                    checkoutData?.checkout.discountCodes.map(
                      (discountCode: { code: any }) => discountCode.code
                    ) || []
                  }
                  activeGiftCards={
                    checkoutData?.checkout.giftCards.map((giftcard: { id: any }) => giftcard.id) ||
                    []
                  }
                />
                {checkoutData ? (
                  <div className="px-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="">Delsumma</span>
                      {localizedPrice(subTotal, false, market.language, market.currency)}
                    </div>
                    <div className="flex justify-between">
                      <span className="">Frakt</span>
                      {localizedPrice(shippingTotal, false, market.language, market.currency)}
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="">Rabatt</span>
                      {localizedPrice(discountTotal, false, market.language, market.currency)}
                    </div>
                    <div className="flex justify-between">
                      <span className="">Moms 25%</span>
                      {localizedPrice(
                        checkoutData?.checkout.totals.taxTotal,
                        false,
                        market.language,
                        market.currency
                      )}
                    </div>
                    <div className="flex justify-between mt-2 font-bold text-lg p-4 bg-gray-100">
                      <span>Totalt</span>
                      <span>{localizedPrice(total, false, market.language, market.currency)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 space-y-4">
                    {[...Array(4)].map((_, index) => (
                      <Skeleton key={index} className="h-8 w-full" />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </main>
  )
}
