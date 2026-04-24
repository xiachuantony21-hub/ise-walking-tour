"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Booking, Settings, Chapter, Review, HeroSlide, StatItem, FAQItem } from "@/lib/data";

type Tab = "bookings" | "content" | "operations";

const STATUS_COLORS = {
  paid:      "bg-green-100 text-green-700 border-green-200",
  pending:   "bg-amber-100 text-amber-700 border-amber-200",
  cancelled: "bg-red-100  text-red-700   border-red-200",
};

function displayDate(s: string) {
  const [y,m,d] = s.split("-");
  return `${d}/${m}/${y}`;
}

/* ── reusable input primitives ── */
const inputCls = "w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-stone-600">{label}</span>
      {hint && <span className="text-[10px] text-stone-400 block mt-0.5">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Card({ title, kanji, children }: { title: string; kanji: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-7 border border-stone-200 shadow-sm">
      <h3 className="font-semibold text-stone-800 mb-6 flex items-center gap-3">
        <span className="text-xl text-stone-400" style={{ fontFamily: "serif" }}>{kanji}</span>
        {title}
      </h3>
      {children}
    </div>
  );
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

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

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

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="text-stone-400 text-sm animate-pulse">Loading…</div>
      </div>
    );
  }

  /* ── helpers tied to settings state ── */
  const patch = (updater: (s: Settings) => Settings) => setSettings(updater(settings));

  /* Arrays: utility editors */
  const StringList = ({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) => (
    <div className="space-y-2">
      {value.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={v}
            onChange={e => onChange(value.map((x, j) => j === i ? e.target.value : x))}
            className={inputCls}
            placeholder={placeholder}
          />
          <button onClick={() => onChange(value.filter((_, j) => j !== i))} className="px-3 text-stone-400 hover:text-red-600 text-lg">×</button>
        </div>
      ))}
      <button onClick={() => onChange([...value, ""])} className="text-xs px-3 py-1.5 border border-dashed border-stone-300 rounded-lg text-stone-500 hover:border-stone-500 hover:text-stone-700">
        + Add
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="bg-stone-900 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⛩</span>
            <div>
              <div className="text-white font-semibold text-sm">管理画面</div>
              <div className="text-stone-500 text-xs">Real Japan by YamaTrips · Admin</div>
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
          {(["bookings","content","operations"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              {t === "bookings" ? "📋 Bookings" : t === "content" ? "✍️ Content" : "⚙️ Operations"}
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

        {/* ── Content tab ── */}
        {tab === "content" && (
          <div className="space-y-6 pb-24">
            <p className="text-xs text-stone-500 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              💡 Image fields accept either a local path like <code className="bg-white px-1.5 py-0.5 rounded">/photos/your-image.jpg</code> (put files in <code className="bg-white px-1.5 py-0.5 rounded">public/photos/</code>) or a full URL. Text can use <code className="bg-white px-1.5 py-0.5 rounded">&lt;em&gt;word&lt;/em&gt;</code> or <code className="bg-white px-1.5 py-0.5 rounded">&lt;br/&gt;</code>.
            </p>

            {/* Hero */}
            <Card title="Hero (first screen)" kanji="一">
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                <Field label="Eyebrow (small label)">
                  <input className={inputCls} value={settings.hero.eyebrow} onChange={e => patch(s => ({ ...s, hero: { ...s.hero, eyebrow: e.target.value } }))} />
                </Field>
                <Field label="Subheading">
                  <input className={inputCls} value={settings.hero.subheading} onChange={e => patch(s => ({ ...s, hero: { ...s.hero, subheading: e.target.value } }))} />
                </Field>
              </div>
              <Field label="Heading (allows <em> and <br/>)">
                <textarea className={inputCls} rows={2} value={settings.hero.heading} onChange={e => patch(s => ({ ...s, hero: { ...s.hero, heading: e.target.value } }))} />
              </Field>

              <div className="mt-6">
                <div className="text-xs font-medium text-stone-600 mb-2">Slides (background rotation)</div>
                <div className="space-y-3">
                  {settings.hero.slides.map((sl, i) => (
                    <div key={i} className="border border-stone-200 rounded-xl p-4 grid sm:grid-cols-[1fr_100px_1fr_auto] gap-3 items-end">
                      <Field label="Image path/URL">
                        <input className={inputCls} value={sl.imageUrl} onChange={e => patch(s => ({ ...s, hero: { ...s.hero, slides: s.hero.slides.map((x,j) => j===i ? { ...x, imageUrl: e.target.value } : x) } }))} />
                      </Field>
                      <Field label="Kanji">
                        <input className={inputCls} value={sl.kanji} onChange={e => patch(s => ({ ...s, hero: { ...s.hero, slides: s.hero.slides.map((x,j) => j===i ? { ...x, kanji: e.target.value } : x) } }))} />
                      </Field>
                      <Field label="Caption">
                        <input className={inputCls} value={sl.caption} onChange={e => patch(s => ({ ...s, hero: { ...s.hero, slides: s.hero.slides.map((x,j) => j===i ? { ...x, caption: e.target.value } : x) } }))} />
                      </Field>
                      <button onClick={() => patch(s => ({ ...s, hero: { ...s.hero, slides: s.hero.slides.filter((_, j) => j !== i) } }))} className="px-3 py-2 text-stone-400 hover:text-red-600 text-lg">×</button>
                    </div>
                  ))}
                  <button onClick={() => patch(s => ({ ...s, hero: { ...s.hero, slides: [...s.hero.slides, { imageUrl: "", kanji: "", caption: "" } as HeroSlide] } }))} className="text-xs px-3 py-1.5 border border-dashed border-stone-300 rounded-lg text-stone-500 hover:border-stone-500 hover:text-stone-700">
                    + Add slide
                  </button>
                </div>
              </div>
            </Card>

            {/* Story */}
            <Card title="Our Story" kanji="物語">
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <Field label="Kanji"><input className={inputCls} value={settings.story.kanji} onChange={e => patch(s => ({ ...s, story: { ...s.story, kanji: e.target.value } }))} /></Field>
                <Field label="Eyebrow"><input className={inputCls} value={settings.story.eyebrow} onChange={e => patch(s => ({ ...s, story: { ...s.story, eyebrow: e.target.value } }))} /></Field>
                <Field label="Heading (allows <em>/<br/>)"><input className={inputCls} value={settings.story.heading} onChange={e => patch(s => ({ ...s, story: { ...s.story, heading: e.target.value } }))} /></Field>
              </div>
              <Field label="Paragraphs">
                <StringList value={settings.story.paragraphs} onChange={v => patch(s => ({ ...s, story: { ...s.story, paragraphs: v } }))} placeholder="A paragraph of story text…" />
              </Field>
              <div className="mt-4">
                <Field label="Collage images (exactly 4 for best layout)">
                  <StringList value={settings.story.images} onChange={v => patch(s => ({ ...s, story: { ...s.story, images: v } }))} placeholder="/photos/…" />
                </Field>
              </div>
            </Card>

            {/* Stats */}
            <Card title="Stats (4-column strip)" kanji="数">
              <div className="space-y-3">
                {settings.stats.map((st, i) => (
                  <div key={i} className="grid sm:grid-cols-[100px_1fr_1fr_auto] gap-3 items-end">
                    <Field label="Kanji"><input className={inputCls} value={st.kanji} onChange={e => patch(s => ({ ...s, stats: s.stats.map((x,j) => j===i ? { ...x, kanji: e.target.value } : x) }))} /></Field>
                    <Field label="Value"><input className={inputCls} value={st.value} onChange={e => patch(s => ({ ...s, stats: s.stats.map((x,j) => j===i ? { ...x, value: e.target.value } : x) }))} /></Field>
                    <Field label="Label"><input className={inputCls} value={st.label} onChange={e => patch(s => ({ ...s, stats: s.stats.map((x,j) => j===i ? { ...x, label: e.target.value } : x) }))} /></Field>
                    <button onClick={() => patch(s => ({ ...s, stats: s.stats.filter((_,j) => j !== i) }))} className="px-3 py-2 text-stone-400 hover:text-red-600 text-lg">×</button>
                  </div>
                ))}
                <button onClick={() => patch(s => ({ ...s, stats: [...s.stats, { kanji: "", value: "", label: "" } as StatItem] }))} className="text-xs px-3 py-1.5 border border-dashed border-stone-300 rounded-lg text-stone-500 hover:border-stone-500 hover:text-stone-700">
                  + Add stat
                </button>
              </div>
            </Card>

            {/* Chapters */}
            <Card title="Journey Chapters" kanji="章">
              <div className="space-y-4">
                {settings.chapters.map((ch, i) => (
                  <div key={i} className="border border-stone-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Chapter {String(i+1).padStart(2, "0")}</span>
                      <div className="flex gap-2">
                        <button disabled={i === 0} onClick={() => patch(s => { const a = [...s.chapters]; [a[i-1], a[i]] = [a[i], a[i-1]]; return { ...s, chapters: a }; })} className="text-xs px-2 py-1 text-stone-500 hover:text-stone-800 disabled:opacity-30">↑</button>
                        <button disabled={i === settings.chapters.length-1} onClick={() => patch(s => { const a = [...s.chapters]; [a[i+1], a[i]] = [a[i], a[i+1]]; return { ...s, chapters: a }; })} className="text-xs px-2 py-1 text-stone-500 hover:text-stone-800 disabled:opacity-30">↓</button>
                        <button onClick={() => patch(s => ({ ...s, chapters: s.chapters.filter((_,j) => j !== i) }))} className="text-xs px-2 py-1 text-stone-400 hover:text-red-600">Remove</button>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3 mb-3">
                      <Field label="Kanji"><input className={inputCls} value={ch.kanji} onChange={e => patch(s => ({ ...s, chapters: s.chapters.map((x,j) => j===i ? { ...x, kanji: e.target.value } : x) }))} /></Field>
                      <Field label="Romaji"><input className={inputCls} value={ch.romaji} onChange={e => patch(s => ({ ...s, chapters: s.chapters.map((x,j) => j===i ? { ...x, romaji: e.target.value } : x) }))} /></Field>
                      <Field label="Title"><input className={inputCls} value={ch.title} onChange={e => patch(s => ({ ...s, chapters: s.chapters.map((x,j) => j===i ? { ...x, title: e.target.value } : x) }))} /></Field>
                    </div>
                    <Field label="Body"><textarea className={inputCls} rows={3} value={ch.body} onChange={e => patch(s => ({ ...s, chapters: s.chapters.map((x,j) => j===i ? { ...x, body: e.target.value } : x) }))} /></Field>
                    <div className="mt-3">
                      <Field label="Image path/URL"><input className={inputCls} value={ch.imageUrl} onChange={e => patch(s => ({ ...s, chapters: s.chapters.map((x,j) => j===i ? { ...x, imageUrl: e.target.value } : x) }))} /></Field>
                    </div>
                  </div>
                ))}
                <button onClick={() => patch(s => ({ ...s, chapters: [...s.chapters, { kanji: "", romaji: "", title: "", body: "", imageUrl: "" } as Chapter] }))} className="text-xs px-3 py-1.5 border border-dashed border-stone-300 rounded-lg text-stone-500 hover:border-stone-500 hover:text-stone-700">
                  + Add chapter
                </button>
              </div>
            </Card>

            {/* Included */}
            <Card title="What's Included" kanji="含">
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <Field label="Kanji"><input className={inputCls} value={settings.included.kanji} onChange={e => patch(s => ({ ...s, included: { ...s.included, kanji: e.target.value } }))} /></Field>
                <Field label="Eyebrow"><input className={inputCls} value={settings.included.eyebrow} onChange={e => patch(s => ({ ...s, included: { ...s.included, eyebrow: e.target.value } }))} /></Field>
                <Field label="Heading"><input className={inputCls} value={settings.included.heading} onChange={e => patch(s => ({ ...s, included: { ...s.included, heading: e.target.value } }))} /></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Field label="Included items">
                    <StringList value={settings.included.included} onChange={v => patch(s => ({ ...s, included: { ...s.included, included: v } }))} />
                  </Field>
                </div>
                <div>
                  <Field label="Not included">
                    <StringList value={settings.included.notIncluded} onChange={v => patch(s => ({ ...s, included: { ...s.included, notIncluded: v } }))} />
                  </Field>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Field label="Food image path/URL"><input className={inputCls} value={settings.included.foodImage} onChange={e => patch(s => ({ ...s, included: { ...s.included, foodImage: e.target.value } }))} /></Field>
                <Field label="Food caption"><input className={inputCls} value={settings.included.foodCaption} onChange={e => patch(s => ({ ...s, included: { ...s.included, foodCaption: e.target.value } }))} /></Field>
              </div>
            </Card>

            {/* Pricing Section copy */}
            <Card title="Pricing Section (copy only)" kanji="料">
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <Field label="Kanji"><input className={inputCls} value={settings.pricingSection.kanji} onChange={e => patch(s => ({ ...s, pricingSection: { ...s.pricingSection, kanji: e.target.value } }))} /></Field>
                <Field label="Eyebrow"><input className={inputCls} value={settings.pricingSection.eyebrow} onChange={e => patch(s => ({ ...s, pricingSection: { ...s.pricingSection, eyebrow: e.target.value } }))} /></Field>
                <Field label="Heading"><input className={inputCls} value={settings.pricingSection.heading} onChange={e => patch(s => ({ ...s, pricingSection: { ...s.pricingSection, heading: e.target.value } }))} /></Field>
              </div>
              <Field label="Backdrop image">
                <input className={inputCls} value={settings.pricingSection.backdropImage} onChange={e => patch(s => ({ ...s, pricingSection: { ...s.pricingSection, backdropImage: e.target.value } }))} />
              </Field>
              <div className="grid sm:grid-cols-2 gap-6 mt-4">
                <div className="space-y-3">
                  <Field label="Private description"><textarea className={inputCls} rows={2} value={settings.pricingSection.privateDescription} onChange={e => patch(s => ({ ...s, pricingSection: { ...s.pricingSection, privateDescription: e.target.value } }))} /></Field>
                  <Field label="Private bullets">
                    <StringList value={settings.pricingSection.privateBullets} onChange={v => patch(s => ({ ...s, pricingSection: { ...s.pricingSection, privateBullets: v } }))} />
                  </Field>
                </div>
                <div className="space-y-3">
                  <Field label="Group description"><textarea className={inputCls} rows={2} value={settings.pricingSection.groupDescription} onChange={e => patch(s => ({ ...s, pricingSection: { ...s.pricingSection, groupDescription: e.target.value } }))} /></Field>
                  <Field label="Group bullets">
                    <StringList value={settings.pricingSection.groupBullets} onChange={v => patch(s => ({ ...s, pricingSection: { ...s.pricingSection, groupBullets: v } }))} />
                  </Field>
                </div>
              </div>
            </Card>

            {/* Reviews */}
            <Card title="Traveler Voices (Reviews)" kanji="声">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label="Eyebrow"><input className={inputCls} value={settings.reviews.eyebrow} onChange={e => patch(s => ({ ...s, reviews: { ...s.reviews, eyebrow: e.target.value } }))} /></Field>
                <Field label="Heading"><input className={inputCls} value={settings.reviews.heading} onChange={e => patch(s => ({ ...s, reviews: { ...s.reviews, heading: e.target.value } }))} /></Field>
              </div>
              <div className="space-y-4">
                {settings.reviews.items.map((r, i) => (
                  <div key={i} className="border border-stone-200 rounded-xl p-4">
                    <div className="grid sm:grid-cols-[1fr_1fr_100px_auto] gap-3 mb-3">
                      <Field label="Name"><input className={inputCls} value={r.name} onChange={e => patch(s => ({ ...s, reviews: { ...s.reviews, items: s.reviews.items.map((x,j) => j===i ? { ...x, name: e.target.value } : x) } }))} /></Field>
                      <Field label="Date"><input className={inputCls} value={r.date} onChange={e => patch(s => ({ ...s, reviews: { ...s.reviews, items: s.reviews.items.map((x,j) => j===i ? { ...x, date: e.target.value } : x) } }))} /></Field>
                      <Field label="Stars"><input type="number" min={0} max={5} className={inputCls} value={r.stars} onChange={e => patch(s => ({ ...s, reviews: { ...s.reviews, items: s.reviews.items.map((x,j) => j===i ? { ...x, stars: +e.target.value } : x) } }))} /></Field>
                      <button onClick={() => patch(s => ({ ...s, reviews: { ...s.reviews, items: s.reviews.items.filter((_,j) => j !== i) } }))} className="px-3 self-end py-2 text-stone-400 hover:text-red-600 text-lg">×</button>
                    </div>
                    <Field label="Review text"><textarea className={inputCls} rows={3} value={r.body} onChange={e => patch(s => ({ ...s, reviews: { ...s.reviews, items: s.reviews.items.map((x,j) => j===i ? { ...x, body: e.target.value } : x) } }))} /></Field>
                    <div className="mt-3">
                      <Field label="Photo URLs (optional)">
                        <StringList value={r.photos} onChange={v => patch(s => ({ ...s, reviews: { ...s.reviews, items: s.reviews.items.map((x,j) => j===i ? { ...x, photos: v } : x) } }))} />
                      </Field>
                    </div>
                  </div>
                ))}
                <button onClick={() => patch(s => ({ ...s, reviews: { ...s.reviews, items: [...s.reviews.items, { name: "", date: "", stars: 5, body: "", photos: [] } as Review] } }))} className="text-xs px-3 py-1.5 border border-dashed border-stone-300 rounded-lg text-stone-500 hover:border-stone-500 hover:text-stone-700">
                  + Add review
                </button>
              </div>
            </Card>

            {/* FAQ */}
            <Card title="FAQ" kanji="問">
              <div className="space-y-3">
                {settings.faq.map((f, i) => (
                  <div key={i} className="border border-stone-200 rounded-xl p-4">
                    <div className="flex justify-end mb-2">
                      <button onClick={() => patch(s => ({ ...s, faq: s.faq.filter((_,j) => j !== i) }))} className="text-xs text-stone-400 hover:text-red-600">Remove</button>
                    </div>
                    <Field label="Question"><input className={inputCls} value={f.q} onChange={e => patch(s => ({ ...s, faq: s.faq.map((x,j) => j===i ? { ...x, q: e.target.value } : x) }))} /></Field>
                    <div className="mt-3">
                      <Field label="Answer"><textarea className={inputCls} rows={3} value={f.a} onChange={e => patch(s => ({ ...s, faq: s.faq.map((x,j) => j===i ? { ...x, a: e.target.value } : x) }))} /></Field>
                    </div>
                  </div>
                ))}
                <button onClick={() => patch(s => ({ ...s, faq: [...s.faq, { q: "", a: "" } as FAQItem] }))} className="text-xs px-3 py-1.5 border border-dashed border-stone-300 rounded-lg text-stone-500 hover:border-stone-500 hover:text-stone-700">
                  + Add question
                </button>
              </div>
            </Card>

            {/* Contact */}
            <Card title="Contact" kanji="連">
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Email"><input className={inputCls} value={settings.contact.email} onChange={e => patch(s => ({ ...s, contact: { ...s.contact, email: e.target.value } }))} /></Field>
                <Field label="Meeting point name"><input className={inputCls} value={settings.contact.meetingPoint} onChange={e => patch(s => ({ ...s, contact: { ...s.contact, meetingPoint: e.target.value } }))} /></Field>
                <Field label="Meeting point address"><input className={inputCls} value={settings.contact.meetingPointAddress} onChange={e => patch(s => ({ ...s, contact: { ...s.contact, meetingPointAddress: e.target.value } }))} /></Field>
              </div>
            </Card>
          </div>
        )}

        {/* ── Operations tab ── */}
        {tab === "operations" && (
          <div className="space-y-6 pb-24">
            <Card title="Pricing" kanji="円">
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
                        <input type="number" value={settings.pricing.private[key]} onChange={e => patch(s => ({ ...s, pricing: { ...s.pricing, private: { ...s.pricing.private, [key]: +e.target.value } } }))} className="w-28 px-3 py-2 border border-stone-300 rounded-lg text-sm text-right" />
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
                        <input type="number" value={settings.pricing.group[key]} onChange={e => patch(s => ({ ...s, pricing: { ...s.pricing, group: { ...s.pricing.group, [key]: +e.target.value } } }))} className="w-28 px-3 py-2 border border-stone-300 rounded-lg text-sm text-right" />
                      </label>
                    ))}
                    <label className="flex items-center justify-between gap-4">
                      <span className="text-sm text-stone-600">Max participants</span>
                      <input type="number" value={settings.maxParticipants} onChange={e => patch(s => ({ ...s, maxParticipants: +e.target.value }))} className="w-28 px-3 py-2 border border-stone-300 rounded-lg text-sm text-right" />
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Sessions" kanji="時">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="border border-stone-200 rounded-xl p-5">
                  <div className="font-medium text-stone-800 mb-4">Group Departure</div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Start"><input type="time" className={inputCls} value={settings.sessions.groupDeparture.startTime} onChange={e => patch(s => ({ ...s, sessions: { ...s.sessions, groupDeparture: { ...s.sessions.groupDeparture, startTime: e.target.value } } }))} /></Field>
                    <Field label="End"><input type="time" className={inputCls} value={settings.sessions.groupDeparture.endTime} onChange={e => patch(s => ({ ...s, sessions: { ...s.sessions, groupDeparture: { ...s.sessions.groupDeparture, endTime: e.target.value } } }))} /></Field>
                  </div>
                </div>
                <div className="border border-stone-200 rounded-xl p-5">
                  <div className="font-medium text-stone-800 mb-4">Private Start Window</div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Earliest"><input type="time" className={inputCls} value={settings.sessions.privateWindow.earliestStart} onChange={e => patch(s => ({ ...s, sessions: { ...s.sessions, privateWindow: { ...s.sessions.privateWindow, earliestStart: e.target.value } } }))} /></Field>
                    <Field label="Latest"><input type="time" className={inputCls} value={settings.sessions.privateWindow.latestStart} onChange={e => patch(s => ({ ...s, sessions: { ...s.sessions, privateWindow: { ...s.sessions.privateWindow, latestStart: e.target.value } } }))} /></Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Duration (hours)"><input type="number" min={1} max={8} className={inputCls} value={settings.sessions.privateWindow.durationHours} onChange={e => patch(s => ({ ...s, sessions: { ...s.sessions, privateWindow: { ...s.sessions.privateWindow, durationHours: +e.target.value } } }))} /></Field>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Field label="Arrive early (minutes)"><input type="number" min={0} max={60} className={inputCls + " max-w-[8rem]"} value={settings.sessions.arriveEarlyMinutes} onChange={e => patch(s => ({ ...s, sessions: { ...s.sessions, arriveEarlyMinutes: +e.target.value } }))} /></Field>
              </div>
            </Card>

            <Card title="Blocked Dates" kanji="休">
              <div className="flex gap-3 mb-4">
                <input type="date" id="blockDateInput" min={new Date().toISOString().split("T")[0]} className={inputCls + " max-w-xs"} />
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
            </Card>

            <Card title="Announcement Banner" kanji="告">
              <textarea
                value={settings.announcement}
                onChange={e => patch(s => ({ ...s, announcement: e.target.value }))}
                rows={3}
                placeholder="Optional message shown above the booking form (leave empty to hide)"
                className={inputCls + " resize-none"}
              />
            </Card>

            <Card title="Tour Name" kanji="名">
              <input className={inputCls} value={settings.tourName} onChange={e => patch(s => ({ ...s, tourName: e.target.value }))} />
            </Card>
          </div>
        )}

        {/* Sticky Save bar (only on content/operations) */}
        {tab !== "bookings" && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-lg z-40">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
              <div className="text-sm">
                {saveError && <span className="text-red-600">{saveError}</span>}
                {saved && (
                  <span className="flex items-center gap-2 text-green-700 font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                    Saved!
                  </span>
                )}
                {!saveError && !saved && <span className="text-stone-400">Changes aren&apos;t live until you save.</span>}
              </div>
              <button onClick={saveSettings} className="px-6 py-2.5 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-700 transition-colors">
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
