"use client";

import type { TourCard } from "@/lib/data";
import { useSettings } from "../../_lib/useSettings";
import { Card, Field, ImageField, SaveBar, inputCls } from "../../_lib/primitives";

const EMPTY: TourCard = {
  slug: "",
  name: "",
  kanji: "",
  summary: "",
  heroImage: "",
  durationLabel: "",
  fromPriceJpy: 0,
  location: "",
  active: true,
};

export default function ToursAdminPage() {
  const { settings, loading, saving, saved, saveError, patch, save } = useSettings();

  if (loading || !settings) return <p className="text-sm text-stone-400">Loading…</p>;

  const tours = settings.tours;

  const update = (i: number, t: Partial<TourCard>) =>
    patch(s => ({ ...s, tours: s.tours.map((x, j) => (j === i ? { ...x, ...t } : x)) }));

  const remove = (i: number) =>
    patch(s => ({ ...s, tours: s.tours.filter((_, j) => j !== i) }));

  const add = () =>
    patch(s => ({ ...s, tours: [...s.tours, { ...EMPTY, slug: `tour-${s.tours.length + 1}` }] }));

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">ツアー管理</h1>
        <p className="text-sm text-stone-500 mt-1">Tour Management ({tours.length})</p>
      </div>

      <p className="text-xs text-stone-500 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        💡 ここで一覧用のカード情報を編集します。詳細ページの中身（写真・物語・章立て・FAQ など）は現状「伊勢ツアー」のみ「サイト設定」から編集できます。新規ツアーは仮の詳細ページが表示されます。
      </p>

      <div className="space-y-4">
        {tours.map((t, i) => (
          <Card key={i} title={t.name || `Tour ${i + 1}`} kanji={t.kanji || "旅"}>
            <div className="flex justify-end -mt-4 mb-3">
              <label className="flex items-center gap-2 text-xs text-stone-600 mr-3">
                <input
                  type="checkbox"
                  checked={t.active}
                  onChange={e => update(i, { active: e.target.checked })}
                />
                Active
              </label>
              <button
                onClick={() => remove(i)}
                className="text-xs text-stone-400 hover:text-red-600"
              >Remove</button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Field label="Name" hint="Display name">
                <input className={inputCls} value={t.name} onChange={e => update(i, { name: e.target.value })} />
              </Field>
              <Field label="Slug" hint="URL: /tours/<slug>">
                <input className={inputCls} value={t.slug} onChange={e => update(i, { slug: e.target.value })} />
              </Field>
              <Field label="Kanji">
                <input className={inputCls} value={t.kanji} onChange={e => update(i, { kanji: e.target.value })} />
              </Field>
              <Field label="Location">
                <input className={inputCls} value={t.location} onChange={e => update(i, { location: e.target.value })} />
              </Field>
              <Field label="Duration label" hint='e.g. "3 hours"'>
                <input className={inputCls} value={t.durationLabel} onChange={e => update(i, { durationLabel: e.target.value })} />
              </Field>
              <Field label="From price (JPY)">
                <input
                  type="number"
                  className={inputCls}
                  value={t.fromPriceJpy}
                  onChange={e => update(i, { fromPriceJpy: +e.target.value })}
                />
              </Field>
            </div>
            <Field label="Summary">
              <textarea
                rows={2}
                className={inputCls}
                value={t.summary}
                onChange={e => update(i, { summary: e.target.value })}
              />
            </Field>
            <div className="mt-4">
              <Field label="Hero image">
                <ImageField value={t.heroImage} onChange={v => update(i, { heroImage: v })} />
              </Field>
            </div>
          </Card>
        ))}

        <button
          onClick={add}
          className="w-full px-4 py-3 border-2 border-dashed border-stone-300 rounded-2xl text-sm text-stone-500 hover:border-stone-500 hover:text-stone-800 transition-colors"
        >+ Add new tour</button>
      </div>

      <SaveBar saving={saving} saved={saved} saveError={saveError} onSave={save} />
    </div>
  );
}
