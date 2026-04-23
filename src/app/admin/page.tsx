import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth";
import AdminLoginForm from "./LoginForm";

export default async function AdminPage() {
  const store = await cookies();
  const token = store.get("admin_token")?.value;
  if (token && await verifyAdminToken(token)) redirect("/admin/dashboard");

  return (
    <main className="min-h-screen bg-stone-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-4xl mb-4">⛩</div>
          <h1 className="font-serif text-3xl text-white mb-2">管理画面</h1>
          <p className="text-stone-500 text-sm">Admin · Ise Sacred Walk</p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
