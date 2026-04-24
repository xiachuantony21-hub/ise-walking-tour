import Image from "next/image";
import type { Settings } from "@/lib/data";

export default function PricingSection({ settings }: { settings: Settings }) {
  const { private: prv, group } = settings.pricing;
  const p = settings.pricingSection;

  return (
    <section id="pricing" className="relative py-28 overflow-hidden" style={{ background: "var(--cedar-deep)" }}>
      {p.backdropImage && (
        <div className="absolute inset-0 opacity-20">
          <Image src={p.backdropImage} alt="" fill sizes="100vw" className="object-cover animate-ken-burns" />
        </div>
      )}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(26,36,28,0.95), rgba(26,36,28,0.92))" }} />

      <div className="max-w-5xl mx-auto px-6 relative">
        <div className="text-center mb-16 text-white">
          <p className="section-kanji text-3xl mb-3" style={{ color: "#d9c5a4" }}>{p.kanji}</p>
          <p className="section-label" style={{ color: "#d9c5a4" }}>{p.eyebrow}</p>
          <h2
            className="font-serif text-5xl md:text-6xl text-white"
            dangerouslySetInnerHTML={{ __html: p.heading }}
          />
          <span className="inline-block w-12 h-px mt-6" style={{ background: "#d9c5a4" }} />
        </div>

        <div className="grid md:grid-cols-2 gap-px" style={{ background: "rgba(255,255,255,0.08)" }}>
          {/* Private */}
          <div className="relative p-10 bg-[#1a241c]">
            <p className="font-jp text-lg mb-2" style={{ color: "#d9c5a4" }}>貸切</p>
            <p className="text-xs tracking-[0.35em] uppercase text-white/60 mb-6 font-ui">Private Tour</p>
            <p className="text-white/75 text-sm leading-relaxed mb-8 font-light">{p.privateDescription}</p>
            <div className="mb-8">
              <div className="font-serif text-5xl text-white">¥{prv.basePrice.toLocaleString()}</div>
              <div className="text-white/60 text-sm mt-2">
                for {prv.basePersons} people · +¥{prv.additionalPersonPrice.toLocaleString()} per additional person
              </div>
            </div>
            <ul className="space-y-3 mb-10 text-sm text-white/80">
              {p.privateBullets.map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-[0.6rem] w-3 h-px" style={{ background: "#d9c5a4" }} />
                  {t}
                </li>
              ))}
            </ul>
            <a href="#booking?tour=private" className="btn-accent w-full">Reserve Private</a>
          </div>

          {/* Group */}
          <div className="relative p-10 bg-[#1a241c]">
            <p className="font-jp text-lg mb-2" style={{ color: "#d9c5a4" }}>相席</p>
            <p className="text-xs tracking-[0.35em] uppercase text-white/60 mb-6 font-ui">Group Tour</p>
            <p className="text-white/75 text-sm leading-relaxed mb-8 font-light">{p.groupDescription}</p>
            <div className="mb-8">
              <div className="font-serif text-5xl text-white">¥{group.pricePerPerson.toLocaleString()}</div>
              <div className="text-white/60 text-sm mt-2">
                per person · min. {group.minParticipants} participants to run
              </div>
            </div>
            <ul className="space-y-3 mb-10 text-sm text-white/80">
              {p.groupBullets.map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-[0.6rem] w-3 h-px" style={{ background: "#d9c5a4" }} />
                  {t}
                </li>
              ))}
            </ul>
            <a href="#booking?tour=group" className="btn-ghost w-full">Join a Group</a>
          </div>
        </div>

        <p className="text-center text-white/40 text-[10px] tracking-[0.25em] uppercase mt-10 font-ui">
          All prices JPY · Secured by Stripe
        </p>
      </div>
    </section>
  );
}
