import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  // ✅ Parse the token manually from the cookie header
  const cookieHeader = request.headers.get("cookie") || "";
  const token = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  // Optional: temporarily send token in header for debugging
  // const resDebug = NextResponse.next();
  // resDebug.headers.set("x-debug-token", token || "none");
  // return resDebug;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    const isAdmin = payload.role === "ADMIN";
    const { pathname } = request.nextUrl;

    // admin-only routes
    if (pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("token");
    return res;
  }
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/cart/:path*",
    "/admin/:path*",
  ],
};
