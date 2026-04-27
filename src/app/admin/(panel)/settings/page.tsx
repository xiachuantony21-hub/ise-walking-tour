"use client";

import { useState } from "react";
import type { Chapter, HeroSlide, StatItem } from "@/lib/data";
import { useSettings } from "../../_lib/useSettings";
import { Card, Field, ImageField, ImageList, SaveBar, StringList, inputCls } from "../../_lib/primitives";

type SubTab = "site" | "content" | "operations";

export default function SettingsPage() {
  const { settings, loading, saving, saved, saveError, patch, save } = useSettings();
  const [tab, setTab] = useState<SubTab>("site");

  if (loading || !settings) return <p className="text-sm text-stone-400">Loading…</p>;

  const toggleBlockedDate = (date: string) => {
    patch(s => ({
      ...s,
      blockedDates: s.blockedDates.includes(date)
        ? s.blockedDates.filter(d => d !== date)
        : [...s.blockedDates, date].sort(),
    }));
  };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">サイト設定</h1>
        <p className="text-sm text-stone-500 mt-1">Settings</p>
      </div>

      <p className="text-xs text-stone-500 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        💡 画像はドラッグ＆ドロップでアップロードできます（最大10MB）。テキスト欄は <code className="bg-white px-1.5 py-0.5 rounded">&lt;em&gt;word&lt;/em&gt;</code> と <code className="bg-white px-1.5 py-0.5 rounded">&lt;br/&gt;</code> が使えます。
      </p>

      <div className="flex gap-1 bg-white rounded-xl p-1 border border-stone-200 w-fit shadow-sm">
        {([
          { k: "site",       label: "🏠 Site (homepage)" },
          { k: "content",    label: "✍️ Tour content (Ise)" },
          { k: "operations", label: "⚙️ Operations" },
        ] as { k: SubTab; label: string }[]).map(t => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.k ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-800"
            }`}
          >{t.label}</button>
        ))}
      </div>

      {tab === "site" && (
        <div className="space-y-6">
          <Card title="Brand" kanji="名">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Brand name">
                <input className={inputCls} value={settings.site.brandName} onChange={e => patch(s => ({ ...s, site: { ...s.site, brandName: e.target.value } }))} />
              </Field>
              <Field label="Tagline">
                <input className={inputCls} value={settings.site.brandTagline} onChange={e => patch(s => ({ ...s, site: { ...s.site, brandTagline: e.target.value } }))} />
              </Field>
            </div>
          </Card>

          <Card title="Home Hero" kanji="表">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Field label="Eyebrow">
                <input className={inputCls} value={settings.site.homeHero.eyebrow} onChange={e => patch(s => ({ ...s, site: { ...s.site, homeHero: { ...s.site.homeHero, eyebrow: e.target.value } } }))} />
              </Field>
              <Field label="Subheading">
                <input className={inputCls} value={settings.site.homeHero.subheading} onChange={e => patch(s => ({ ...s, site: { ...s.site, homeHero: { ...s.site.homeHero, subheading: e.target.value } } }))} />
              </Field>
            </div>
            <Field label="Heading (allows <em> and <br/>)">
              <textarea className={inputCls} rows={2} value={settings.site.homeHero.heading} onChange={e => patch(s => ({ ...s, site: { ...s.site, homeHero: { ...s.site.homeHero, heading: e.target.value } } }))} />
            </Field>
            <div className="mt-4">
              <Field label="Background image">
                <ImageField value={settings.site.homeHero.backgroundImage} onChange={v => patch(s => ({ ...s, site: { ...s.site, homeHero: { ...s.site.homeHero, backgroundImage: v } } }))} />
              </Field>
            </div>
          </Card>

          <Card title="Category Cards (4 tiles on home)" kanji="道">
            <div className="space-y-4">
              {settings.site.categories.map((c, i) => (
                <div key={c.key} className="border border-stone-200 rounded-xl p-4">
                  <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">{c.key}</div>
                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <Field label="Title">
                      <input className={inputCls} value={c.title} onChange={e => patch(s => ({ ...s, site: { ...s.site, categories: s.site.categories.map((x, j) => j === i ? { ...x, title: e.target.value } : x) } }))} />
                    </Field>
                    <Field label="Kanji">
                      <input className={inputCls} value={c.kanji} onChange={e => patch(s => ({ ...s, site: { ...s.site, categories: s.site.categories.map((x, j) => j === i ? { ...x, kanji: e.target.value } : x) } }))} />
                    </Field>
                  </div>
                  <Field label="Blurb">
                    <input className={inputCls} value={c.blurb} onChange={e => patch(s => ({ ...s, site: { ...s.site, categories: s.site.categories.map((x, j) => j === i ? { ...x, blurb: e.target.value } : x) } }))} />
                  </Field>
                  <div className="mt-3 grid sm:grid-cols-2 gap-3">
                    <Field label="Status">
                      <select
                        className={inputCls}
                        value={c.status}
                        onChange={e => patch(s => ({ ...s, site: { ...s.site, categories: s.site.categories.map((x, j) => j === i ? { ...x, status: e.target.value as "live" | "construction" } : x) } }))}
                      >
                        <option value="live">Live</option>
                        <option value="construction">Under Construction</option>
                      </select>
                    </Field>
                    <Field label="Image">
                      <ImageField value={c.image} onChange={v => patch(s => ({ ...s, site: { ...s.site, categories: s.site.categories.map((x, j) => j === i ? { ...x, image: v } : x) } }))} />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Store Page" kanji="店">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Field label="Eyebrow">
                <input className={inputCls} value={settings.site.store.eyebrow} onChange={e => patch(s => ({ ...s, site: { ...s.site, store: { ...s.site.store, eyebrow: e.target.value } } }))} />
              </Field>
              <Field label="Heading">
                <input className={inputCls} value={settings.site.store.heading} onChange={e => patch(s => ({ ...s, site: { ...s.site, store: { ...s.site.store, heading: e.target.value } } }))} />
              </Field>
              <Field label="Address">
                <input className={inputCls} value={settings.site.store.address} onChange={e => patch(s => ({ ...s, site: { ...s.site, store: { ...s.site.store, address: e.target.value } } }))} />
              </Field>
              <Field label="Hours">
                <input className={inputCls} value={settings.site.store.hours} onChange={e => patch(s => ({ ...s, site: { ...s.site, store: { ...s.site.store, hours: e.target.value } } }))} />
              </Field>
            </div>
            <Field label="Paragraphs">
              <StringList value={settings.site.store.paragraphs} onChange={v => patch(s => ({ ...s, site: { ...s.site, store: { ...s.site.store, paragraphs: v } } }))} placeholder="A paragraph…" />
            </Field>
            <div className="mt-4">
              <Field label="Images">
                <ImageList value={settings.site.store.images} onChange={v => patch(s => ({ ...s, site: { ...s.site, store: { ...s.site.store, images: v } } }))} />
              </Field>
            </div>
          </Card>

          <Card title="Contact" kanji="連">
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Email"><input className={inputCls} value={settings.contact.email} onChange={e => patch(s => ({ ...s, contact: { ...s.contact, email: e.target.value } }))} /></Field>
              <Field label="Meeting point name"><input className={inputCls} value={settings.contact.meetingPoint} onChange={e => patch(s => ({ ...s, contact: { ...s.contact, meetingPoint: e.target.value } }))} /></Field>
              <Field label="Meeting point address"><input className={inputCls} value={settings.contact.meetingPointAddress} onChange={e => patch(s => ({ ...s, contact: { ...s.contact, meetingPointAddress: e.target.value } }))} /></Field>
            </div>
          </Card>
        </div>
      )}

      {tab === "content" && (
        <div className="space-y-6">
          <p className="text-xs text-stone-500">伊勢ツアー (`/tours/ise-sacred-walk`) の詳細ページの内容です。</p>

          <Card title="Hero (first screen)" kanji="一">
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <Field label="Eyebrow"><input className={inputCls} value={settings.hero.eyebrow} onChange={e => patch(s => ({ ...s, hero: { ...s.hero, eyebrow: e.target.value } }))} /></Field>
              <Field label="Subheading"><input className={inputCls} value={settings.hero.subheading} onChange={e => patch(s => ({ ...s, hero: { ...s.hero, subheading: e.target.value } }))} /></Field>
            </div>
            <Field label="Heading (allows <em>/<br/>)">
              <textarea className={inputCls} rows={2} value={settings.hero.heading} onChange={e => patch(s => ({ ...s, hero: { ...s.hero, heading: e.target.value } }))} />
            </Field>
            <div className="mt-6">
              <div className="text-xs font-medium text-stone-600 mb-2">Slides (background rotation)</div>
              <div className="space-y-3">
                {settings.hero.slides.map((sl, i) => (
                  <div key={i} className="border border-stone-200 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Slide {i+1}</span>
                      <button onClick={() => patch(s => ({ ...s, hero: { ...s.hero, slides: s.hero.slides.filter((_, j) => j !== i) } }))} className="text-xs text-stone-400 hover:text-red-600">Remove</button>
                    </div>
                    <Field label="Image">
                      <ImageField value={sl.imageUrl} onChange={v => patch(s => ({ ...s, hero: { ...s.hero, slides: s.hero.slides.map((x,j) => j===i ? { ...x, imageUrl: v } : x) } }))} />
                    </Field>
                    <div className="grid sm:grid-cols-2 gap-3 mt-3">
                      <Field label="Kanji"><input className={inputCls} value={sl.kanji} onChange={e => patch(s => ({ ...s, hero: { ...s.hero, slides: s.hero.slides.map((x,j) => j===i ? { ...x, kanji: e.target.value } : x) } }))} /></Field>
                      <Field label="Caption"><input className={inputCls} value={sl.caption} onChange={e => patch(s => ({ ...s, hero: { ...s.hero, slides: s.hero.slides.map((x,j) => j===i ? { ...x, caption: e.target.value } : x) } }))} /></Field>
                    </div>
                  </div>
                ))}
                <button onClick={() => patch(s => ({ ...s, hero: { ...s.hero, slides: [...s.hero.slides, { imageUrl: "", kanji: "", caption: "" } as HeroSlide] } }))} className="text-xs px-3 py-1.5 border border-dashed border-stone-300 rounded-lg text-stone-500 hover:border-stone-500 hover:text-stone-700">+ Add slide</button>
              </div>
            </div>
          </Card>

          <Card title="Our Story" kanji="物語">
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <Field label="Kanji"><input className={inputCls} value={settings.story.kanji} onChange={e => patch(s => ({ ...s, story: { ...s.story, kanji: e.target.value } }))} /></Field>
              <Field label="Eyebrow"><input className={inputCls} value={settings.story.eyebrow} onChange={e => patch(s => ({ ...s, story: { ...s.story, eyebrow: e.target.value } }))} /></Field>
              <Field label="Heading"><input className={inputCls} value={settings.story.heading} onChange={e => patch(s => ({ ...s, story: { ...s.story, heading: e.target.value } }))} /></Field>
            </div>
            <Field label="Paragraphs">
              <StringList value={settings.story.paragraphs} onChange={v => patch(s => ({ ...s, story: { ...s.story, paragraphs: v } }))} placeholder="A paragraph…" />
            </Field>
            <div className="mt-4">
              <Field label="Collage images (4 best)">
                <ImageList value={settings.story.images} onChange={v => patch(s => ({ ...s, story: { ...s.story, images: v } }))} />
              </Field>
            </div>
          </Card>

          <Card title="Stats (4-column strip)" kanji="数">
            <div className="space-y-3">
              {settings.stats.map((st, i) => (
                <div key={i} className="grid sm:grid-cols-[100px_1fr_1fr_auto] gap-3 items-end">
                  <Field label="Kanji"><input className={inputCls} value={st.kanji} onChange={e => patch(s => ({ ...s, stats: s.stats.map((x,j) => j===i ? { ...x, kanji: e.target.value } : x) }))} /></Field>
                  <Field label="Value"><input className={inputCls} value={st.value} onChange={e => patch(s => ({ ...s, stats: s.stats.map((x,j) => j===i ? { ...x, value: e.target.value } : x) }))} /></Field>
                  <Field label="Label"><input className={inputCls} value={st.label} onChange={e => patch(s => ({ ...s, stats: s.stats.map((x,j) => j===i ? { ...x, label: e.target.value } : x) }))} /></Field>
                  <button onClick={() => patch(s => ({ ...s, stats: s.stats.filter((_, j) => j !== i) }))} className="px-3 py-2 text-stone-400 hover:text-red-600 text-lg">×</button>
                </div>
              ))}
              <button onClick={() => patch(s => ({ ...s, stats: [...s.stats, { kanji: "", value: "", label: "" } as StatItem] }))} className="text-xs px-3 py-1.5 border border-dashed border-stone-300 rounded-lg text-stone-500 hover:border-stone-500 hover:text-stone-700">+ Add stat</button>
            </div>
          </Card>

          <Card title="Journey Chapters" kanji="章">
            <div className="space-y-4">
              {settings.chapters.map((ch, i) => (
                <div key={i} className="border border-stone-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Chapter {String(i+1).padStart(2, "0")}</span>
                    <div className="flex gap-2">
                      <button disabled={i === 0} onClick={() => patch(s => { const a = [...s.chapters]; [a[i-1], a[i]] = [a[i], a[i-1]]; return { ...s, chapters: a }; })} className="text-xs px-2 py-1 text-stone-500 hover:text-stone-800 disabled:opacity-30">↑</button>
                      <button disabled={i === settings.chapters.length - 1} onClick={() => patch(s => { const a = [...s.chapters]; [a[i+1], a[i]] = [a[i], a[i+1]]; return { ...s, chapters: a }; })} className="text-xs px-2 py-1 text-stone-500 hover:text-stone-800 disabled:opacity-30">↓</button>
                      <button onClick={() => patch(s => ({ ...s, chapters: s.chapters.filter((_, j) => j !== i) }))} className="text-xs px-2 py-1 text-stone-400 hover:text-red-600">Remove</button>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3 mb-3">
                    <Field label="Kanji"><input className={inputCls} value={ch.kanji} onChange={e => patch(s => ({ ...s, chapters: s.chapters.map((x,j) => j===i ? { ...x, kanji: e.target.value } : x) }))} /></Field>
                    <Field label="Romaji"><input className={inputCls} value={ch.romaji} onChange={e => patch(s => ({ ...s, chapters: s.chapters.map((x,j) => j===i ? { ...x, romaji: e.target.value } : x) }))} /></Field>
                    <Field label="Title"><input className={inputCls} value={ch.title} onChange={e => patch(s => ({ ...s, chapters: s.chapters.map((x,j) => j===i ? { ...x, title: e.target.value } : x) }))} /></Field>
                  </div>
                  <Field label="Body"><textarea className={inputCls} rows={3} value={ch.body} onChange={e => patch(s => ({ ...s, chapters: s.chapters.map((x,j) => j===i ? { ...x, body: e.target.value } : x) }))} /></Field>
                  <div className="mt-3">
                    <Field label="Image"><ImageField value={ch.imageUrl} onChange={v => patch(s => ({ ...s, chapters: s.chapters.map((x,j) => j===i ? { ...x, imageUrl: v } : x) }))} /></Field>
                  </div>
                </div>
              ))}
              <button onClick={() => patch(s => ({ ...s, chapters: [...s.chapters, { kanji: "", romaji: "", title: "", body: "", imageUrl: "" } as Chapter] }))} className="text-xs px-3 py-1.5 border border-dashed border-stone-300 rounded-lg text-stone-500 hover:border-stone-500 hover:text-stone-700">+ Add chapter</button>
            </div>
          </Card>

          <Card title="What's Included" kanji="含">
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <Field label="Kanji"><input className={inputCls} value={settings.included.kanji} onChange={e => patch(s => ({ ...s, included: { ...s.included, kanji: e.target.value } }))} /></Field>
              <Field label="Eyebrow"><input className={inputCls} value={settings.included.eyebrow} onChange={e => patch(s => ({ ...s, included: { ...s.included, eyebrow: e.target.value } }))} /></Field>
              <Field label="Heading"><input className={inputCls} value={settings.included.heading} onChange={e => patch(s => ({ ...s, included: { ...s.included, heading: e.target.value } }))} /></Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <Field label="Included items">
                <StringList value={settings.included.included} onChange={v => patch(s => ({ ...s, included: { ...s.included, included: v } }))} />
              </Field>
              <Field label="Not included">
                <StringList value={settings.included.notIncluded} onChange={v => patch(s => ({ ...s, included: { ...s.included, notIncluded: v } }))} />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <Field label="Food image"><ImageField value={settings.included.foodImage} onChange={v => patch(s => ({ ...s, included: { ...s.included, foodImage: v } }))} /></Field>
              <Field label="Food caption"><input className={inputCls} value={settings.included.foodCaption} onChange={e => patch(s => ({ ...s, included: { ...s.included, foodCaption: e.target.value } }))} /></Field>
            </div>
          </Card>

          <Card title="Pricing Section (copy only)" kanji="料">
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <Field label="Kanji"><input className={inputCls} value={settings.pricingSection.kanji} onChange={e => patch(s => ({ ...s, pricingSection: { ...s.pricingSection, kanji: e.target.value } }))} /></Field>
              <Field label="Eyebrow"><input className={inputCls} value={settings.pricingSection.eyebrow} onChange={e => patch(s => ({ ...s, pricingSection: { ...s.pricingSection, eyebrow: e.target.value } }))} /></Field>
              <Field label="Heading"><input className={inputCls} value={settings.pricingSection.heading} onChange={e => patch(s => ({ ...s, pricingSection: { ...s.pricingSection, heading: e.target.value } }))} /></Field>
            </div>
            <Field label="Backdrop image">
              <ImageField value={settings.pricingSection.backdropImage} onChange={v => patch(s => ({ ...s, pricingSection: { ...s.pricingSection, backdropImage: v } }))} />
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
        </div>
      )}

      {tab === "operations" && (
        <div className="space-y-6">
          <Card title="Pricing" kanji="円">
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-semibold text-stone-600 mb-4 uppercase tracking-wider">Private Tour</h4>
                <div className="space-y-3">
                  {[
                    { label: "Base price (¥)", key: "basePrice" as const },
                    { label: "Base persons", key: "basePersons" as const },
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
                    { label: "Min participants", key: "minParticipants" as const },
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
                  if (el?.value) { toggleBlockedDate(el.value); el.value = ""; }
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-700 transition-colors"
              >Add date</button>
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

          <Card title="Default Tour Name" kanji="名">
            <input className={inputCls} value={settings.tourName} onChange={e => patch(s => ({ ...s, tourName: e.target.value }))} />
          </Card>
        </div>
      )}

      <SaveBar saving={saving} saved={saved} saveError={saveError} onSave={save} />
    </div>
  );
}
