import { getSettings } from "@/lib/data";
import Navbar         from "@/components/Navbar";
import HeroSection    from "@/components/HeroSection";
import TourStats      from "@/components/TourStats";
import WhatsIncluded  from "@/components/WhatsIncluded";
import Itinerary      from "@/components/Itinerary";
import PricingSection from "@/components/PricingSection";
import BookingForm    from "@/components/BookingForm";
import FAQ            from "@/components/FAQ";
import Footer         from "@/components/Footer";

export default function Home() {
  const settings = getSettings();

  return (
    <main>
      <Navbar />
      <HeroSection />
      <TourStats />
      <WhatsIncluded />
      <Itinerary />
      <PricingSection settings={settings} />

      {/* Announcement banner */}
      {settings.announcement && (
        <div className="border-y px-6 py-4" style={{ background: "var(--cream-mid)", borderColor: "var(--cream-deep)" }}>
          <p className="text-center text-sm tracking-wide" style={{ color: "var(--ink)" }}>
            <span className="font-jp mr-2" style={{ color: "var(--torii)" }}>お知らせ</span>
            {settings.announcement}
          </p>
        </div>
      )}

      <BookingForm settings={settings} />
      <FAQ />
      <Footer />
    </main>
  );
}
