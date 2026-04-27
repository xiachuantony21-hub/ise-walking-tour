import Image from "next/image";
import { getSettings } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function StorePage() {
  const settings = await getSettings();
  const s = settings.site.store;

  return (
    <main>
      <Navbar />
      <section className="px-6 pt-32 pb-12 text-center">
        <p className="font-jp text-2xl mb-2" style={{ color: "var(--accent)" }}>店</p>
        <p className="uppercase tracking-[0.3em] text-xs mb-2 opacity-70" style={{ color: "var(--ink)" }}>{s.eyebrow}</p>
        <h1 className="text-4xl md:text-5xl font-serif" style={{ color: "var(--ink)" }} dangerouslySetInnerHTML={{ __html: s.heading }} />
      </section>

      <section className="px-6 pb-12 max-w-4xl mx-auto space-y-6">
        {s.paragraphs.map((p, i) => (
          <p key={i} className="text-lg leading-relaxed" style={{ color: "var(--ink)" }}>{p}</p>
        ))}
        <div className="pt-4 grid gap-2 text-sm" style={{ color: "var(--ink)" }}>
          <p><span className="font-jp mr-2" style={{ color: "var(--accent)" }}>所</span>{s.address}</p>
          <p><span className="font-jp mr-2" style={{ color: "var(--accent)" }}>時</span>{s.hours}</p>
        </div>
      </section>

      <section className="px-6 pb-24 max-w-6xl mx-auto grid gap-6 md:grid-cols-2">
        {s.images.map((src, i) => (
          <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image src={src} alt="" fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        ))}
      </section>

      <Footer contact={settings.contact} />
    </main>
  );
}
