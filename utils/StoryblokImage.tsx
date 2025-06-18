"use client"

/* eslint-disable jsx-a11y/alt-text */
import Image, { ImageLoader, ImageProps } from "next/image"

const StoryBlokImageLoader: ImageLoader = ({ src, quality, width }) => {
  const widthAndHeight = `${width ?? 0}x0`

  const imageModifications = `filters:quality(${
    quality ?? process.env.NEXT_PUBLIC_STORYBLOK_IMAGE_QUALITY
  })`

  return `${src}/m/${widthAndHeight}/${imageModifications}`
}

export function StoryblokImage(props: ImageProps) {
  const { src, quality } = props

  /**
   * Storyblok
   *
   * Images from Storyblok will use the custom StoryBlokImageLoader so that
   * images are optimized directly from Storyblok CDN for best performance.
   */
  if (typeof src === "string" && src.includes("a.storyblok.com")) {
    return <Image {...props} loader={StoryBlokImageLoader} quality={quality} />
  }

  return <Image {...props} />
}

export default StoryblokImage
