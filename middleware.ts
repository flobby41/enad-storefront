import { getEnadUser } from "@enadhq/commerce/backend";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/robots.txt" ||
    pathname.includes("/sitemap") ||
    pathname.includes("/.well-known")
  ) {
    return NextResponse.next(); // skip special files
  }

  const response = NextResponse.next();

  const enadUserToken = request.cookies.get("enadUserToken")?.value;
  let user = null;
  if (enadUserToken) {
    user = await getEnadUser(enadUserToken);
  }
  const isAuthenticated = user && !(user instanceof Error);

  if (
    pathname === "/robots.txt" ||
    pathname.includes("/sitemap") ||
    pathname.includes("/.well-known")
  ) {
    return response;
  }

  if (
    isAuthenticated &&
    ["/signup/", "/login/", "/reset-password/", "/verify/"].includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/account/", request.url));
  }

  if (!isAuthenticated && pathname.startsWith("/account/")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
