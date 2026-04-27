"use client";

import type { FAQItem } from "@/lib/data";
import { useSettings } from "../../_lib/useSettings";
import { Card, Field, SaveBar, inputCls } from "../../_lib/primitives";

export default function FaqAdminPage() {
  const { settings, loading, saving, saved, saveError, patch, save } = useSettings();
  if (loading || !settings) return <p className="text-sm text-stone-400">Loading…</p>;

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">FAQ管理</h1>
        <p className="text-sm text-stone-500 mt-1">FAQ ({settings.faq.length})</p>
      </div>

      <Card title="Frequently Asked Questions" kanji="問">
        <div className="space-y-3">
          {settings.faq.map((f, i) => (
            <div key={i} className="border border-stone-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Question {i + 1}</span>
                <div className="flex gap-2">
                  <button
                    disabled={i === 0}
                    onClick={() => patch(s => { const a = [...s.faq]; [a[i-1], a[i]] = [a[i], a[i-1]]; return { ...s, faq: a }; })}
                    className="text-xs px-2 py-1 text-stone-500 hover:text-stone-800 disabled:opacity-30"
                  >↑</button>
                  <button
                    disabled={i === settings.faq.length - 1}
                    onClick={() => patch(s => { const a = [...s.faq]; [a[i+1], a[i]] = [a[i], a[i+1]]; return { ...s, faq: a }; })}
                    className="text-xs px-2 py-1 text-stone-500 hover:text-stone-800 disabled:opacity-30"
                  >↓</button>
                  <button
                    onClick={() => patch(s => ({ ...s, faq: s.faq.filter((_, j) => j !== i) }))}
                    className="text-xs text-stone-400 hover:text-red-600"
                  >Remove</button>
                </div>
              </div>
              <Field label="Question">
                <input className={inputCls} value={f.q} onChange={e => patch(s => ({ ...s, faq: s.faq.map((x, j) => j === i ? { ...x, q: e.target.value } : x) }))} />
              </Field>
              <div className="mt-3">
                <Field label="Answer">
                  <textarea className={inputCls} rows={3} value={f.a} onChange={e => patch(s => ({ ...s, faq: s.faq.map((x, j) => j === i ? { ...x, a: e.target.value } : x) }))} />
                </Field>
              </div>
            </div>
          ))}
          <button
            onClick={() => patch(s => ({ ...s, faq: [...s.faq, { q: "", a: "" } as FAQItem] }))}
            className="text-xs px-3 py-1.5 border border-dashed border-stone-300 rounded-lg text-stone-500 hover:border-stone-500 hover:text-stone-700"
          >+ Add question</button>
        </div>
      </Card>

      <SaveBar saving={saving} saved={saved} saveError={saveError} onSave={save} />
    </div>
  );
}
