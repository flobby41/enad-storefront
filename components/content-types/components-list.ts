import { FunctionComponent } from "react"
import HeroImage from "../nestables/HeroImage"
import HeroImageItem from "../nestables/HeroImageItem"
import TextBlock from "../nestables/TextBlock"

interface ComponentsMapProps {
  [key: string]: FunctionComponent<any>
}

const ComponentsMap: ComponentsMapProps = {
  heroImage: HeroImage,
  heroImageItem: HeroImageItem,
  textBlock: TextBlock,
}

export default ComponentsMap
