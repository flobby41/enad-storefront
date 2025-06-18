import { renderRichText, storyblokEditable } from "@storyblok/react/rsc"
import { ContentTypeRichtextStoryblok } from "../../types/component-types-sb"

type ContentTypeRichtextProps = {
  blok: ContentTypeRichtextStoryblok
}

const ContentTypeRichtext = ({ blok }: ContentTypeRichtextProps) => (
  <div {...storyblokEditable(blok)}>
    <div>
      <p>{renderRichText(blok.text)}</p>
    </div>
  </div>
)

export default ContentTypeRichtext
