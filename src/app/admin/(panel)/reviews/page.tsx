"use client";

import type { Review } from "@/lib/data";
import { useSettings } from "../../_lib/useSettings";
import { Card, Field, ImageList, SaveBar, inputCls } from "../../_lib/primitives";

export default function ReviewsAdminPage() {
  const { settings, loading, saving, saved, saveError, patch, save } = useSettings();
  if (loading || !settings) return <p className="text-sm text-stone-400">Loading…</p>;

  const updateItem = (i: number, p: Partial<Review>) =>
    patch(s => ({
      ...s,
      reviews: { ...s.reviews, items: s.reviews.items.map((x, j) => j === i ? { ...x, ...p } : x) },
    }));

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">レビュー管理</h1>
        <p className="text-sm text-stone-500 mt-1">Reviews ({settings.reviews.items.length})</p>
      </div>

      <Card title="Section Heading" kanji="声">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Eyebrow">
            <input className={inputCls} value={settings.reviews.eyebrow} onChange={e => patch(s => ({ ...s, reviews: { ...s.reviews, eyebrow: e.target.value } }))} />
          </Field>
          <Field label="Heading">
            <input className={inputCls} value={settings.reviews.heading} onChange={e => patch(s => ({ ...s, reviews: { ...s.reviews, heading: e.target.value } }))} />
          </Field>
        </div>
      </Card>

      <Card title="Reviews" kanji="評">
        <div className="space-y-4">
          {settings.reviews.items.map((r, i) => (
            <div key={i} className="border border-stone-200 rounded-xl p-4">
              <div className="grid sm:grid-cols-[1fr_1fr_100px_auto] gap-3 mb-3">
                <Field label="Name">
                  <input className={inputCls} value={r.name} onChange={e => updateItem(i, { name: e.target.value })} />
                </Field>
                <Field label="Date">
                  <input className={inputCls} value={r.date} onChange={e => updateItem(i, { date: e.target.value })} />
                </Field>
                <Field label="Stars">
                  <input type="number" min={0} max={5} className={inputCls} value={r.stars} onChange={e => updateItem(i, { stars: +e.target.value })} />
                </Field>
                <button
                  onClick={() => patch(s => ({ ...s, reviews: { ...s.reviews, items: s.reviews.items.filter((_, j) => j !== i) } }))}
                  className="px-3 self-end py-2 text-stone-400 hover:text-red-600 text-lg"
                >×</button>
              </div>
              <Field label="Review text">
                <textarea className={inputCls} rows={3} value={r.body} onChange={e => updateItem(i, { body: e.target.value })} />
              </Field>
              <div className="mt-3">
                <Field label="Photos (optional)">
                  <ImageList value={r.photos} onChange={v => updateItem(i, { photos: v })} />
                </Field>
              </div>
            </div>
          ))}
          <button
            onClick={() => patch(s => ({ ...s, reviews: { ...s.reviews, items: [...s.reviews.items, { name: "", date: "", stars: 5, body: "", photos: [] }] } }))}
            className="text-xs px-3 py-1.5 border border-dashed border-stone-300 rounded-lg text-stone-500 hover:border-stone-500 hover:text-stone-700"
          >+ Add review</button>
        </div>
      </Card>

      <SaveBar saving={saving} saved={saved} saveError={saveError} onSave={save} />
    </div>
  );
}
