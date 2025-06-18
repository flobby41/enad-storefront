"use server"

import { cn } from "@/lib/utils"
import { defaultTextStyle } from "@/styles/default-text-style"
import { storyblokEditable } from "@storyblok/react/rsc"
import { render } from "storyblok-rich-text-react-renderer-ts"
import { TextBlockStoryblok } from "../../types/component-types-sb"

type Props = {
  blok: TextBlockStoryblok
}

async function TextBlock({ blok }: Props) {
  return (
    <section {...storyblokEditable(blok)}>
      <div
        className={cn(
          "px-4 md:px-8",
          defaultTextStyle(),
          blok.paddingTop === "big" && "pt-16",
          blok.paddingTop === "medium" && "pt-8",
          blok.paddingTop === "small" && "pt-4",
          blok.paddingBottom === "big" && "pb-16",
          blok.paddingBottom === "medium" && "pb-8",
          blok.paddingBottom === "small" && "pb-4"
        )}
      >
        {render(blok?.text, {
          nodeResolvers: {
            table: (children: React.ReactNode) => (
              <div className="">
                <table className="w-full">{children}</table>
              </div>
            ),
            tableRow: (children: React.ReactNode) => <tr className="">{children}</tr>,
            tableHeader: (children: React.ReactNode) => <th className="">{children}</th>,
            tableCell: (children: React.ReactNode) => <td className="[&_*]:text-lg">{children}</td>,
          } as any,
        })}
      </div>
    </section>
  )
}

export default TextBlock
