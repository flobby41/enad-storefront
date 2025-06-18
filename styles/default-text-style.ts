import { cva } from "class-variance-authority"

export const defaultTextStyle = cva(
  "[&_*:not(:last-child)]:mb-4 [&_h1]:font-bold [&_h2]:font-bold [&_h1]:text-2xl [&_h1]:md:text-3xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:md:text-2xl"
)
