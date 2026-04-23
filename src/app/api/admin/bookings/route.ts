import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { getBookings } from "@/lib/data";

export async function GET() {
  const store = await cookies();
  const token = store.get("admin_token")?.value;
  if (!token || !(await verifyAdminToken(token)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getBookings());
}
