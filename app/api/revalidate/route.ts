//https://www.sanity.io/learn/course/controlling-cached-content-in-next-js/path-based-revalidation#s-86ed0d865964
//https://www.storyblok.com/docs/guide/in-depth/webhooks#nextjs
//import { revalidatePath } from 'next/cache';
//import { type NextRequest, NextResponse } from 'next/server';
//type WebhookPayload = { path?: string };
import { revalidatePath } from "next/cache"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data.full_slug) {
    return Response.json({ error: "query parameter is required" }, { status: 400 })
  }

  const correctSlug = data.full_slug === "home" ? "/" : `/${data.full_slug}`
  revalidatePath(correctSlug)

  return Response.json({ revalidated: true, now: Date.now() })
}
