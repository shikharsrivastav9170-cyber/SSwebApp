import { NextResponse } from "next/server";

export function middleware(req: any) {
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};