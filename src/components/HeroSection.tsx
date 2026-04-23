"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { HERO_SLIDES } from "@/lib/images";

export default function HeroSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-screen min-h-[720px] flex items-end overflow-hidden bg-[#0b0a08]">
      {/* Slideshow with cross-fade + Ken Burns */}
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-[2200ms] ease-out"
          style={{ opacity: i === active ? 1 : 0 }}
          aria-hidden={i !== active}
        >
          <div className="absolute inset-0 animate-ken-burns">
            <Image
              src={slide.url}
              alt={slide.caption}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      ))}

      {/* Gradient overlays for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a08]/90 via-[#0b0a08]/30 to-[#0b0a08]/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0a08]/70 via-transparent to-transparent pointer-events-none" />

      {/* Vertical kanji label (right side) */}
      <div
        className="absolute top-[18%] right-6 md:right-14 text-white/90 pointer-events-none select-none font-jp"
        style={{
          writingMode: "vertical-rl",
          fontSize: "clamp(1.25rem, 1.8vw, 1.75rem)",
          letterSpacing: "0.75em",
          textShadow: "0 0 20px rgba(0,0,0,0.8)",
        }}
      >
        伊勢神宮 参道
      </div>

      {/* Giant atmospheric kanji for current slide */}
      <div
        key={active}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none font-jp animate-fade-in"
        style={{
          fontSize: "clamp(180px, 26vw, 360px)",
          color: "rgba(255,255,255,0.06)",
          lineHeight: 1,
        }}
      >
        {HERO_SLIDES[active].kanji}
      </div>

      {/* Top branding bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-6 md:px-12 py-6 text-white/80 text-[11px] tracking-[0.32em] uppercase">
        <span>Real Japan by YamaTrips</span>
        <span className="hidden md:block">Est. Ise · Mie</span>
      </div>

      {/* Main content (lower-left, magazine-style) */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 pb-20 md:pb-28">
        <div className="max-w-3xl">
          <p className="animate-drift text-[11px] tracking-[0.4em] uppercase text-white/70 mb-6">
            <span className="inline-block w-8 h-px bg-white/60 align-middle mr-3" />
            A Sacred Walk in Ise
          </p>

          <h1
            className="animate-drift animate-delay-200 font-serif text-white leading-[1.05] mb-8"
            style={{ fontSize: "clamp(2.6rem, 6.8vw, 5.4rem)" }}
          >
            Where the gods<br />
            <em className="not-italic" style={{ color: "#e8b86a" }}>still walk</em> at dawn.
          </h1>

          <p className="animate-drift animate-delay-400 text-white/85 text-lg md:text-xl leading-relaxed max-w-xl mb-10 font-light">
            A three-hour pilgrimage through Japan&apos;s most revered shrines —
            Gekū, Naikū, and the four-hundred-year-old streets of Oharaimachi.
            Guided in English. Street eats along the way.
          </p>

          <div className="animate-drift animate-delay-600 flex flex-col sm:flex-row items-start gap-4">
            <a href="#booking" className="btn-primary">Reserve Your Walk</a>
            <a href="#journey" className="btn-ghost">See the Route</a>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-10 right-6 md:right-12 flex items-center gap-3">
          <span className="text-white/70 text-xs tracking-[0.3em] font-mono">
            {String(active + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}
          </span>
          <div className="flex gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Slide ${i + 1}`}
                className="h-px transition-all duration-500"
                style={{
                  width: i === active ? 48 : 16,
                  background: i === active ? "#fff" : "rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
        <span className="text-[10px] tracking-[0.35em] uppercase">Scroll</span>
        <div className="animate-scroll w-px h-8 bg-gradient-to-b from-white/70 to-transparent" />
      </div>
    </section>
  );
}
