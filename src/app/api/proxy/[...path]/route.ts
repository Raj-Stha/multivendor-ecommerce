import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { path: string[] } }
) {
  const params = await context.params;
  return proxy(req, params.path);
}

export async function POST(
  req: NextRequest,
  context: { params: { path: string[] } }
) {
  const params = await context.params;
  return proxy(req, params.path);
}

export async function PUT(
  req: NextRequest,
  context: { params: { path: string[] } }
) {
  const params = await context.params;
  return proxy(req, params.path);
}

export async function DELETE(
  req: NextRequest,
  context: { params: { path: string[] } }
) {
  const params = await context.params;
  return proxy(req, params.path);
}

async function proxy(req: NextRequest, path: string[]) {
  const backendUrl = `https://ecom.kalpabrikshya.com.np/api/${path.join("/")}`;

  // Clone headers from the incoming request
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Forward body if not GET
  const body = req.method !== "GET" ? await req.text() : undefined;

  const res = await fetch(backendUrl, {
    method: req.method,
    headers,
    body,
    credentials: "include", // optional
  });

  const data = await res.text();

  // Forward the backend response including status and headers
  const responseHeaders = new Headers(res.headers);
  return new Response(data, {
    status: res.status,
    headers: responseHeaders,
  });
}
