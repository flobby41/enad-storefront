"use server"

import { CategoryStoryblok, PageStoryblok } from "@/types/component-types-sb"
import { ISbStoryData, storyblokEditable } from "@storyblok/react"
import ComponentsMap from "./components-list"

type Props = {
  story: ISbStoryData
  blok: PageStoryblok | CategoryStoryblok
  settings: any
  searchParams?: Record<string, string>
  position?: "top" | "bottom"
  selectedMarket: any
}

const RenderComponent = async ({
  story,
  blok,
  settings,
  searchParams,
  position,
  selectedMarket,
}: Props) => {
  const body = position === "top" ? blok?.bodyTop : blok?.body
  const components = body
    ? await Promise.all(
        body.map(async (nestedBlok: { component: string | number; _uid: any }, index: number) => {
          const Component = ComponentsMap[nestedBlok.component]
          if (Component) {
            return (
              <Component
                key={nestedBlok?._uid}
                blok={nestedBlok}
                story={story}
                settings={settings}
                searchParams={searchParams}
                index={index}
                selectedMarket={selectedMarket}
              />
            )
          }
          return null
        })
      )
    : []

  return (
    <div className="" {...storyblokEditable(blok)}>
      {components}
    </div>
  )
}
export default RenderComponent
