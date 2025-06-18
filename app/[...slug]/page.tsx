import RenderPageType from "@/components/content-types/Render-page-type"
import { MARKETS } from "@/constants/markets"
import { SettingsStoryblok } from "@/types/component-types-sb"
import { getProductsBySkusServerSide } from "@enadhq/commerce/backend"
import { getMarketData } from "@enadhq/commerce/storefront"
import { StoryblokPreviewSyncer, getStoryByRest } from "@enadhq/commerce/storyblok"
import { ISbStoryData } from "@storyblok/react"
import { Metadata } from "next"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { Fragment } from "react"

export type Params = { lang: string; slug: string[] }
export type ParamsProps = { params: Promise<Params>; searchParams: Promise<Record<string, string>> }

export const defaultVersion = process.env.NEXT_PUBLIC_STORYBLOK_VERSION as "draft" | "published"
export const resolve_relations = "products.enadCategory"
export const revalidate = 86400

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[]; lang: string }>
  searchParams: Promise<any>
}): Promise<Metadata> {
  const { isEnabled } = await draftMode()
  const p = await searchParams
  const { slug, lang } = await params
  const slugString = slug ? slug?.join("/") : "home"
  const version = isEnabled ? "draft" : defaultVersion
  const cache = isEnabled ? "no-store" : "force-cache"
  const { selectedMarket } = await getMarketData(MARKETS, lang)
  const locale = selectedMarket.language

  let story: ISbStoryData | null = null
  if (!slugString?.startsWith("p/") && slugString !== "checkout") {
    story = (await getStoryByRest(
      slugString,
      p?.language ?? locale,
      version,
      "story",
      "",
      cache
    )) as ISbStoryData

    if (!story) {
      story = (await getStoryByRest(
        "not-found",
        p?.language ?? locale,
        version,
        "story",
        "",
        cache
      )) as ISbStoryData
    }
  }

  const translatedSlug = story?.translated_slugs?.find(
    (slug: { lang: string }) => slug.lang === locale
  )

  let product: any = null
  try {
    const productSlug = slugString?.replace(/^p\//, "")
    const sku = productSlug?.split("_").pop()
    if (slug && slugString.startsWith("p/")) {
      const productResponse = await getProductsBySkusServerSide(
        selectedMarket.enadMarket,
        locale,
        sku ?? "",
        sku ?? ""
      )
      product = productResponse?.data?.find((p) => p.product_number === sku)
    }
  } catch (err) {
    console.error("Error from getProduct", err)
  }

  let title =
    story?.content?.seo?.[0]?.metaTitle || `${translatedSlug?.name ?? story?.name} - 157 Work`

  let description = story?.content?.seo?.[0]?.metaDescription || ""
  if (product) {
    if (slugString === "checkout") {
      title = `Kassa | 157 Work`
    }
    if (slugString === "checkout/confirmation") {
      title = `Tack för din order | 157 Work`
    }
  }

  const Thumbnail = story?.content?.seo?.[0]?.metaImage?.filename + "/m/1080x0/filters:quality(70)"

  return {
    title: title,
    description: description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${slugString}/${
        p.page ? `?page=${p.page}` : ""
      }`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.157work.com/${slug?.join("/")}`,
      images: [{ url: Thumbnail, width: 1200, height: 630 }],
      type: "website",
    },
  }
}

export default async function Page(props: {
  params: Promise<Params>
  searchParams: Promise<Record<string, string>>
}) {
  const params = await props.params
  const lang = params.lang
  const slug = params.slug ? params.slug.join("/") : "home"
  const { selectedMarket } = await getMarketData(MARKETS, lang)
  const { isEnabled: isDraft } = await draftMode()
  const version = isDraft ? "draft" : defaultVersion
  const cache = isDraft ? "no-store" : "force-cache"
  const searchParams = await props.searchParams

  const language = searchParams?.language ? searchParams?.language : selectedMarket.language

  const story = (await getStoryByRest(
    slug,
    language,
    version,
    "story",
    resolve_relations,
    cache
  )) as ISbStoryData

  if (!story) {
    notFound()
  }

  const settings = (await getStoryByRest(
    `settings`,
    selectedMarket.language,
    version,
    "story",
    "",
    cache
  )) as SettingsStoryblok

  return (
    <Fragment>
      {isDraft && (
        <StoryblokPreviewSyncer pathToRevalidate={slug} resolve_relations={resolve_relations} />
      )}
      <RenderPageType
        params={params}
        story={story}
        settings={settings}
        searchParams={searchParams}
        selectedMarket={selectedMarket}
      />
    </Fragment>
  )
}
