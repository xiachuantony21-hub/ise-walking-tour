"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const links = [
  { label: "Story",    href: "#tour",     kanji: "物語" },
  { label: "Journey",  href: "#journey",  kanji: "参道" },
  { label: "Pricing",  href: "#pricing",  kanji: "料金" },
  { label: "FAQ",      href: "#faq",      kanji: "問" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[var(--cream)]/95 backdrop-blur-md border-b" : "bg-transparent"
      }`}
      style={scrolled ? { borderColor: "var(--cream-deep)" } : {}}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex-shrink-0 flex items-center gap-3">
          <Image
            src={scrolled ? "/logo-dark.png" : "/logo-white.png"}
            alt="Real Japan by YamaTrips"
            width={160}
            height={48}
            className="object-contain h-9 w-auto"
            priority
          />
        </Link>

        <ul className={`hidden md:flex items-center gap-10 text-xs tracking-[0.3em] uppercase ${scrolled ? "text-[var(--ink)]" : "text-white/90"}`}>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="group flex items-baseline gap-2 hover:opacity-70 transition-opacity">
                <span className="font-jp text-sm opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: scrolled ? "var(--accent)" : "#e8b86a" }}>
                  {l.kanji}
                </span>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#booking"
              className={`px-6 py-2.5 text-xs tracking-[0.25em] uppercase font-medium transition-all ${
                scrolled
                  ? "bg-[var(--accent)] text-white hover:opacity-90"
                  : "bg-white/10 text-white border border-white/40 hover:bg-white/20 backdrop-blur-sm"
              }`}
              style={{ borderRadius: 2 }}
            >
              Reserve
            </a>
          </li>
        </ul>

        <button
          className={`md:hidden flex flex-col gap-1.5 p-2 ${scrolled ? "text-[var(--ink)]" : "text-white"}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-current transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-current transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[var(--cream)] border-t px-6 py-6 space-y-5" style={{ borderColor: "var(--cream-deep)" }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="flex items-baseline gap-3 text-[var(--ink)]">
              <span className="font-jp text-base" style={{ color: "var(--accent)" }}>{l.kanji}</span>
              <span className="text-xs tracking-[0.3em] uppercase">{l.label}</span>
            </a>
          ))}
          <a
            href="#booking"
            onClick={() => setMenuOpen(false)}
            className="block w-full text-center py-3 bg-[var(--accent)] text-white text-xs tracking-[0.3em] uppercase"
            style={{ borderRadius: 2 }}
          >
            Reserve
          </a>
        </div>
      )}
    </nav>
  );
}
