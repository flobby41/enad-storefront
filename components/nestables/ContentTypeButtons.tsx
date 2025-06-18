import { storyblokEditable } from "@storyblok/react/rsc"
import { ContentTypeButtonsStoryblok } from "../../types/component-types-sb"
import ButtonItem from "./ButtonItem"

type ContentTypeButtonsProps = {
  blok: ContentTypeButtonsStoryblok
}

const ContentTypeButtons = ({ blok }: ContentTypeButtonsProps) => (
  <div {...storyblokEditable(blok)}>
    <div>
      {blok.buttons &&
        blok.buttons.map((nestedBlok) => <ButtonItem blok={nestedBlok} key={nestedBlok._uid} />)}
    </div>
  </div>
)

export default ContentTypeButtons
