import Link from "next/link";
import Image from "next/image";

export default function BookingSuccess({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6 py-24">
      {/* Logo */}
      <Link href="/" className="mb-10">
        <Image src="/logo-dark.png" alt="Tony's Yama Trips" width={160} height={48} className="h-10 w-auto object-contain" />
      </Link>

      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 p-10 text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-serif text-3xl text-stone-900 mb-3">Booking Confirmed!</h1>
        <p className="text-stone-500 leading-relaxed mb-8">
          Thank you for booking your Ise Sacred Walk with Tony&apos;s Yama Trips.
          A confirmation email has been sent to your inbox. We can&apos;t wait to walk with you!
        </p>

        {/* What's next */}
        <div className="bg-stone-50 rounded-2xl p-6 text-left space-y-4 mb-8">
          <h3 className="font-semibold text-stone-800 text-sm">What to expect next:</h3>
          <ul className="space-y-3 text-sm text-stone-600">
            {[
              "📧 Confirmation email with all booking details",
              "📍 Meeting point: Real Japan by YamaTrips, Geku Sando (3 min from Iseshi Station)",
              "⏰ Please arrive 30 minutes early to drop your luggage and meet the team",
              "👟 Wear comfortable walking shoes — 3–4 km of walking and eating, come hungry",
              "❓ Questions? Email us at admin@yamatrips.com",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="leading-5">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Shrine greeting */}
        <div className="border-t border-stone-100 pt-6">
          <p className="font-serif text-lg italic text-stone-600">
            &ldquo;The path to the sacred begins with a single step.&rdquo;
          </p>
          <p className="text-xs text-stone-400 mt-2">— Ise Jingu, Japan</p>
        </div>
      </div>

      <Link href="/" className="mt-8 text-sm text-stone-400 hover:text-stone-600 transition-colors">
        ← Return to homepage
      </Link>
    </main>
  );
}
