import Image from "next/image";
import type { Settings } from "@/lib/data";
import { GALLERY } from "@/lib/images";

export default function PricingSection({ settings }: { settings: Settings }) {
  const { private: prv, group } = settings.pricing;
  const { morning, afternoon } = settings.sessions;

  return (
    <section id="pricing" className="relative py-28 overflow-hidden" style={{ background: "var(--cedar-deep)" }}>
      {/* Parallax-feel backdrop image */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src={GALLERY[3].url}
          alt=""
          fill
          sizes="100vw"
          className="object-cover animate-ken-burns"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a241c]/95 via-[#1a241c]/85 to-[#1a241c]/95" />

      <div className="max-w-5xl mx-auto px-6 relative">
        <div className="text-center mb-16 text-white">
          <p className="section-kanji text-3xl mb-3" style={{ color: "#e8b86a" }}>料金</p>
          <p className="section-label" style={{ color: "#e8b86a" }}>The Offering</p>
          <h2 className="font-serif text-5xl md:text-6xl text-white">
            Choose your<br/>
            <em className="not-italic" style={{ color: "#e8b86a" }}>pilgrimage.</em>
          </h2>
          <span className="inline-block w-12 h-px mt-6" style={{ background: "#e8b86a" }} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Private */}
          <div className="relative p-10 border border-white/15 bg-white/[0.03] backdrop-blur-sm">
            <p className="font-jp text-lg mb-2" style={{ color: "#e8b86a" }}>貸切</p>
            <p className="text-xs tracking-[0.35em] uppercase text-white/60 mb-8">Private Tour</p>
            <div className="mb-8">
              <div className="font-serif text-5xl text-white">
                ¥{prv.basePrice.toLocaleString()}
              </div>
              <div className="text-white/60 text-sm mt-2">
                for {prv.basePersons} people · then +¥{prv.additionalPersonPrice.toLocaleString()} per person
              </div>
            </div>
            <ul className="space-y-3 mb-10 text-sm text-white/80">
              {[
                "Your party only",
                "Flexible pace tailored to your group",
                `Up to ${settings.maxParticipants} participants`,
                "Morning or afternoon session",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-[0.6rem] w-3 h-px" style={{ background: "#e8b86a" }} />
                  {t}
                </li>
              ))}
            </ul>
            <a href="#booking" className="btn-primary w-full">Reserve Private</a>
          </div>

          {/* Group */}
          <div className="relative p-10 border bg-white" style={{ borderColor: "var(--cream-deep)" }}>
            <p className="font-jp text-lg mb-2" style={{ color: "var(--torii)" }}>相席</p>
            <p className="text-xs tracking-[0.35em] uppercase mb-8" style={{ color: "var(--ink-soft)" }}>Group Tour</p>
            <div className="mb-8">
              <div className="font-serif text-5xl" style={{ color: "var(--ink)" }}>
                ¥{group.pricePerPerson.toLocaleString()}
              </div>
              <div className="text-sm mt-2" style={{ color: "var(--ink-soft)" }}>
                per person · min. {group.minParticipants} participants to run
              </div>
            </div>
            <ul className="space-y-3 mb-10 text-sm" style={{ color: "var(--ink-soft)" }}>
              {[
                "Meet fellow travellers",
                `From ${group.minParticipants} participants`,
                `Up to ${settings.maxParticipants} per session`,
                "Same guide, same full route",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-[0.6rem] w-3 h-px" style={{ background: "var(--torii)" }} />
                  {t}
                </li>
              ))}
            </ul>
            <a href="#booking" className="btn-outline-ink w-full">Join a Group</a>
          </div>
        </div>

        {/* Sessions */}
        <div className="mt-12 grid sm:grid-cols-2 gap-px bg-white/10">
          {morning.active && (
            <div className="bg-[#1a241c] px-6 py-6 text-white">
              <p className="font-jp text-sm" style={{ color: "#e8b86a" }}>朝</p>
              <div className="font-serif text-xl mt-1">Morning · {morning.startTime} – {morning.endTime}</div>
            </div>
          )}
          {afternoon.active && (
            <div className="bg-[#1a241c] px-6 py-6 text-white">
              <p className="font-jp text-sm" style={{ color: "#e8b86a" }}>夕</p>
              <div className="font-serif text-xl mt-1">Afternoon · {afternoon.startTime} – {afternoon.endTime}</div>
            </div>
          )}
        </div>

        <p className="text-center text-white/50 text-xs tracking-[0.25em] uppercase mt-10">
          All prices JPY · Secured by Stripe
        </p>
      </div>
    </section>
  );
}
