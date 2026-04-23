import Image from "next/image";
import { GALLERY } from "@/lib/images";

const stats = [
  { kanji: "時", value: "3 Hours",    label: "Morning or afternoon" },
  { kanji: "人", value: "2 – 12",     label: "Guaranteed small group" },
  { kanji: "駅", value: "3 min walk", label: "From Iseshi Station" },
  { kanji: "社", value: "Two Shrines", label: "Gekū · Naikū" },
];

export default function TourStats() {
  return (
    <section id="tour" className="relative paper">
      {/* Narrative intro with image collage */}
      <div className="max-w-6xl mx-auto px-6 pt-28 md:pt-36 pb-20">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6">
            <p className="section-kanji text-3xl mb-3">物語</p>
            <p className="section-label">Our Story</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
              A quiet pilgrimage,<br/>
              <em className="not-italic" style={{ color: "var(--torii)" }}>told in English.</em>
            </h2>
            <div className="w-16 h-px mb-6" style={{ background: "var(--torii)" }} />
            <p className="text-lg leading-relaxed font-light mb-5" style={{ color: "var(--ink-soft)" }}>
              For over two thousand years, pilgrims have walked to Ise. Emperors, poets,
              merchants, farmers — all have come to stand before Amaterasu, the sun goddess,
              at the holiest shrine in Japan.
            </p>
            <p className="text-lg leading-relaxed font-light" style={{ color: "var(--ink-soft)" }}>
              We walk the same path, at the same pace, for three quiet hours. No rush,
              no schedule besides the one the cedars keep.
            </p>
          </div>

          <div className="md:col-span-6 grid grid-cols-5 grid-rows-5 gap-3 h-[420px] md:h-[540px]">
            <div className="relative col-span-3 row-span-3 overflow-hidden">
              <Image src={GALLERY[0].url} alt="Torii" fill sizes="40vw" className="object-cover animate-slow-pan" />
            </div>
            <div className="relative col-span-2 row-span-2 overflow-hidden">
              <Image src={GALLERY[1].url} alt="Dawn" fill sizes="25vw" className="object-cover animate-slow-pan" />
            </div>
            <div className="relative col-span-2 row-span-3 overflow-hidden">
              <Image src={GALLERY[3].url} alt="Peak" fill sizes="25vw" className="object-cover animate-slow-pan" />
            </div>
            <div className="relative col-span-3 row-span-2 overflow-hidden">
              <Image src={GALLERY[2].url} alt="Oharaimachi" fill sizes="40vw" className="object-cover animate-slow-pan" />
            </div>
          </div>
        </div>
      </div>

      {/* Ledger of facts */}
      <div className="border-y" style={{ borderColor: "var(--cream-deep)" }}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`py-10 px-4 text-center ${i > 0 ? "md:border-l" : ""} ${i > 1 ? "border-t md:border-t-0" : ""} ${i === 1 ? "border-l md:border-l" : ""}`}
              style={{ borderColor: "var(--cream-deep)" }}
            >
              <div className="font-jp text-3xl mb-3" style={{ color: "var(--torii)" }}>
                {s.kanji}
              </div>
              <div className="font-serif text-2xl mb-1" style={{ color: "var(--ink)" }}>
                {s.value}
              </div>
              <div className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--ink-soft)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
