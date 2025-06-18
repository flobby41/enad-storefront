"use server"

import { MARKETS } from "@/constants/markets"
import { getProductsBySkusServerSide } from "@enadhq/commerce/backend"

export async function GetProductLinkServerSide(sku: string) {
  const locale = process.env.NEXT_PUBLIC_LANG as string
  const market = MARKETS[locale as keyof typeof MARKETS]?.enadMarket
  const language = MARKETS[locale as keyof typeof MARKETS]?.language

  const productResponse = await getProductsBySkusServerSide(market, language, sku, sku)

  console.log("Product Response:", productResponse)

  if (!sku) return ""

  return `/p/${productResponse?.data?.[0]?.slug}` || ""
}
