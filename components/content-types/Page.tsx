"use server"

import { PageStoryblok } from "@/types/component-types-sb"
import { ISbStoryData } from "@storyblok/react"
import RenderComponent from "./Render-component"

type Props = {
  story: ISbStoryData
  blok: PageStoryblok
  settings: any
  searchParams: Record<string, string>
  selectedMarket: any
}

const StoryPage = async ({ blok, story, settings, searchParams, selectedMarket }: Props) => {
  return (
    <RenderComponent
      selectedMarket={selectedMarket}
      blok={blok}
      story={story}
      settings={settings}
      searchParams={searchParams}
    />
  )
}
export default StoryPage
