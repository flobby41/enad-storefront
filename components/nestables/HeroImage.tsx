"use server"

import { cn } from "@/lib/utils"
import { storyblokEditable } from "@storyblok/react/rsc"
import { HeroImageStoryblok } from "../../types/component-types-sb"
import HeroImageItem from "./HeroImageItem"

type HeroImageProps = {
  blok: HeroImageStoryblok
  index: number
}

async function HeroImage({ blok, index }: HeroImageProps) {
  return (
    <section {...storyblokEditable(blok)}>
      <div
        className={cn(
          "grid grid-cols-1",
          blok.paddingTop === "big" && "pt-16",
          blok.paddingTop === "medium" && "pt-8",
          blok.paddingTop === "small" && "pt-4",
          blok.paddingBottom === "big" && "pb-16",
          blok.paddingBottom === "medium" && "pb-8",
          blok.paddingBottom === "small" && "pb-4",
          blok?.items?.length === 2 && "md:grid-cols-2",
          blok?.items?.length === 3 && "md:grid-cols-3",
          blok?.items?.length === 4 && "md:grid-cols-4",
          blok?.items?.length === 5 && "md:grid-cols-5",
          blok?.items?.length === 6 && "md:grid-cols-6"
        )}
      >
        {blok.items &&
          blok.items.map((nestedBlok) => (
            <HeroImageItem
              heroImageParent={blok}
              blok={nestedBlok}
              key={nestedBlok._uid}
              index={index}
            />
          ))}
      </div>
    </section>
  )
}

export default HeroImage
