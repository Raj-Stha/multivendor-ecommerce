import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const AUTH_ROUTES = ["/auth/login", "/auth/register"];

const ROLES = {
  VENDOR: "invent_vendor",
  ADMIN: "invent_administrator",
  CUSTOMER: "invent_customer",
  GUEST: "invent_api_unauthenticated",
};

async function verifyJWT(token) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  return await jwtVerify(token, secret);
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(
      /\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|json|woff|woff2|ttf|eot|mp4|webm|ogg|pdf)$/
    )
  ) {
    return NextResponse.next();
  }

  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (token) {
      try {
        const { payload } = await verifyJWT(token);
        const redirectPath = req.nextUrl.searchParams.get("redirect");

        switch (payload.role) {
          case ROLES.VENDOR:
            return NextResponse.redirect(
              new URL(redirectPath || "/dashboard/vendor", req.url)
            );
          case ROLES.ADMIN:
            return NextResponse.redirect(
              new URL(redirectPath || "/dashboard/admin", req.url)
            );
          case ROLES.CUSTOMER:
            return NextResponse.redirect(new URL(redirectPath || "/", req.url));
          default:
            return NextResponse.next();
        }
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/auth/login?redirect=${pathname}`, req.url)
      );
    }

    try {
      const { payload } = await verifyJWT(token);

      if (payload.role === ROLES.GUEST) {
        return NextResponse.redirect(
          new URL(`/auth/login?redirect=${pathname}`, req.url)
        );
      }

      if (pathname === "/dashboard") {
        switch (payload.role) {
          case ROLES.ADMIN:
            return NextResponse.redirect(new URL("/dashboard/admin", req.url));
          case ROLES.VENDOR:
            return NextResponse.redirect(new URL("/dashboard/vendor", req.url));
          case ROLES.CUSTOMER:
            return NextResponse.redirect(new URL("/dashboard/user", req.url));
          default:
            return NextResponse.redirect(new URL("/", req.url));
        }
      }

      if (
        pathname.startsWith("/dashboard/vendor") &&
        payload.role !== ROLES.VENDOR
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      if (
        pathname.startsWith("/dashboard/admin") &&
        payload.role !== ROLES.ADMIN
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      if (pathname === "/dashboard/user" && payload.role !== ROLES.CUSTOMER) {
        if (payload.role === ROLES.ADMIN) {
          return NextResponse.redirect(new URL("/dashboard/admin", req.url));
        }
        if (payload.role === ROLES.VENDOR) {
          return NextResponse.redirect(new URL("/dashboard/vendor", req.url));
        }
      }

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(
        new URL(`/auth/login?redirect=${pathname}`, req.url)
      );
    }
  }

  if (!pathname.startsWith("/dashboard") && !pathname.startsWith("/auth")) {
    if (token) {
      try {
        const { payload } = await verifyJWT(token);

        if (payload.role === ROLES.ADMIN) {
          return NextResponse.redirect(new URL("/dashboard/admin", req.url));
        }

        if (payload.role === ROLES.VENDOR) {
          return NextResponse.redirect(new URL("/dashboard/vendor", req.url));
        }

        return NextResponse.next();
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/((?!_next|favicon.ico|api).*)",
  ],
};
