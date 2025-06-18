import { storyblokEditable } from "@storyblok/react/rsc"
import { ButtonItemStoryblok } from "../../types/component-types-sb"

type ButtonItemProps = {
  blok: ButtonItemStoryblok
}

const ButtonItem = ({ blok }: ButtonItemProps) => (
  <section {...storyblokEditable(blok)}>
    <div>
      <p>{blok.title}</p>
    </div>
  </section>
)

export default ButtonItem
