import Sidebar from "@/components/sidebar"
import WishlistSheet from "@/components/wishlist-sheet"
import { MARKETS } from "@/constants/markets"
import { EnadProvider } from "@enadhq/commerce/content"
import { getMarketData } from "@enadhq/commerce/storefront"
import type { Metadata } from "next"
import type React from "react"
import { Suspense } from "react"
import "./globals.css"

import Footer from "@/components/footer"
import Header from "@/components/header"
import { SettingsStoryblok } from "@/types/component-types-sb"
import { getCategoryTree } from "@enadhq/commerce/backend"
import { getStoryByRest } from "@enadhq/commerce/storyblok"
import { ISbStoryData } from "@storyblok/react"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { draftMode } from "next/headers"
import { NuqsAdapter } from "nuqs/adapters/next"
import { Toaster } from "sonner"
import { defaultVersion } from "./[...slug]/page"

export const metadata: Metadata = {
  title: "Lager 157 WORK - Product Detail",
  description: "Product detail page for Lager 157 WORK e-commerce store",
  generator: "v0.dev",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { selectedMarket, markets } = await getMarketData(MARKETS)
  const { isEnabled: isDraft } = await draftMode()
  const version = isDraft ? "draft" : defaultVersion
  const cache = isDraft ? "no-store" : "force-cache"

  const categories = await getCategoryTree(selectedMarket.enadMarket, selectedMarket.language)

  const settings = (await getStoryByRest(
    `settings`,
    selectedMarket.language,
    version,
    "story",
    "",
    cache
  )) as ISbStoryData

  return (
    <html lang="en">
      <body>
        <EnadProvider market={selectedMarket?.enadMarket} language={selectedMarket?.language}>
          <NuqsAdapter>
            <div className="">
              <div className="lg:hidden">
                <Header />
              </div>
              <div className="lg:block hidden">
                <Sidebar
                  settings={settings?.content as SettingsStoryblok}
                  market={selectedMarket}
                  categories={categories}
                />
              </div>
              <div className="w-full lg:min-h-screen lg:pl-[300px]">
                <Suspense>
                  <main>{children}</main>
                </Suspense>
              </div>
              <Footer />
              <WishlistSheet market={selectedMarket} />
            </div>
            <Toaster />
          </NuqsAdapter>
          <ReactQueryDevtools initialIsOpen={false} />
        </EnadProvider>
      </body>
    </html>
  )
}
