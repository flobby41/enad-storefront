import { cn } from "@/lib/utils"
import { storyblokEditable } from "@storyblok/react/rsc"
import { ContentTypeBadgeStoryblok } from "../../types/component-types-sb"
import { Badge } from "../ui/badge"

type ContentTypeBadgeProps = {
  blok: ContentTypeBadgeStoryblok
}

const ContentTypeBadge = ({ blok }: ContentTypeBadgeProps) => (
  <div {...storyblokEditable(blok)}>
    <Badge
      className={cn(
        "min-w-[120px] font-bold uppercase text-center h-[27px] justify-center mb-2",
        blok?.backgroundColor === "black" && "bg-black hover:bg-black/80",
        blok?.backgroundColor === "white" && "bg-white  hover:bg-white/80",
        blok?.textColor === "black" && "text-black",
        blok?.textColor === "white" && "text-white"
      )}
    >
      {blok.title}
    </Badge>
  </div>
)

export default ContentTypeBadge
