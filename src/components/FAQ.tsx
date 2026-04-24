"use client";

import { useState } from "react";
import type { FAQItem as FAQItemT, Settings } from "@/lib/data";

function FAQItem({ q, a }: FAQItemT) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b last:border-0" style={{ borderColor: "var(--cream-deep)" }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className="font-serif text-lg leading-snug transition-colors" style={{ color: open ? "var(--accent)" : "var(--ink)" }}>
          {q}
        </span>
        <svg
          className={`w-5 h-5 flex-shrink-0 mt-1 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
          style={{ color: open ? "var(--accent)" : "var(--ink-soft)" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed pr-8 font-light" style={{ color: "var(--ink-soft)" }}>{a}</div>
      )}
    </div>
  );
}

export default function FAQ({ faq, contactEmail }: { faq: Settings["faq"]; contactEmail: string }) {
  return (
    <section id="faq" className="py-28 paper">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-kanji text-3xl mb-3">問</p>
          <p className="section-label">Questions</p>
          <h2 className="font-serif text-5xl md:text-6xl">
            Before you<br/>
            <em className="italic" style={{ color: "var(--accent)" }}>set out.</em>
          </h2>
          <span className="torii-line" />
        </div>
        <div className="border px-8" style={{ borderColor: "var(--cream-deep)", background: "var(--cream)" }}>
          {faq.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
        <p className="text-center text-sm mt-8" style={{ color: "var(--ink-soft)" }}>
          Still have questions?{" "}
          <a href={`mailto:${contactEmail}`} className="underline" style={{ color: "var(--accent)" }}>
            {contactEmail}
          </a>
        </p>
      </div>
    </section>
  );
}
