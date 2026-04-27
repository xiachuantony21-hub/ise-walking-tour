"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/admin/dashboard", label: "ダッシュボード", en: "Dashboard", kanji: "状" },
  { href: "/admin/bookings",  label: "予約一覧",       en: "Bookings",  kanji: "予" },
  { href: "/admin/tours",     label: "ツアー管理",     en: "Tours",     kanji: "旅" },
  { href: "/admin/faq",       label: "FAQ管理",        en: "FAQ",       kanji: "問" },
  { href: "/admin/reviews",   label: "レビュー管理",   en: "Reviews",   kanji: "声" },
  { href: "/admin/settings",  label: "サイト設定",     en: "Settings",  kanji: "設" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Mobile header */}
      <header className="md:hidden bg-stone-900 text-white px-4 h-14 flex items-center justify-between sticky top-0 z-40">
        <button onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu" className="p-2">
          <span className="block w-5 h-0.5 bg-white mb-1.5"></span>
          <span className="block w-5 h-0.5 bg-white mb-1.5"></span>
          <span className="block w-5 h-0.5 bg-white"></span>
        </button>
        <span className="text-sm font-semibold">⛩ 管理画面</span>
        <button onClick={logout} className="text-xs px-3 py-1 border border-stone-700 rounded">Sign out</button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-stone-900 text-stone-200 z-50 transform transition-transform md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 h-16 flex items-center gap-3 border-b border-stone-800">
          <span className="text-2xl">⛩</span>
          <div>
            <div className="text-white font-semibold text-sm">管理画面</div>
            <div className="text-stone-500 text-xs">YamaTrips · Admin</div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {NAV.map(n => {
            const active = pathname === n.href || pathname?.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-stone-800 text-white"
                    : "text-stone-400 hover:bg-stone-800/60 hover:text-white"
                }`}
              >
                <span className="text-lg w-6 text-center" style={{ fontFamily: "serif", color: active ? "#e8b86a" : "#78716c" }}>{n.kanji}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{n.label}</div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-500">{n.en}</div>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-stone-800 space-y-2">
          <Link href="/" target="_blank" className="block text-xs text-stone-400 hover:text-white">View site ↗</Link>
          <button onClick={logout} className="w-full text-left text-xs text-stone-400 hover:text-white">Sign out</button>
        </div>
      </aside>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Main */}
      <main className="md:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}
