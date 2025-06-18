"use client"

import { EnadProduct } from "@enadhq/commerce/enad"
import Image from "next/image"
import { useRef, useState } from "react"

interface ProductImageCarouselProps {
  product: EnadProduct
  productImages: EnadProduct["images"]
}

export default function ProductStackedImages({
  product,
  productImages,
}: ProductImageCarouselProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Refs for image elements
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  // Function to scroll to image when thumbnail is clicked
  const scrollToImage = (index: number) => {
    setActiveImageIndex(index)
    if (imageRefs.current[index]) {
      imageRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  // Function to check if an image is in viewport
  const handleImageInView = (index: number) => {
    if (typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveImageIndex(index)
            }
          })
        },
        { threshold: 0.7 } // 70% of the image must be visible
      )

      if (imageRefs.current[index]) {
        observer.observe(imageRefs.current[index]!)
      }

      return () => {
        if (imageRefs.current[index]) {
          observer.unobserve(imageRefs.current[index]!)
        }
      }
    }
  }

  return (
    <div className="md:col-span-1">
      <div className="flex gap-4">
        {/* Thumbnail navigation */}
        <div className="hidden md:flex flex-col gap-2 w-20 sticky top-4 self-start">
          {(productImages.length === 0 ? [null] : productImages).map((image, index) => (
            <button
              key={index}
              onClick={() => scrollToImage(index)}
              className={`relative w-20 h-20 border-2 transition-all ${
                index === activeImageIndex
                  ? "border-black"
                  : "border-transparent hover:border-gray-300"
              }`}
              aria-label={`View image ${index + 1} of ${productImages.length || 1}`}
              aria-current={index === activeImageIndex ? "true" : "false"}
              disabled={productImages.length === 0}
            >
              <Image
                unoptimized
                src={image?.url || "/placeholder.svg"}
                alt={`${image?.alt || "No image available"} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>

        {/* Stacked images */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {productImages.length === 0 ? (
            <div className="relative aspect-3/4 w-full">
              <Image
                src="/placeholder.svg"
                alt="No image available"
                fill
                unoptimized
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          ) : (
            productImages.map((image, index) => {
              // Set up intersection observer for each image
              handleImageInView(index)

              return (
                <div
                  key={index}
                  ref={(el) => (imageRefs.current[index] = el)}
                  id={`product-image-${index}`}
                >
                  <Image
                    src={image?.url || "/placeholder.svg"}
                    alt={`${image?.alt} - View ${index + 1}`}
                    unoptimized
                    className="object-cover w-full"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 600px"
                    width={800}
                    height={800}
                  />
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
