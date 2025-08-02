import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) return NextResponse.json({ error: "No ID token provided" }, { status: 400 });

    const result = await verifyIdToken(idToken);

    if (!result.success) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const response = NextResponse.json({ user: result.user, success: true });

    response.cookies.set("firebase-token", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error in verify route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  ["org_id", "firebase-token"].forEach((x) => {
    response.cookies.set(x, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
  });

  return response;
}
