import { NextRequest, NextResponse } from "next/server";
import { createAdminToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = await createAdminToken();

  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   60 * 60 * 24, // 24 h
    path:     "/",
  });
  return res;
}
