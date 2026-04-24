"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Booking, Settings } from "@/lib/data";

type Tab = "bookings" | "settings";

const STATUS_COLORS = {
  paid:      "bg-green-100 text-green-700 border-green-200",
  pending:   "bg-amber-100 text-amber-700 border-amber-200",
  cancelled: "bg-red-100  text-red-700   border-red-200",
};

function displayDate(s: string) {
  const [y,m,d] = s.split("-");
  return `${d}/${m}/${y}`;
}

export default function AdminDashboardClient() {
  const router = useRouter();
  const [tab, setTab]           = useState<Tab>("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saved, setSaved]       = useState(false);
  const [saveError, setSaveError] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all"|"paid"|"pending"|"cancelled">("all");

  /* ── fetch data ── */
  const fetchData = useCallback(async () => {
    const [bRes, sRes] = await Promise.all([
      fetch("/api/admin/bookings"),
      fetch("/api/admin/settings"),
    ]);
    if (bRes.status === 401) { router.push("/admin"); return; }
    setBookings(await bRes.json());
    setSettings(await sRes.json());
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── logout ── */
  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  /* ── save settings ── */
  const saveSettings = async () => {
    if (!settings) return;
    setSaveError(""); setSaved(false);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    else { setSaveError("Failed to save settings."); }
  };

  /* ── add/remove blocked date ── */
  const toggleBlockedDate = (date: string) => {
    if (!settings) return;
    const list = settings.blockedDates;
    setSettings({
      ...settings,
      blockedDates: list.includes(date) ? list.filter(d => d !== date) : [...list, date].sort(),
    });
  };

  const filteredBookings = bookings.filter(b =>
    statusFilter === "all" ? true : b.status === statusFilter
  );

  const stats = {
    total:  bookings.length,
    paid:   bookings.filter(b => b.status === "paid").length,
    revenue: bookings.filter(b => b.status === "paid").reduce((s, b) => s + b.totalPrice, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="text-stone-400 text-sm animate-pulse">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Top bar */}
      <header className="bg-stone-900 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⛩</span>
            <div>
              <div className="text-white font-semibold text-sm">管理画面</div>
              <div className="text-stone-500 text-xs">Ise Sacred Walk · Admin</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-xs text-stone-400 hover:text-white transition-colors">
              View site ↗
            </a>
            <button onClick={logout} className="text-xs px-3 py-1.5 border border-stone-700 rounded-lg text-stone-400 hover:text-white hover:border-stone-500 transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Bookings", value: stats.total },
            { label: "Confirmed (Paid)", value: stats.paid },
            { label: "Total Revenue", value: `¥${stats.revenue.toLocaleString()}` },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200">
              <div className="text-xs text-stone-400 uppercase tracking-wider mb-2">{s.label}</div>
              <div className="font-serif text-3xl font-medium text-stone-900">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-stone-200 w-fit shadow-sm">
          {(["bookings","settings"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              {t === "bookings" ? "📋 Bookings" : "⚙️ Settings"}
            </button>
          ))}
        </div>

        {/* ── Bookings tab ── */}
        {tab === "bookings" && (
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
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
              >
                ↻ Refresh
              </button>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-400 text-sm">
                No bookings found.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBookings.sort((a,b) => b.createdAt.localeCompare(a.createdAt)).map(b => (
                  <div key={b.id} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-stone-900">{b.customer.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${STATUS_COLORS[b.status]}`}>
                              {b.status}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 capitalize">
                              {b.tourType} tour
                            </span>
                          </div>
                          <div className="text-sm text-stone-500 mt-1">
                            {b.customer.email}
                            {b.customer.phone && ` · ${b.customer.phone}`}
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-xs text-stone-400">
                            <span>📅 {displayDate(b.date)}</span>
                            <span>·</span>
                            <span className="capitalize">🕐 {b.session}</span>
                            <span>·</span>
                            <span>👥 {b.participants} pax</span>
                          </div>
                          {b.customer.notes && (
                            <div className="mt-2 text-xs text-stone-500 bg-stone-50 rounded-lg px-3 py-2 max-w-sm">
                              💬 {b.customer.notes}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-serif text-xl font-semibold text-stone-900">
                          ¥{b.totalPrice.toLocaleString()}
                        </div>
                        <div className="text-xs text-stone-400 mt-1">
                          {new Date(b.createdAt).toLocaleDateString("en-GB")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Settings tab ── */}
        {tab === "settings" && settings && (
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-white rounded-2xl p-7 border border-stone-200 shadow-sm">
              <h3 className="font-semibold text-stone-800 mb-6 flex items-center gap-2">
                <span>💴</span> Pricing
              </h3>
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-semibold text-stone-600 mb-4 uppercase tracking-wider">Private Tour</h4>
                  <div className="space-y-3">
                    {[
                      { label: "Base price (¥)", key: "basePrice" as const },
                      { label: "Base persons",   key: "basePersons" as const },
                      { label: "Per additional person (¥)", key: "additionalPersonPrice" as const },
                    ].map(({ label, key }) => (
                      <label key={key} className="flex items-center justify-between gap-4">
                        <span className="text-sm text-stone-600">{label}</span>
                        <input
                          type="number"
                          value={settings.pricing.private[key]}
                          onChange={e => setSettings({
                            ...settings,
                            pricing: { ...settings.pricing, private: { ...settings.pricing.private, [key]: +e.target.value } }
                          })}
                          className="w-28 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-torii-700 text-right"
                        />
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-600 mb-4 uppercase tracking-wider">Group Tour</h4>
                  <div className="space-y-3">
                    {[
                      { label: "Price per person (¥)", key: "pricePerPerson" as const },
                      { label: "Min participants",      key: "minParticipants" as const },
                    ].map(({ label, key }) => (
                      <label key={key} className="flex items-center justify-between gap-4">
                        <span className="text-sm text-stone-600">{label}</span>
                        <input
                          type="number"
                          value={settings.pricing.group[key]}
                          onChange={e => setSettings({
                            ...settings,
                            pricing: { ...settings.pricing, group: { ...settings.pricing.group, [key]: +e.target.value } }
                          })}
                          className="w-28 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-torii-700 text-right"
                        />
                      </label>
                    ))}
                    <label className="flex items-center justify-between gap-4">
                      <span className="text-sm text-stone-600">Max participants</span>
                      <input
                        type="number"
                        value={settings.maxParticipants}
                        onChange={e => setSettings({ ...settings, maxParticipants: +e.target.value })}
                        className="w-28 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-torii-700 text-right"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Sessions */}
            <div className="bg-white rounded-2xl p-7 border border-stone-200 shadow-sm">
              <h3 className="font-semibold text-stone-800 mb-6 flex items-center gap-2">
                <span>🕐</span> Sessions
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Group departure */}
                <div className="border border-stone-200 rounded-xl p-5">
                  <div className="font-medium text-stone-800 mb-4">Group Departure</div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-xs text-stone-500">Start</span>
                      <input
                        type="time"
                        value={settings.sessions.groupDeparture.startTime}
                        onChange={e => setSettings({ ...settings, sessions: { ...settings.sessions, groupDeparture: { ...settings.sessions.groupDeparture, startTime: e.target.value } } })}
                        className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-stone-500">End</span>
                      <input
                        type="time"
                        value={settings.sessions.groupDeparture.endTime}
                        onChange={e => setSettings({ ...settings, sessions: { ...settings.sessions, groupDeparture: { ...settings.sessions.groupDeparture, endTime: e.target.value } } })}
                        className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                      />
                    </label>
                  </div>
                </div>

                {/* Private window */}
                <div className="border border-stone-200 rounded-xl p-5">
                  <div className="font-medium text-stone-800 mb-4">Private Start Window</div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-xs text-stone-500">Earliest</span>
                      <input
                        type="time"
                        value={settings.sessions.privateWindow.earliestStart}
                        onChange={e => setSettings({ ...settings, sessions: { ...settings.sessions, privateWindow: { ...settings.sessions.privateWindow, earliestStart: e.target.value } } })}
                        className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-stone-500">Latest</span>
                      <input
                        type="time"
                        value={settings.sessions.privateWindow.latestStart}
                        onChange={e => setSettings({ ...settings, sessions: { ...settings.sessions, privateWindow: { ...settings.sessions.privateWindow, latestStart: e.target.value } } })}
                        className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                      />
                    </label>
                  </div>
                  <label className="block mt-3">
                    <span className="text-xs text-stone-500">Duration (hours)</span>
                    <input
                      type="number" min={1} max={8}
                      value={settings.sessions.privateWindow.durationHours}
                      onChange={e => setSettings({ ...settings, sessions: { ...settings.sessions, privateWindow: { ...settings.sessions.privateWindow, durationHours: +e.target.value } } })}
                      className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    />
                  </label>
                </div>
              </div>

              <label className="block mt-4">
                <span className="text-xs text-stone-500">Arrive early (minutes)</span>
                <input
                  type="number" min={0} max={60}
                  value={settings.sessions.arriveEarlyMinutes}
                  onChange={e => setSettings({ ...settings, sessions: { ...settings.sessions, arriveEarlyMinutes: +e.target.value } })}
                  className="mt-1 w-32 px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </label>
            </div>

            {/* Blocked dates */}
            <div className="bg-white rounded-2xl p-7 border border-stone-200 shadow-sm">
              <h3 className="font-semibold text-stone-800 mb-6 flex items-center gap-2">
                <span>🚫</span> Blocked Dates
              </h3>
              <div className="flex gap-3 mb-4">
                <input
                  type="date"
                  id="blockDateInput"
                  min={new Date().toISOString().split("T")[0]}
                  className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-torii-700"
                />
                <button
                  onClick={() => {
                    const el = document.getElementById("blockDateInput") as HTMLInputElement;
                    if (el.value) { toggleBlockedDate(el.value); el.value = ""; }
                  }}
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-700 transition-colors"
                >
                  Add date
                </button>
              </div>
              {settings.blockedDates.length === 0 ? (
                <p className="text-stone-400 text-sm">No blocked dates.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {settings.blockedDates.map(d => (
                    <span key={d} className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full text-sm text-red-700">
                      {d}
                      <button onClick={() => toggleBlockedDate(d)} className="hover:text-red-900 font-bold leading-none">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Announcement */}
            <div className="bg-white rounded-2xl p-7 border border-stone-200 shadow-sm">
              <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <span>📢</span> Announcement Banner
              </h3>
              <textarea
                value={settings.announcement}
                onChange={e => setSettings({ ...settings, announcement: e.target.value })}
                rows={3}
                placeholder="Optional message shown at the top of the booking form (leave empty to hide)"
                className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-torii-700 resize-none text-stone-800"
              />
            </div>

            {/* Save button */}
            <div className="flex items-center justify-between gap-4 pt-2">
              {saveError && <p className="text-red-600 text-sm">{saveError}</p>}
              {saved && (
                <p className="flex items-center gap-2 text-green-700 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                  Settings saved!
                </p>
              )}
              {!saved && !saveError && <span />}
              <button
                onClick={saveSettings}
                className="px-8 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-700 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
