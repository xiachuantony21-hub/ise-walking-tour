import Image from "next/image";
import type { Settings } from "@/lib/data";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" style={{ color: "var(--accent)" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill={i < n ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5}>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.2 1 5.8L10 14.9l-5.3 2.8 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews({ reviews }: { reviews: Settings["reviews"] }) {
  if (!reviews.items.length) return null;
  return (
    <section id="reviews" className="relative py-28 overflow-hidden" style={{ background: "var(--cream-mid)" }}>
      <span
        className="absolute -top-20 -left-10 font-jp select-none pointer-events-none opacity-[0.06]"
        style={{ fontSize: "clamp(240px, 34vw, 480px)", color: "var(--accent)", lineHeight: 1 }}
      >
        声
      </span>

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <p className="section-kanji text-3xl mb-3">声</p>
          <p className="section-label">{reviews.eyebrow}</p>
          <h2 className="font-serif text-5xl md:text-6xl">{reviews.heading}</h2>
          <span className="torii-line" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.items.map((r, i) => (
            <article key={i} className="border p-7 flex flex-col" style={{ borderColor: "var(--cream-deep)", background: "var(--cream)" }}>
              <Stars n={r.stars} />
              <p className="mt-4 leading-relaxed font-light" style={{ color: "var(--ink)" }}>
                “{r.body}”
              </p>
              {r.photos && r.photos.length > 0 && (
                <div className="mt-5 grid grid-cols-3 gap-1.5">
                  {r.photos.slice(0, 3).map((p, j) => (
                    <div key={j} className="relative aspect-square overflow-hidden">
                      <Image src={p} alt="" fill sizes="100px" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-auto pt-5 flex items-center gap-3 border-t" style={{ borderColor: "var(--cream-deep)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg" style={{ background: "var(--cream-mid)", color: "var(--accent)" }}>
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="font-serif text-sm" style={{ color: "var(--ink)" }}>{r.name}</p>
                  <p className="text-[10px] tracking-[0.25em] uppercase font-ui" style={{ color: "var(--ink-soft)" }}>{r.date}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
