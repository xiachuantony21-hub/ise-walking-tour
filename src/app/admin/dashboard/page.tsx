import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth";
import AdminDashboardClient from "./DashboardClient";

export default async function AdminDashboardPage() {
  const store = await cookies();
  const token = store.get("admin_token")?.value;
  if (!token || !(await verifyAdminToken(token))) redirect("/admin");

  return <AdminDashboardClient />;
}
