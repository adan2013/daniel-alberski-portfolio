import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Next emits social image URLs with the internal /pl prefix; crawlers
  // should get the image directly instead of a redirect.
  if (pathname.startsWith("/pl/") && pathname.endsWith("/opengraph-image")) {
    return NextResponse.next();
  }

  if (pathname === "/pl" || pathname.startsWith("/pl/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/pl" ? "/" : pathname.slice(3);
    return NextResponse.redirect(url);
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/pl${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
