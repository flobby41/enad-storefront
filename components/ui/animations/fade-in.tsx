"use client"

import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"
import { useInView } from "react-intersection-observer"

export function FadeIn(
  props: HTMLAttributes<HTMLDivElement> & {
    disabled?: boolean
    className?: string
  }
) {
  const { ref, inView, entry } = useInView({
    threshold: 0.2, // Öka threshold så att man måste skrolla in en bit (t.ex. 20%)
    triggerOnce: true,
  })

  if (props.disabled) {
    return <div {...props} />
  } else {
    return (
      <div
        className={cn(
          props.className,
          inView ? "animate-[fadeInUp_1s_0.1s_forwards]" : "",
          "opacity-0 transition-all duration-1000 ease-out"
        )}
        ref={ref}
      >
        {props.children}
      </div>
    )
  }
}
