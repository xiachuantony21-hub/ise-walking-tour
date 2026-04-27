import { getSettings } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function ShopPage() {
  const settings = await getSettings();
  return (
    <main>
      <Navbar />
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <p className="font-jp text-5xl mb-4" style={{ color: "var(--accent)" }}>送</p>
        <h1 className="text-4xl md:text-5xl font-serif mb-4" style={{ color: "var(--ink)" }}>Online Shipping</h1>
        <p className="opacity-70 max-w-md" style={{ color: "var(--ink)" }}>Under Construction. Ise crafts shipped worldwide — coming soon.</p>
      </section>
      <Footer contact={settings.contact} />
    </main>
  );
}
