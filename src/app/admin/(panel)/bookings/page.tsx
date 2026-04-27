"use client";

import { useCallback, useEffect, useState } from "react";
import type { Booking } from "@/lib/data";

const STATUS_COLORS: Record<Booking["status"], string> = {
  paid:      "bg-green-100 text-green-700 border-green-200",
  pending:   "bg-amber-100 text-amber-700 border-amber-200",
  cancelled: "bg-red-100  text-red-700   border-red-200",
};

function displayDate(s: string) {
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all"|"paid"|"pending"|"cancelled">("all");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/admin/bookings");
    if (res.ok) setBookings(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = bookings.filter(b => statusFilter === "all" ? true : b.status === statusFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">予約一覧</h1>
        <p className="text-sm text-stone-500 mt-1">Bookings</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {(["all","paid","pending","cancelled"] as const).map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${
              statusFilter === f
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
            }`}
          >
            {f} {f !== "all" && `(${bookings.filter(b => b.status === f).length})`}
          </button>
        ))}
        <button
          onClick={fetchData}
          className="ml-auto px-4 py-1.5 rounded-full text-xs border border-stone-200 bg-white text-stone-500 hover:text-stone-800 hover:border-stone-400 transition-colors"
        >↻ Refresh</button>
      </div>

      {loading ? (
        <p className="text-sm text-stone-400">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-400 text-sm">
          No bookings found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(b => (
            <div key={b.id} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-stone-900">{b.customer.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 capitalize">{b.tourType} tour</span>
                  </div>
                  <div className="text-sm text-stone-500 mt-1">
                    {b.customer.email}{b.customer.phone && ` · ${b.customer.phone}`}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-stone-400">
                    <span>📅 {displayDate(b.date)}</span>
                    <span>·</span>
                    <span>🕐 {b.session}</span>
                    <span>·</span>
                    <span>👥 {b.participants} pax</span>
                  </div>
                  {b.customer.notes && (
                    <div className="mt-2 text-xs text-stone-500 bg-stone-50 rounded-lg px-3 py-2 max-w-sm">
                      💬 {b.customer.notes}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-serif text-xl font-semibold text-stone-900">¥{b.totalPrice.toLocaleString()}</div>
                  <div className="text-xs text-stone-400 mt-1">{new Date(b.createdAt).toLocaleDateString("en-GB")}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
