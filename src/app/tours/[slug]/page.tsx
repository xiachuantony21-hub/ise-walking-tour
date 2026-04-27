import { notFound } from "next/navigation";
import { getSettings } from "@/lib/data";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TourStats from "@/components/TourStats";
import WhatsIncluded from "@/components/WhatsIncluded";
import Itinerary from "@/components/Itinerary";
import PricingSection from "@/components/PricingSection";
import Reviews from "@/components/Reviews";
import BookingForm from "@/components/BookingForm";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const settings = await getSettings();
  const tour = settings.tours.find((t) => t.slug === slug && t.active);
  if (!tour) notFound();

  // Currently only the Ise tour has full content (mapped to existing settings).
  // Other tours fall back to a minimal page.
  const isIse = slug === "ise-sacred-walk";

  return (
    <main>
      <Navbar />
      {isIse ? (
        <>
          <HeroSection hero={settings.hero} />
          <TourStats story={settings.story} stats={settings.stats} />
          <WhatsIncluded included={settings.included} sessions={settings.sessions} />
          <Itinerary chapters={settings.chapters} arriveEarly={settings.sessions.arriveEarlyMinutes} />
          <PricingSection settings={settings} />
          <Reviews reviews={settings.reviews} />

          {settings.announcement && (
            <div className="border-y px-6 py-4" style={{ background: "var(--cream-mid)", borderColor: "var(--cream-deep)" }}>
              <p className="text-center text-sm tracking-wide" style={{ color: "var(--ink)" }}>
                <span className="font-jp mr-2" style={{ color: "var(--accent)" }}>お知らせ</span>
                {settings.announcement}
              </p>
            </div>
          )}

          <BookingForm settings={settings} />
          <FAQ faq={settings.faq} contactEmail={settings.contact.email} />
        </>
      ) : (
        <section className="px-6 py-32 text-center">
          <p className="font-jp text-3xl mb-4" style={{ color: "var(--accent)" }}>{tour.kanji}</p>
          <h1 className="text-4xl font-serif mb-4" style={{ color: "var(--ink)" }}>{tour.name}</h1>
          <p className="max-w-xl mx-auto" style={{ color: "var(--ink)" }}>{tour.summary}</p>
          <p className="mt-8 text-sm opacity-70">More details coming soon.</p>
        </section>
      )}
      <Footer contact={settings.contact} />
    </main>
  );
}
