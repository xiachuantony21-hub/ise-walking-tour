import Image from "next/image";
import { GALLERY } from "@/lib/images";

const included = [
  "Expert bilingual guide (English & Japanese)",
  "Welcome tea at the YamaTrips shop on Geku Sando",
  "Guided walk of Gekū — the Outer Shrine",
  "Bus transfer from Gekū to Naikū",
  "Guided exploration of Naikū — the Inner Shrine",
  "Street food introductions throughout the walk",
  "Time in Oharaimachi — akafuku, Ise udon, skewers",
  "Best photo spots along the path",
];

const notIncluded = [
  "Shrine entry (always free)",
  "Personal food & drink purchases",
  "Return transport from Oharaimachi",
];

export default function WhatsIncluded() {
  return (
    <section className="relative py-28 md:py-32 overflow-hidden" style={{ background: "var(--cream-mid)" }}>
      {/* Background kanji wash */}
      <span
        className="absolute -top-12 -right-12 font-jp select-none pointer-events-none opacity-10"
        style={{ fontSize: "clamp(260px, 38vw, 520px)", color: "var(--torii)", lineHeight: 1 }}
      >
        巡
      </span>

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <p className="section-kanji text-3xl mb-3">巡礼</p>
          <p className="section-label">The Pilgrim&apos;s Kit</p>
          <h2 className="font-serif text-5xl md:text-6xl">
            What comes<br/>
            <em className="not-italic" style={{ color: "var(--torii)" }}>with the walk.</em>
          </h2>
          <span className="torii-line" />
        </div>

        <div className="grid md:grid-cols-12 gap-10">
          {/* Left: included list */}
          <div className="md:col-span-5">
            <h3 className="font-serif text-2xl mb-8 flex items-center gap-3">
              <span className="font-jp text-xl" style={{ color: "var(--torii)" }}>含</span>
              Included
            </h3>
            <ul className="space-y-5">
              {included.map((item, i) => (
                <li key={i} className="flex items-start gap-4 group">
                  <span
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center mt-1 border"
                    style={{ borderColor: "var(--torii)", color: "var(--torii)" }}
                  >
                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 6l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="leading-relaxed" style={{ color: "var(--ink-soft)" }}>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <h4 className="font-serif text-lg mb-4 opacity-70">Not included</h4>
              <ul className="space-y-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                {notIncluded.map((n, i) => (
                  <li key={i} className="flex items-start gap-3 opacity-70">
                    <span className="mt-[0.55rem] w-2 h-px bg-current block" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: image + meeting point card */}
          <div className="md:col-span-7 space-y-6">
            <div className="relative aspect-[16/11] overflow-hidden">
              <Image
                src={GALLERY[4].url}
                alt="Street eats of Ise"
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover animate-slow-pan"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-[10px] tracking-[0.35em] uppercase opacity-80 mb-1">The Street Eat Experience</p>
                <p className="font-serif text-2xl md:text-3xl leading-tight">
                  Eat as the pilgrims did — akafuku, Ise udon, skewers by the river.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 border" style={{ borderColor: "var(--cream-deep)", background: "var(--cream)" }}>
                <p className="font-jp text-xl mb-2" style={{ color: "var(--torii)" }}>集合</p>
                <h4 className="font-serif text-xl mb-2">Meeting Point</h4>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  <strong>Real Japan by YamaTrips</strong><br />
                  Geku Sando · 3 min on foot from Iseshi Station. A greeting with tea awaits.
                </p>
              </div>
              <div className="p-6 border" style={{ borderColor: "var(--cream-deep)", background: "var(--cream)" }}>
                <p className="font-jp text-xl mb-2" style={{ color: "var(--torii)" }}>時間</p>
                <h4 className="font-serif text-xl mb-2">Two Sessions</h4>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  Morning: 10:00 – 13:00<br/>
                  Afternoon: 15:00 – 18:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
