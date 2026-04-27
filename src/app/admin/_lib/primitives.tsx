"use client";

import { useState } from "react";

export const inputCls =
  "w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-stone-600">{label}</span>
      {hint && <span className="text-[10px] text-stone-400 block mt-0.5">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

export function Card({
  title,
  kanji,
  children,
}: {
  title: string;
  kanji: string;
  children: React.ReactNode;
}) {
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

export function ImageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Upload failed");
      onChange(j.url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex gap-2 items-start">
      <div className="flex-1 space-y-2">
        <input
          className={inputCls}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="/photos/example.jpg or https://…"
        />
        <label
          className={`flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed rounded-lg text-xs cursor-pointer transition-colors ${
            uploading
              ? "border-stone-200 text-stone-300"
              : "border-stone-300 text-stone-500 hover:border-stone-500 hover:text-stone-700"
          }`}
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={e => {
            e.preventDefault(); e.stopPropagation();
            const f = e.dataTransfer.files?.[0];
            if (f) upload(f);
          }}
        >
          {uploading ? "Uploading…" : "📁 Click or drag image to upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.currentTarget.value = "";
            }}
          />
        </label>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="w-20 h-20 object-cover rounded-lg border border-stone-200 flex-shrink-0"
          onError={e => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      )}
    </div>
  );
}

export function ImageList({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="space-y-3">
      {value.map((v, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1">
            <ImageField
              value={v}
              onChange={n => onChange(value.map((x, j) => (j === i ? n : x)))}
            />
          </div>
          <button
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="px-3 py-2 text-stone-400 hover:text-red-600 text-lg"
          >×</button>
        </div>
      ))}
      <button
        onClick={() => onChange([...value, ""])}
        className="text-xs px-3 py-1.5 border border-dashed border-stone-300 rounded-lg text-stone-500 hover:border-stone-500 hover:text-stone-700"
      >+ Add image</button>
    </div>
  );
}

export function StringList({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      {value.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={v}
            onChange={e => onChange(value.map((x, j) => (j === i ? e.target.value : x)))}
            className={inputCls}
            placeholder={placeholder}
          />
          <button
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="px-3 text-stone-400 hover:text-red-600 text-lg"
          >×</button>
        </div>
      ))}
      <button
        onClick={() => onChange([...value, ""])}
        className="text-xs px-3 py-1.5 border border-dashed border-stone-300 rounded-lg text-stone-500 hover:border-stone-500 hover:text-stone-700"
      >+ Add</button>
    </div>
  );
}

export function SaveBar({
  saving,
  saved,
  saveError,
  onSave,
}: {
  saving?: boolean;
  saved: boolean;
  saveError: string;
  onSave: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-lg z-40 md:left-64">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <div className="text-sm">
          {saveError && <span className="text-red-600">{saveError}</span>}
          {saved && (
            <span className="flex items-center gap-2 text-green-700 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
              </svg>
              Saved!
            </span>
          )}
          {!saveError && !saved && (
            <span className="text-stone-400">Changes aren&apos;t live until you save.</span>
          )}
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-6 py-2.5 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
