// route handler with secret and slug
import { draftMode } from "next/headers"
import { redirect } from "next/navigation"

import StoryblokClient from "storyblok-js-client"

export async function GET(request: Request) {
  // Parse query string parameters
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")
  const slug = searchParams.get("slug")
  const language = searchParams.get("_storyblok_lang") as string
  const draft = await draftMode()

  const storyblok = new StoryblokClient({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  })
  const { data } = await storyblok.get(`cdn/stories/${slug?.replace(`${language}`, "")}`, {
    version: "draft",
    language: language,
    excluding_fields: "header,body,seo",
  })

  const translatedItem = data.story?.translated_slugs?.find(
    (slug: { lang: string }) => slug.lang === language
  )

  // Check the secret and next parameters
  // This secret should only be known to this route handler and the CMS
  if (secret !== process.env.DRAFT_SECRET_TOKEN) {
    return new Response("Invalid token", { status: 401 })
  }

  // Enable Draft Mode by setting the cookie
  draft.enable()

  if (data) {
    redirect(
      translatedItem
        ? `/${translatedItem?.path}`
        : `/${data.story.full_slug}/?language=${language.replace("default", "en")}`
    )
  } else {
    redirect(`/${slug?.replace(`${language}/`, "")}/?language=${language}`)
  }
}
