"use server"

import { Params } from "@/app/[...slug]/page"
import { CategoryStoryblok, PageStoryblok, SettingsStoryblok } from "@/types/component-types-sb"
import { ISbStoryData } from "@storyblok/react"
import { notFound } from "next/navigation"
import CategoryPageContent from "../category-page"
import Page from "./Page"

type Props = {
  story: ISbStoryData
  settings: SettingsStoryblok
  searchParams: Record<string, string>
  params: Params
  selectedMarket: any
}

const RenderPageType = async ({
  params,
  story,
  settings,
  searchParams,
  selectedMarket,
}: Props): Promise<any> => {
  let renderedPage: any | null = Page({
    story,
    blok: story.content as PageStoryblok,
    settings,
    searchParams,
    selectedMarket,
  })

  if (story.content.component === "Category") {
    renderedPage = await CategoryPageContent({
      blok: story.content as CategoryStoryblok,
      story,
      settings,
      searchParams,
      params,
      selectedMarket,
    })
  }

  if (!renderedPage) {
    console.error("No page component found for", story.content.component)
    console.error("renderedPage:", renderedPage)
    notFound()
  }

  return renderedPage
}

export default RenderPageType
