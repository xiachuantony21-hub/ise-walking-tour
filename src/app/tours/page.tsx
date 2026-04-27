import Link from "next/link";
import Image from "next/image";
import { getSettings } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function ToursPage() {
  const settings = await getSettings();
  const tours = settings.tours.filter((t) => t.active);

  return (
    <main>
      <Navbar />
      <section className="px-6 pt-32 pb-12 text-center">
        <p className="font-jp text-2xl mb-2" style={{ color: "var(--accent)" }}>旅</p>
        <h1 className="text-4xl md:text-5xl font-serif" style={{ color: "var(--ink)" }}>Our Tours</h1>
        <p className="mt-4 max-w-xl mx-auto opacity-80" style={{ color: "var(--ink)" }}>
          Quiet, bilingual walking tours through Japan's most sacred ground.
        </p>
      </section>

      <section className="px-6 pb-24 max-w-6xl mx-auto grid gap-10 md:grid-cols-2">
        {tours.map((t) => (
          <Link
            key={t.slug}
            href={`/tours/${t.slug}`}
            className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
            style={{ background: "var(--cream-mid)" }}
          >
            <div className="relative aspect-[4/3]">
              <Image src={t.heroImage} alt={t.name} fill className="object-cover transition group-hover:scale-105" sizes="(min-width: 768px) 50vw, 100vw" />
              <div className="absolute top-4 left-4 font-jp text-3xl text-white drop-shadow-lg">{t.kanji}</div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-serif mb-2" style={{ color: "var(--ink)" }}>{t.name}</h2>
              <p className="text-sm opacity-80 mb-4" style={{ color: "var(--ink)" }}>{t.summary}</p>
              <div className="flex justify-between text-sm" style={{ color: "var(--ink)" }}>
                <span>{t.location} · {t.durationLabel}</span>
                <span className="font-medium">From ¥{t.fromPriceJpy.toLocaleString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <Footer contact={settings.contact} />
    </main>
  );
}
