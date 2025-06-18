import { ContentItemStoryblok } from "../../types/component-types-sb"
import ContentPosition from "../content-position"
import ContentTypeBadge from "./ContentTypeBadge"
import ContentTypeButtons from "./ContentTypeButtons"
import ContentTypeText from "./ContentTypeText"

type ContentItemProps = {
  blok: ContentItemStoryblok
  indexContentItem: number
  index: number
  link: string
}

const ContentItem = ({ blok, indexContentItem, index, link }: ContentItemProps) => (
  <ContentPosition positions={blok} index={indexContentItem} blokIndex={index} link={link}>
    {blok.content_types &&
      blok.content_types.map((nestedBlok) => {
        if (nestedBlok.component === "contentTypeBadge") {
          return <ContentTypeBadge key={nestedBlok._uid} blok={nestedBlok} />
        }
        if (nestedBlok.component === "contentTypeText") {
          return <ContentTypeText key={nestedBlok._uid} blok={nestedBlok} />
        }
        if (nestedBlok.component === "contentTypeRichtext") {
          return <ContentTypeText key={nestedBlok._uid} blok={nestedBlok} />
        }
        if (nestedBlok.component === "contentTypeButtons") {
          return <ContentTypeButtons key={nestedBlok._uid} blok={nestedBlok} />
        }
      })}
  </ContentPosition>
)

export default ContentItem
