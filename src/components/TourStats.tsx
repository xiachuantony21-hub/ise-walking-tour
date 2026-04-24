import Image from "next/image";
import type { Settings } from "@/lib/data";

export default function TourStats({ story, stats }: { story: Settings["story"]; stats: Settings["stats"] }) {
  const imgs = [...story.images, "", "", "", ""].slice(0, 4);
  return (
    <section id="tour" className="relative paper">
      <div className="max-w-6xl mx-auto px-6 pt-28 md:pt-36 pb-20">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6">
            <p className="section-kanji text-3xl mb-3">{story.kanji}</p>
            <p className="section-label">{story.eyebrow}</p>
            <h2
              className="font-serif text-4xl md:text-5xl leading-tight mb-6"
              dangerouslySetInnerHTML={{ __html: story.heading }}
            />
            <div className="w-16 h-px mb-6" style={{ background: "var(--accent)" }} />
            {story.paragraphs.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed font-light mb-5" style={{ color: "var(--ink-soft)" }}>
                {p}
              </p>
            ))}
          </div>

          <div className="md:col-span-6 grid grid-cols-5 grid-rows-5 gap-3 h-[420px] md:h-[540px]">
            {imgs[0] && <div className="relative col-span-3 row-span-3 overflow-hidden">
              <Image src={imgs[0]} alt="" fill sizes="40vw" className="object-cover animate-slow-pan" />
            </div>}
            {imgs[1] && <div className="relative col-span-2 row-span-2 overflow-hidden">
              <Image src={imgs[1]} alt="" fill sizes="25vw" className="object-cover animate-slow-pan" />
            </div>}
            {imgs[2] && <div className="relative col-span-2 row-span-3 overflow-hidden">
              <Image src={imgs[2]} alt="" fill sizes="25vw" className="object-cover animate-slow-pan" />
            </div>}
            {imgs[3] && <div className="relative col-span-3 row-span-2 overflow-hidden">
              <Image src={imgs[3]} alt="" fill sizes="40vw" className="object-cover animate-slow-pan" />
            </div>}
          </div>
        </div>
      </div>

      <div className="border-y" style={{ borderColor: "var(--cream-deep)" }}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`py-10 px-4 text-center ${i > 0 ? "md:border-l" : ""} ${i > 1 ? "border-t md:border-t-0" : ""} ${i === 1 ? "border-l md:border-l" : ""}`}
              style={{ borderColor: "var(--cream-deep)" }}
            >
              <div className="font-jp text-3xl mb-3" style={{ color: "var(--accent)" }}>{s.kanji}</div>
              <div className="font-serif text-2xl mb-1">{s.value}</div>
              <div className="text-xs tracking-[0.2em] uppercase font-ui" style={{ color: "var(--ink-soft)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
