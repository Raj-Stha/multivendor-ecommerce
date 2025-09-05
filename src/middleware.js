import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("jwt")?.value;

  const publicRoutes = ["/auth/login", "/auth/register"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(
      new URL(`/auth/login?redirect=${pathname}`, req.url)
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/decodejwt`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.redirect(
        new URL(`/auth/login?redirect=${pathname}`, req.url)
      );
    }

    const data = await res.json();
    const details = data?.details?.[0];

    if (!details || Date.now() >= details.exp * 1000) {
      return NextResponse.redirect(
        new URL(`/auth/login?redirect=${pathname}`, req.url)
      );
    }

    if (
      pathname.startsWith("/dashboard/admin") &&
      details.role !== "invent_admin"
    ) {
      return NextResponse.redirect(new URL("/", req.url)); // redirect to home
    }

    if (
      pathname.startsWith("/dashboard/vendor") &&
      details.role !== "invent_vendor"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(
      new URL(`/auth/login?redirect=${pathname}`, req.url)
    );
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
