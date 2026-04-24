import { getSettings } from "@/lib/data";
import Navbar         from "@/components/Navbar";
import HeroSection    from "@/components/HeroSection";
import TourStats      from "@/components/TourStats";
import WhatsIncluded  from "@/components/WhatsIncluded";
import Itinerary      from "@/components/Itinerary";
import PricingSection from "@/components/PricingSection";
import Reviews        from "@/components/Reviews";
import BookingForm    from "@/components/BookingForm";
import FAQ            from "@/components/FAQ";
import Footer         from "@/components/Footer";

export default function Home() {
  const settings = getSettings();

  return (
    <main>
      <Navbar />
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
      <Footer contact={settings.contact} />
    </main>
  );
}
