import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { getSettings, saveSettings } from "@/lib/data";

async function isAuthed() {
  const store = await cookies();
  const token = store.get("admin_token")?.value;
  return !!token && await verifyAdminToken(token);
}

export async function GET() {
  if (!(await isAuthed()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getSettings());
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthed()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    await saveSettings(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Save failed";
    console.error("[admin/settings PUT]", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
