import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth";
import AdminShell from "../_lib/AdminShell";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const token = store.get("admin_token")?.value;
  if (!token || !(await verifyAdminToken(token))) redirect("/admin");

  return <AdminShell>{children}</AdminShell>;
}
