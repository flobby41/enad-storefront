import { ContentItemStoryblok } from "@/types/component-types-sb"
import { SuperLink } from "@enadhq/commerce/storefront"
import { storyblokEditable } from "@storyblok/react"
import { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { twMerge } from "tailwind-merge"

type Props = {
  positions: ContentItemStoryblok
  children: ReactNode
  link?: string
  targetLink?: string
  index?: number
  blokIndex?: number
}

export default function ContentPosition({
  positions,
  children,
  link,
  targetLink,
  index,
  blokIndex,
}: Props) {
  let desktopPosition = "md:top-left"
  let mobilePosition = "top-left"

  if (positions?.position_desktop === "top-left")
    desktopPosition =
      "md:translate-y-0 md:translate-x-0 md:left-0 md:top-0 md:bottom-auto md:right-auto md:items-start md:justify-start"
  if (positions?.position_desktop === "top-center")
    desktopPosition =
      "md:translate-y-0 md:-translate-x-1/2 md:bottom-auto md:left-1/2 md:top-0 md:items-start md:justify-center"
  if (positions?.position_desktop === "top-right")
    desktopPosition =
      "md:translate-y-0 md:translate-x-0 md:right-0 md:top-0 md:bottom-auto md:left-auto md:items-start md:justify-end"
  if (positions?.position_desktop === "middle-left")
    desktopPosition = "md:-translate-y-1/2 md:top-1/2 md:bottom-auto md:left-0 md:justify-start"
  if (positions?.position_desktop === "middle-center")
    desktopPosition =
      "md:-translate-y-1/2 md:top-1/2 md:-translate-x-1/2 md:left-1/2 md:justify-center md:bottom-auto"
  if (positions?.position_desktop === "middle-right")
    desktopPosition =
      "md:-translate-y-1/2 md:translate-x-0 md:bottom-auto md:top-1/2 md:right-0 md:justify-end md:w-auto"
  if (positions?.position_desktop === "bottom-left")
    desktopPosition =
      "md:translate-0 md:translate-x-0 md:bottom-0 md:top-auto md:left-0 md:items-end md:justify-start"
  if (positions?.position_desktop === "bottom-center")
    desktopPosition =
      "md:translate-0 md:bottom-0 md:top-auto md:-translate-x-1/2 md:left-1/2 md:items-end md:justify-center"
  if (positions?.position_desktop === "bottom-right")
    desktopPosition =
      "md:translate-0 md:translate-x-0 md:bottom-0 md:top-auto md:left-auto md:right-0 md:items-end md:justify-end"

  if (positions?.position_mobile === "top-left")
    mobilePosition = "items-start left-0 right-auto top-0 bottom-auto"
  if (positions?.position_mobile === "top-center")
    mobilePosition = "translate-y-0 top-0 -translate-x-1/2 left-1/2 items-start justify-center"
  if (positions?.position_mobile === "top-right")
    mobilePosition = "items-start justify-end right-0 left-auto"
  if (positions?.position_mobile === "middle-left")
    mobilePosition = " items-center left-0 right-auto -translate-y-1/2 top-1/2"
  if (positions?.position_mobile === "middle-center")
    mobilePosition =
      "-translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2 justify-center items-center"
  if (positions?.position_mobile === "middle-right")
    mobilePosition = " justify-end items-center -translate-y-1/2 top-1/2 right-0 left-auto w-auto"
  if (positions?.position_mobile === "bottom-left")
    mobilePosition = " items-end justify-start left-0 right-auto bottom-0 top-auto"
  if (positions?.position_mobile === "bottom-center")
    mobilePosition =
      "translate-y-0 -translate-x-1/2 left-1/2 justify-center items-end bottom-0 top-auto"
  if (positions?.position_mobile === "bottom-right")
    mobilePosition = "left-auto right-0 bottom-0 top-auto justify-end items-end"

  let desktopTextPosition = "md:text-left"
  let mobileTextPosition = "text-left"
  if (positions?.text_position_desktop === "left") desktopTextPosition = "md:text-left"
  if (positions?.text_position_desktop === "center") desktopTextPosition = "md:text-center"
  if (positions?.text_position_desktop === "right") desktopTextPosition = "md:text-right"

  if (positions?.text_position_mobile === "left") mobileTextPosition = "text-left"
  if (positions?.text_position_mobile === "center") mobileTextPosition = "text-center"
  if (positions?.text_position_mobile === "right") mobileTextPosition = "text-right"

  let desktopPadding = "md:p-4"
  let mobilePadding = "p-4"
  if (positions?.paddingDesktop === "extra_large") desktopPadding = "md:p-[60px]"
  if (positions?.paddingDesktop === "large") desktopPadding = "md:p-[40px]"
  if (positions?.mobilePadding === "large") mobilePadding = "p-[30px]"
  if (positions?.paddingDesktop === "medium") desktopPadding = "md:p-[30px]"
  if (positions?.mobilePadding === "medium") mobilePadding = "p-[20px]"
  if (positions?.paddingDesktop === "small") desktopPadding = "md:p-[20px]"
  if (positions?.mobilePadding === "default") mobilePadding = "p-4"

  return (
    <>
      <div
        className={twMerge(
          "absolute inset-0 w-full",
          desktopPosition,
          mobilePosition,
          desktopTextPosition,
          mobileTextPosition,
          positions?.hidden_mobile && positions?.hidden_desktop ? "hidden" : "",
          positions?.hidden_desktop && !positions?.hidden_mobile ? "flex lg:hidden" : "",
          positions?.hidden_mobile && !positions?.hidden_desktop ? "hidden lg:flex" : ""
        )}
        style={{
          zIndex: index ? 30 - index : 30,
          ...(positions.offset_y ? { marginTop: `${positions.offset_y}px` } : {}),
        }}
        {...storyblokEditable(positions)}
      >
        <div className={cn(desktopPadding, mobilePadding)}>{children}</div>
      </div>
      {link && (
        <SuperLink
          aria-label={`Go to ${link}`}
          target={targetLink}
          href={link}
          className={twMerge(
            "absolute inset-0 !h-full !w-full z-30",
            desktopPosition,
            mobilePosition,
            desktopTextPosition,
            mobileTextPosition
          )}
        >
          {" "}
        </SuperLink>
      )}
    </>
  )
}
