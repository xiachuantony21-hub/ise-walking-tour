"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Booking } from "@/lib/data";

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/bookings");
      if (res.ok) setBookings(await res.json());
      setLoading(false);
    })();
  }, []);

  const stats = {
    total: bookings.length,
    paid: bookings.filter(b => b.status === "paid").length,
    pending: bookings.filter(b => b.status === "pending").length,
    revenue: bookings.filter(b => b.status === "paid").reduce((s, b) => s + b.totalPrice, 0),
  };

  const recent = [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">ダッシュボード</h1>
        <p className="text-sm text-stone-500 mt-1">概要 / Overview</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: stats.total, kanji: "予" },
          { label: "Confirmed (Paid)", value: stats.paid, kanji: "済" },
          { label: "Pending", value: stats.pending, kanji: "待" },
          { label: "Total Revenue", value: `¥${stats.revenue.toLocaleString()}`, kanji: "円" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200">
            <div className="flex items-start justify-between mb-2">
              <div className="text-xs text-stone-400 uppercase tracking-wider">{s.label}</div>
              <span className="font-jp text-stone-300 text-xl" style={{ fontFamily: "serif" }}>{s.kanji}</span>
            </div>
            <div className="font-serif text-3xl font-medium text-stone-900">
              {loading ? "—" : s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-stone-800">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-xs text-stone-500 hover:text-stone-900">View all →</Link>
        </div>
        {loading ? (
          <p className="text-sm text-stone-400">Loading…</p>
        ) : recent.length === 0 ? (
          <p className="text-sm text-stone-400">No bookings yet.</p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {recent.map(b => (
              <li key={b.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium text-stone-800">{b.customer.name}</div>
                  <div className="text-xs text-stone-500">{b.date} · {b.session} · {b.participants} pax</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-stone-800">¥{b.totalPrice.toLocaleString()}</div>
                  <div className={`text-[10px] uppercase tracking-wider ${
                    b.status === "paid" ? "text-green-600" : b.status === "pending" ? "text-amber-600" : "text-red-600"
                  }`}>{b.status}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
