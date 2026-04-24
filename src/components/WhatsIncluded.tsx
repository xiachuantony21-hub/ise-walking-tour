import Image from "next/image";
import type { Settings } from "@/lib/data";

export default function WhatsIncluded({ included, sessions }: { included: Settings["included"]; sessions: Settings["sessions"] }) {
  return (
    <section className="relative py-28 md:py-32 overflow-hidden" style={{ background: "var(--cream-mid)" }}>
      <span
        className="absolute -top-12 -right-12 font-jp select-none pointer-events-none opacity-[0.07]"
        style={{ fontSize: "clamp(260px, 38vw, 520px)", color: "var(--accent)", lineHeight: 1 }}
      >
        巡
      </span>

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <p className="section-kanji text-3xl mb-3">{included.kanji}</p>
          <p className="section-label">{included.eyebrow}</p>
          <h2
            className="font-serif text-5xl md:text-6xl"
            dangerouslySetInnerHTML={{ __html: included.heading }}
          />
          <span className="torii-line" />
        </div>

        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <h3 className="font-serif text-2xl mb-8 flex items-center gap-3">
              <span className="font-jp text-xl" style={{ color: "var(--accent)" }}>含</span>
              Included
            </h3>
            <ul className="space-y-5">
              {included.included.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center mt-1 border"
                    style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
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
                {included.notIncluded.map((n, i) => (
                  <li key={i} className="flex items-start gap-3 opacity-70">
                    <span className="mt-[0.55rem] w-2 h-px bg-current block" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-7 space-y-6">
            <div className="relative aspect-[16/11] overflow-hidden">
              {included.foodImage && (
                <Image
                  src={included.foodImage}
                  alt="Street eats of Ise"
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover animate-slow-pan"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-[10px] tracking-[0.35em] uppercase opacity-80 mb-1 font-ui">
                  Chapter 05 · Oharaimachi
                </p>
                <p className="font-serif text-2xl md:text-3xl leading-tight">{included.foodCaption}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 border" style={{ borderColor: "var(--cream-deep)", background: "var(--cream)" }}>
                <p className="font-jp text-xl mb-2" style={{ color: "var(--accent)" }}>集合</p>
                <h4 className="font-serif text-xl mb-2">Meeting Point</h4>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  <strong>Real Japan by YamaTrips</strong><br />
                  Geku Sando · 3 min on foot from Iseshi Station.<br/>
                  <span className="italic">Please arrive {sessions.arriveEarlyMinutes} minutes early.</span>
                </p>
              </div>
              <div className="p-6 border" style={{ borderColor: "var(--cream-deep)", background: "var(--cream)" }}>
                <p className="font-jp text-xl mb-2" style={{ color: "var(--accent)" }}>時間</p>
                <h4 className="font-serif text-xl mb-2">Departures</h4>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  Group · {sessions.groupDeparture.startTime} – {sessions.groupDeparture.endTime}<br/>
                  Private · any time from {sessions.privateWindow.earliestStart} to {sessions.privateWindow.latestStart}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
