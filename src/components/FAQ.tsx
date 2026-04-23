"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What language is the tour conducted in?",
    a: "The tour is fully conducted in English by an expert bilingual guide.",
  },
  {
    q: "Where exactly is the meeting point?",
    a: "We meet at Real Japan by YamaTrips on Geku Sando — approximately 3 minutes on foot from Iseshi Station (JR/Kintetsu). Your guide will be at the storefront ready to welcome you.",
  },
  {
    q: "What should I wear and bring?",
    a: "Comfortable walking shoes are essential — the total walking distance is 3–4 km. Dress for the weather, bring a small bag for any purchases on Oharaimachi, and carry some cash for street food and the local bus (~¥140 per person).",
  },
  {
    q: "What happens if the group tour minimum isn't met?",
    a: "For group tours, we require a minimum of 4 participants to run the session. If the minimum hasn't been reached 48 hours before your tour, we will contact you. You'll have the option to upgrade to a private tour (difference in price applies) or receive a full refund.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Full refunds are available for cancellations made more than 48 hours before the tour start time. Cancellations within 48 hours are non-refundable. Please email contact@yamatrips.com to request a cancellation.",
  },
  {
    q: "Is the tour suitable for children?",
    a: "Yes! Children are very welcome. The route is gentle walking on paved and gravel paths. Strollers may be challenging on some gravel sections of the shrine grounds.",
  },
  {
    q: "Is the bus fare included?",
    a: "The bus transfer from Geku to Naiku (approx. ¥140/person) is not included in the tour price and should be paid individually on the bus.",
  },
  {
    q: "Can I book a tour for the same day?",
    a: "Same-day bookings are subject to availability. We recommend booking at least 24 hours in advance. Contact us directly at contact@yamatrips.com for urgent inquiries.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-stone-100 last:border-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className={`font-medium text-stone-800 leading-snug group-hover:text-torii-700 transition-colors ${open ? "text-torii-700" : ""}`}>
          {q}
        </span>
        <svg
          className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-transform text-stone-400 ${open ? "rotate-180 text-torii-600" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      {open && (
        <div className="pb-5 text-stone-600 text-sm leading-relaxed pr-8">{a}</div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-28 paper">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-kanji text-3xl mb-3">問</p>
          <p className="section-label">Questions</p>
          <h2 className="font-serif text-5xl md:text-6xl">
            Before you<br/>
            <em className="not-italic" style={{ color: "var(--torii)" }}>set out.</em>
          </h2>
          <span className="torii-line" />
        </div>
        <div className="bg-white border px-8" style={{ borderColor: "var(--cream-deep)" }}>
          {faqs.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
        <p className="text-center text-sm mt-8" style={{ color: "var(--ink-soft)" }}>
          Still have questions?{" "}
          <a href="mailto:contact@yamatrips.com" className="underline" style={{ color: "var(--torii)" }}>
            contact@yamatrips.com
          </a>
        </p>
      </div>
    </section>
  );
}
