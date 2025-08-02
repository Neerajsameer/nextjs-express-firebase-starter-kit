import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { org_id } = await req.json();

  if (!org_id) return NextResponse.json({ error: "Missing org_id" }, { status: 400 });

  const response = NextResponse.json({ success: true });

  response.cookies.set("org_id", org_id, {
    httpOnly: false, // Allow client-side access if needed
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return response;
}
