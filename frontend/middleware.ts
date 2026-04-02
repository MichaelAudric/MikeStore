import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  // 1️⃣ Read token manually from cookie header
  const cookieHeader = request.headers.get("cookie") || "";
  const token = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  // 2️⃣ Create the response object early so we can add debug headers
  const res = NextResponse.next();

  // 3️⃣ DEBUG HEADERS (browser will see these)
  res.headers.set("x-debug-cookie-header", cookieHeader || "none");
  res.headers.set("x-debug-token", token || "none");

  if (!token) {
    res.headers.set("x-debug-redirect", "no-token");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    res.headers.set("x-debug-jwt-payload", JSON.stringify(payload));

    const isAdmin = payload.role === "ADMIN";
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/admin") && !isAdmin) {
      res.headers.set("x-debug-redirect", "not-admin");
      return NextResponse.redirect(new URL("/", request.url));
    }

    res.headers.set("x-debug-redirect", "none");
    return res;
  } catch (err) {
    res.headers.set("x-debug-jwt-error", String(err));
    res.cookies.delete("token");
    return NextResponse.redirect(new URL("/login", request.url));
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
