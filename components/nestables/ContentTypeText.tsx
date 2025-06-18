/* eslint-disable react/no-danger */

import { cn } from "@/lib/utils"
import { ContentTypeRichtextStoryblok, ContentTypeTextStoryblok } from "@/types/component-types-sb"
import { SuperLink } from "@enadhq/commerce/storefront"
import { storyblokEditable } from "@storyblok/react"
import { Fragment, JSX } from "react"
import { render } from "storyblok-rich-text-react-renderer-ts"

type Props = {
  blok: ContentTypeTextStoryblok | ContentTypeRichtextStoryblok
  type?: string
  children?: any
  link?: string
}

export default function ContentText({ blok, type, children, link }: Props) {
  let desktopFontSize = "size-3"
  let mobileFontSize = "size-3"
  let desktopColor = "text-white"
  let mobileColor = "text-white"
  let desktopLineHeight = "leading-[140%]"
  let mobileLineHeight = "leading-[140%]"
  let desktopFontWeight = "font-bold"
  let mobileFontWeight = "font-bold"
  let letterSpacing = "tracking-normal"

  // Font size size-1 Desktop
  if (blok?.letterSpacing === "wide") {
    letterSpacing = "tracking-[6px]"
  }

  if (blok?.font_weight_desktop === "extraBold") desktopFontWeight = "md:font-extraBold"
  if (blok?.font_weight_desktop === "bold") desktopFontWeight = "md:font-bold"
  if (blok?.font_weight_desktop === "semiBold") desktopFontWeight = "md:font-semibold"
  if (blok?.font_weight_desktop === "medium") desktopFontWeight = "md:font-medium"
  if (blok?.font_weight_desktop === "regular") desktopFontWeight = "md:font-normal"
  if (blok?.font_weight_desktop === "light") desktopFontWeight = "md:font-light"

  if (blok?.font_weight_desktop === "extraBold") mobileFontWeight = "font-extraBold"
  if (blok?.font_weight_desktop === "bold") mobileFontWeight = "font-bold"
  if (blok?.font_weight_desktop === "semiBold") mobileFontWeight = "font-semibold"
  if (blok?.font_weight_desktop === "medium") mobileFontWeight = "font-medium"
  if (blok?.font_weight_desktop === "regular") mobileFontWeight = "font-normal"
  if (blok?.font_weight_desktop === "light") mobileFontWeight = "font-light"

  if (blok?.color_desktop === "white") desktopColor = "md:text-white"
  if (blok?.color_desktop === "black") desktopColor = "md:text-black"
  if (blok?.color_mobile === "white") mobileColor = "text-white"
  if (blok?.color_mobile === "black") mobileColor = "text-black"

  if (blok?.font_size_desktop === "size-1") desktopFontSize = "md:text-xxs"
  if (blok?.font_size_mobile === "size-1") mobileFontSize = "text-xxs"
  if (blok?.font_size_desktop === "size-2") desktopFontSize = "md:text-xs"
  if (blok?.font_size_mobile === "size-2") mobileFontSize = "text-xs"
  if (blok?.font_size_desktop === "size-3") desktopFontSize = "md:text-sm"
  if (blok?.font_size_mobile === "size-3") mobileFontSize = "text-sm"
  if (blok?.font_size_desktop === "size-4") desktopFontSize = "md:text-base"
  if (blok?.font_size_mobile === "size-4") mobileFontSize = "text-base"
  if (blok?.font_size_desktop === "size-5") desktopFontSize = "md:text-2xl"
  if (blok?.font_size_mobile === "size-5") mobileFontSize = "text-2xl"
  if (blok?.font_size_desktop === "size-6") desktopFontSize = "md:text-3xl"
  if (blok?.font_size_mobile === "size-6") mobileFontSize = "text-3xl"
  if (blok?.font_size_desktop === "size-7") desktopFontSize = "md:text-6xl"
  if (blok?.font_size_mobile === "size-7") mobileFontSize = "text-6xl"
  if (blok?.font_size_desktop === "size-8") desktopFontSize = "md:text-8xl"
  if (blok?.font_size_mobile === "size-8") mobileFontSize = "text-8xl"
  if (blok?.font_size_desktop === "size-9") desktopFontSize = "md:text-9xl"
  if (blok?.font_size_mobile === "size-9") mobileFontSize = "text-9xl"

  // Font size size-1 Desktop
  if (blok?.font_size_desktop === "size-1") {
    desktopLineHeight = "md:leading-[140%]"
  }
  // Font size size-1 Mobile
  if (blok?.font_size_mobile === "size-1") {
    mobileLineHeight = "leading-[140%]"
  }

  // Font size size-2 Desktop
  if (blok?.font_size_desktop === "size-2") {
    desktopLineHeight = "md:leading-[140%]"
  }
  // Font size size-2 Mobile
  if (blok?.font_size_mobile === "size-2") {
    mobileLineHeight = "leading-[140%]"
  }

  // Font size size-3 Desktop
  if (blok?.font_size_desktop === "size-3") {
    desktopLineHeight = "md:leading-[140%]"
  }
  // Font size size-3 Mobile
  if (blok?.font_size_mobile === "size-3") {
    mobileLineHeight = "leading-[140%]"
  }

  // Font size Medium Desktop
  if (blok?.font_size_desktop === "size-5") {
    desktopLineHeight = "md:leading-[130%]"
  }
  // Font size Medium Mobile
  if (blok?.font_size_mobile === "size-5") {
    mobileLineHeight = "leading-[130%]"
  }

  // Font size Large Desktop
  if (blok?.font_size_desktop === "size-6") {
    desktopLineHeight = "md:leading-[140%]"
  }
  // Font size Large Mobile
  if (blok?.font_size_mobile === "size-6") {
    mobileLineHeight = "leading-[140%]"
  }

  // Font size Extra Large Desktop
  if (blok?.font_size_desktop === "size-7") {
    desktopLineHeight = "md:leading-[110%]"
  }
  // Font size Large Mobile
  if (blok?.font_size_mobile === "size-7") {
    mobileLineHeight = "leading-[110%]"
  }

  // Font size Exra Extra Large Desktop
  if (blok?.font_size_desktop === "size-8") {
    desktopLineHeight = "md:leading-[90%]"
  }
  // Font size Large Mobile
  if (blok?.font_size_mobile === "size-8") {
    mobileLineHeight = "leading-[110%]"
  }

  // Font size Exra Exra Extra Large Desktop
  if (blok?.font_size_desktop === "size-9") {
    desktopLineHeight = "md:leading-[90%]"
  }
  // Font size Large Mobile
  if (blok?.font_size_mobile === "size-9") {
    mobileLineHeight = "leading-[110%]"
  }

  const classes = cn(
    "text-shadow-[0_35px_35px_rgb(0_0_0_/_0.25)]",
    blok?.hidden_mobile && blok?.hidden_desktop ? "hidden" : "",
    blok?.hidden_desktop && !blok?.hidden_mobile ? "lg:hidden" : "",
    blok?.hidden_mobile && !blok?.hidden_desktop ? "hidden lg:block" : "",
    blok?.uppercase ? "uppercase" : "",
    mobileFontWeight,
    desktopFontWeight,
    desktopColor,
    mobileColor,
    desktopFontSize,
    mobileFontSize,
    desktopLineHeight,
    mobileLineHeight,
    letterSpacing
  )

  if (!blok?.text) return null

  const Tag = (blok?.header_type || "span") as keyof JSX.IntrinsicElements

  const content =
    blok?.component === "contentTypeRichtext" ? (
      <div
        {...storyblokEditable(blok)}
        className={cn(
          "relative [&_*]:leading-normal !w-auto !h-auto",
          "[&_h4]:lg:text-[18px] [&_h4]:text-[16px] ",
          "[&_h5]:lg:text-[12px] [&_h5]:text-[12px] ",
          "[&_h3]:lg:text-[28px] [&_h3]:text-[28px] ",
          "[&_p]:lg:text-[24px] [&_p]:text-base [&_p]:font-normal",
          classes
        )}
      >
        {render(blok?.text)}
      </div>
    ) : (
      <div className="relative block" {...storyblokEditable(blok)}>
        <Tag
          className={classes}
          dangerouslySetInnerHTML={{
            __html: blok?.text?.replace(/(?:\r\n|\r|\n)/g, "<br>"),
          }}
        />
      </div>
    )

  return link ? (
    <SuperLink aria-label={`Go to ${link}`} className="block" href={link}>
      {content}
    </SuperLink>
  ) : (
    <Fragment>{content}</Fragment>
  )
}
