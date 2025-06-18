import { HeroImageItemStoryblok, HeroImageStoryblok } from '@/types/component-types-sb'
import StoryblokImage from '@/utils/StoryblokImage'

type Props = {
  heroImageParent: HeroImageStoryblok,
    blok: HeroImageItemStoryblok
  
}

export default async function AssetsWrapper({
  heroImageParent,
  blok
}: Props) {
 

  return (
    <>
      <StoryblokImage
      src={blok.imageDesktop?.filename || ""}
      alt={blok.imageDesktop?.alt || ""}
      width={500}
      height={500}
      className="w-full h-auto object-cover lg:block hidden"
      sizes={
        heroImageParent?.heroImageItems?.length === 2 ? "50vw" : "(max-width: 768px) 100vw, 50vw"
      }
      unoptimized
      style={{
        aspectRatio: heroImageParent?.sizeDesktop
          ? `${heroImageParent?.sizeDesktop?.split("_")?.[0]} / ${
              heroImageParent?.sizeDesktop?.split("_")?.[1]
            }`
          : undefined,
      }}
    />
    <StoryblokImage
      src={
        blok.imageMobile?.filename ? blok.imageMobile?.filename : blok.imageDesktop?.filename || ""
      }
      alt={blok.imageMobile?.alt || ""}
      width={500}
      height={500}
      className="w-full h-auto object-cover lg:hidden"
      sizes={"(max-width: 768px) 100vw, 100vw"}
      unoptimized
      style={{
        aspectRatio: heroImageParent?.sizeMobile
          ? `${heroImageParent?.sizeMobile?.split("_")?.[0]} / ${
              heroImageParent?.sizeMobile?.split("_")?.[1]
            }`
          : undefined,
      }}
    />
    </>
  )
}
