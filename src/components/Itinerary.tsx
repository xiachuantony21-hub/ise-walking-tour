import Image from "next/image";
import type { Chapter } from "@/lib/data";

export default function Itinerary({ chapters, arriveEarly }: { chapters: Chapter[]; arriveEarly: number }) {
  return (
    <section id="journey" className="relative py-28 md:py-36 paper overflow-hidden">
      <div className="max-w-3xl mx-auto text-center px-6 mb-20">
        <p className="section-kanji text-3xl mb-3">参道</p>
        <p className="section-label">The Sacred Route</p>
        <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-6">
          Five chapters<br />
          of one <em className="italic" style={{ color: "var(--accent)" }}>walk.</em>
        </h2>
        <span className="torii-line" />
        <p className="mt-8 text-lg leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Arrive {arriveEarly} minutes early to browse our shop before we begin — then three hours
          on foot through Ise&apos;s two grand shrines and oldest pilgrim street.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 space-y-24 md:space-y-32">
        {chapters.map((stop, i) => {
          const reverse = i % 2 === 1;
          return (
            <article
              key={i}
              className="grid md:grid-cols-2 gap-10 md:gap-16 items-center"
            >
              <div className={reverse ? "md:order-2" : ""}>
                <div className="relative aspect-[4/5] overflow-hidden group">
                  {stop.imageUrl && (
                    <Image
                      src={stop.imageUrl}
                      alt={stop.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                    />
                  )}
                  <span
                    className="absolute top-4 left-4 font-serif italic text-white/90 leading-none"
                    style={{ fontSize: "clamp(3rem, 6vw, 5rem)", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
                  >
                    0{i + 1}
                  </span>
                  <div
                    className="absolute bottom-4 right-4 text-white font-jp px-4 py-2 text-lg tracking-widest"
                    style={{ background: "var(--accent)" }}
                  >
                    {stop.kanji}
                  </div>
                </div>
              </div>

              <div className={reverse ? "md:order-1 md:text-right" : ""}>
                <p
                  className="text-[11px] tracking-[0.35em] uppercase mb-3 font-ui"
                  style={{ color: "var(--accent)" }}
                >
                  Chapter {String(i + 1).padStart(2, "0")} · {stop.romaji}
                </p>
                <h3 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
                  {stop.title}
                </h3>
                <div
                  className={`w-16 h-px mb-6 ${reverse ? "md:ml-auto" : ""}`}
                  style={{ background: "var(--accent)" }}
                />
                <p className="text-lg leading-relaxed font-light" style={{ color: "var(--ink-soft)" }}>
                  {stop.body}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-28 flex justify-center">
        <div className="flex items-center gap-4" style={{ color: "var(--ink-soft)", opacity: 0.6 }}>
          <span className="w-12 h-px bg-current" />
          <span className="font-jp text-lg">道</span>
          <span className="w-12 h-px bg-current" />
        </div>
      </div>
    </section>
  );
}
