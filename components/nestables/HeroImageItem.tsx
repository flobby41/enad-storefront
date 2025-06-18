"use server"
import { GetProductLinkServerSide } from "@/hooks/use-product-link-server"
import { SuperLink } from "@enadhq/commerce/storefront"
import { Story } from "@enadhq/commerce/storyblok"
import { storyblokEditable } from "@storyblok/react/rsc"
import { draftMode } from "next/headers"
import {
  ButtonItemStoryblok,
  HeroImageItemStoryblok,
  HeroImageStoryblok,
} from "../../types/component-types-sb"
import AssetsWrapper from "./AssetsWrapper"
import ContentItem from "./ContentItem"

type HeroImageItemProps = {
  blok: HeroImageItemStoryblok
  heroImageParent: HeroImageStoryblok
  index: number
}

const locale = process.env.NEXT_PUBLIC_LANG as string

export async function getTranslatedSlug(story: Story | ButtonItemStoryblok) {
  const translatedItem = story?.translated_slugs?.find(
    (slug: { lang: string }) => slug.lang === locale
  )
  let path = translatedItem?.path || `/${story?.full_slug?.replace(`${locale}/`, "")}`
  if (path.endsWith("/")) {
    path = path.slice(0, -1)
  }
  return path.startsWith("/") ? path : `/${path}`
}

export default async function HeroImageItem({ blok, heroImageParent, index }: HeroImageItemProps) {
  const { isEnabled: isDraft } = await draftMode()

  let link: string | ""

  if (!isDraft) {
    link = blok?.link?.cached_url?.includes("#product_")
      ? await GetProductLinkServerSide(blok?.link?.cached_url?.split("#product_")[1] || "")
      : `${
          blok?.link?.story
            ? `${await getTranslatedSlug(blok?.link?.story)}`
            : blok?.link?.cached_url?.replace(`/${locale}/`, "") || blok?.link?.url
        }${blok?.link?.anchor ? `/#${blok?.link?.anchor}` : ""}`
  }

  return (
    <div className="relative" {...storyblokEditable(blok)}>
      {blok?.link?.cached_url && link && !blok?.contentItems?.length ? (
        <SuperLink aria-label={`Go to xx ${link}`} href={link}>
          <AssetsWrapper blok={blok} heroImageParent={heroImageParent} />
        </SuperLink>
      ) : (
        <AssetsWrapper blok={blok} heroImageParent={heroImageParent} />
      )}

      {blok.contentItems &&
        blok.contentItems.map((nestedBlok, i) => (
          <ContentItem
            indexContentItem={i}
            index={index}
            blok={nestedBlok}
            key={nestedBlok._uid}
            link={link}
          />
        ))}
    </div>
  )
}
