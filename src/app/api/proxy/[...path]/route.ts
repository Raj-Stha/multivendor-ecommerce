// import { NextRequest } from "next/server";

// async function proxy(req: NextRequest, path: string[]) {
//   const backendUrl = `https://ecom.kalpabrikshya.com.np/api/${path.join("/")}`;

//   // copy headers
//   const headers: Record<string, string> = {};
//   req.headers.forEach((value, key) => {
//     headers[key] = value;
//   });

//   // only send body for non-GET
//   const body = req.method !== "GET" ? await req.text() : undefined;

//   const res = await fetch(backendUrl, {
//     method: req.method,
//     headers,
//     body,
//     credentials: "include",
//   });

//   const data = await res.text();

//   return new Response(data, {
//     status: res.status,
//     headers: res.headers,
//   });
// }

// // --- shared type for params ---
// type Params = { path: string[] };

// // helper to extract params safely
// function getPath(context: unknown): string[] {
//   return (context as { params: Params }).params.path;
// }

// // --- Handlers ---
// export async function GET(req: NextRequest, context: unknown) {
//   return proxy(req, getPath(context));
// }

// export async function POST(req: NextRequest, context: unknown) {
//   return proxy(req, getPath(context));
// }

// export async function PUT(req: NextRequest, context: unknown) {
//   return proxy(req, getPath(context));
// }

// export async function DELETE(req: NextRequest, context: unknown) {
//   return proxy(req, getPath(context));
// }

// Next JS 16

import { NextRequest } from "next/server";

// Proxy function to forward request to backend
async function proxy(req: NextRequest, path: string[]) {
  const backendUrl = `https://ecom.kalpabrikshya.com.np/api/${path.join("/")}`;

  // copy headers
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // only send body for non-GET
  const body = req.method !== "GET" ? await req.text() : undefined;

  const res = await fetch(backendUrl, {
    method: req.method,
    headers,
    body,
    credentials: "include",
  });

  const data = await res.text();

  return new Response(data, {
    status: res.status,
    headers: res.headers,
  });
}

// --- shared type for params ---
type Params = { path: string[] };

// --- Handlers ---
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { path } = await params; // ✅ unwrap promise
  return proxy(req, path);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { path } = await params;
  return proxy(req, path);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { path } = await params;
  return proxy(req, path);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { path } = await params;
  return proxy(req, path);
}
