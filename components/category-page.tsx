"use server"

import ProductCard from "@/components/product-card"
import { CategoryStoryblok, SettingsStoryblok } from "@/types/component-types-sb"
import { getAllVariants, getCategoryByUri } from "@enadhq/commerce/backend"
import { ISbStoryData } from "@storyblok/react"
import RenderComponent from "./content-types/Render-component"

export default async function CategoryPageContent({
  story,
  blok,
  selectedMarket,
  params,
  settings,
  searchParams,
}: {
  story: ISbStoryData
  blok: CategoryStoryblok
  selectedMarket: any
  params: { slug: string[]; lang: string }
  settings: SettingsStoryblok
  searchParams: Record<string, string>
}) {
  const slugString = params.slug.filter((s) => s !== "c").join("/")

  const category = await getCategoryByUri(
    selectedMarket.enadMarket,
    slugString ?? "",
    selectedMarket.language,
    1,
    20,
    false,
    slugString ?? ""
  )

  const products = await getAllVariants(
    selectedMarket.enadMarket,
    selectedMarket.language,
    1,
    20,
    true,
    undefined, // cacheKey
    undefined, // sort
    undefined, // sku
    undefined, // variant_name
    undefined, // collection
    undefined, // tag
    undefined, // slug
    undefined, // brand
    undefined, // serie
    undefined, // category
    undefined, // smart_list
    undefined, // static_list
    undefined, // not_in_sku
    undefined, // not_in_category
    undefined, // not_in_collection
    undefined, // not_in_tag
    undefined, // not_in_brand
    undefined, // not_in_serie
    undefined, // price_gte
    undefined, // price_lte
    undefined, // attributes
    category?.id ? [category.id] : undefined, // category_id as array
    undefined, // not_in_category_id
    ["color"], // has_attribute_template
    undefined // search
  )

  console.log("Category products:", products)

  return (
    <div className="py-6 md:py-10 px-4 lg:px-6">
      <h1 className="text-lg font-bold mb-6 uppercase">{category?.name}</h1>
      <div className="space-y-6">
        <RenderComponent
          selectedMarket={selectedMarket}
          blok={blok}
          story={story}
          settings={settings}
          searchParams={searchParams}
          position="top"
        />
        {/* Product grid */}
        <div className="grid lg:grid-cols-3 grid-cols-2 gap-4 md:gap-6">
          {category?.products?.data?.map((product) => (
            <ProductCard key={product.id} product={product} market={selectedMarket} />
          ))}
        </div>
        <RenderComponent
          selectedMarket={selectedMarket}
          blok={blok}
          story={story}
          settings={settings}
          searchParams={searchParams}
          position="bottom"
        />
      </div>
    </div>
  )
}
