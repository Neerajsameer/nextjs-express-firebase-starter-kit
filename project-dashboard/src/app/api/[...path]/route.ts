import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleProxyRequest(request, path, "GET");
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleProxyRequest(request, path, "POST");
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleProxyRequest(request, path, "PUT");
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleProxyRequest(request, path, "DELETE");
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleProxyRequest(request, path, "PATCH");
}

async function handleProxyRequest(request: NextRequest, pathSegments: string[], method: string) {
  try {
    const firebaseToken = request.cookies.get("firebase-token")?.value;
    const orgId = request.cookies.get("org_id")?.value;

    if (!firebaseToken) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const path = pathSegments.join("/");
    const targetUrl = `${process.env.NEXT_PUBLIC_API_URL}/${path}`;

    // Get query parameters
    const url = new URL(request.url);
    const queryParams = url.searchParams.toString();
    const fullUrl = queryParams ? `${targetUrl}?${queryParams}` : targetUrl;

    const headers: Record<string, string> = { Authorization: `Bearer ${firebaseToken}` };

    if (orgId) headers["x-organisation-id"] = orgId;

    let body: string | undefined;
    if (method !== "GET" && method !== "DELETE") {
      const requestBody = await request.json();
      body = JSON.stringify(requestBody);
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(fullUrl, {
      method,
      headers,
      body,
    });

    // Get response data
    let responseData;
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Return the response with the same status code
    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "Request timeout" }, { status: 408 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
