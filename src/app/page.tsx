import Link from "next/link";
import Image from "next/image";
import { getSettings } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function Home() {
  const settings = await getSettings();
  const { homeHero, categories } = settings.site;

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <Image
          src={homeHero.backgroundImage}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.65))" }} />
        <div className="relative text-center px-6 max-w-3xl text-white">
          <p className="uppercase tracking-[0.4em] text-xs mb-4 opacity-80">{homeHero.eyebrow}</p>
          <h1
            className="text-4xl md:text-6xl font-serif leading-tight"
            dangerouslySetInnerHTML={{ __html: homeHero.heading }}
          />
          <p className="mt-6 text-lg opacity-90">{homeHero.subheading}</p>
        </div>
      </section>

      {/* Announcement */}
      {settings.announcement && (
        <div className="border-y px-6 py-4" style={{ background: "var(--cream-mid)", borderColor: "var(--cream-deep)" }}>
          <p className="text-center text-sm tracking-wide" style={{ color: "var(--ink)" }}>
            <span className="font-jp mr-2" style={{ color: "var(--accent)" }}>お知らせ</span>
            {settings.announcement}
          </p>
        </div>
      )}

      {/* Category cards */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-jp text-2xl mb-2" style={{ color: "var(--accent)" }}>道</p>
          <h2 className="text-3xl md:text-4xl font-serif" style={{ color: "var(--ink)" }}>Choose your path</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((c) => {
            const isLive = c.status === "live";
            const card = (
              <div
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition aspect-[4/3]"
                style={{ background: "var(--cream-mid)" }}
              >
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  className={`object-cover transition ${isLive ? "group-hover:scale-105" : "opacity-60"}`}
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1))" }} />
                <div className="absolute top-4 left-4 font-jp text-3xl text-white drop-shadow-lg">{c.kanji}</div>
                {!isLive && (
                  <div className="absolute top-4 right-4 text-xs uppercase tracking-widest text-white bg-black/50 px-2 py-1 rounded">
                    Under Construction
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-serif mb-1">{c.title}</h3>
                  <p className="text-sm opacity-90">{c.blurb}</p>
                </div>
              </div>
            );
            return isLive ? (
              <Link key={c.key} href={c.href}>{card}</Link>
            ) : (
              <div key={c.key}>{card}</div>
            );
          })}
        </div>
      </section>

      <Footer contact={settings.contact} />
    </main>
  );
}
