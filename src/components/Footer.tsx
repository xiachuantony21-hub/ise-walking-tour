import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative text-stone-300 overflow-hidden" style={{ background: "#0d1410" }}>
      {/* Decorative kanji wash */}
      <span
        className="absolute -bottom-20 -right-10 font-jp select-none pointer-events-none opacity-[0.06]"
        style={{ fontSize: "clamp(280px, 40vw, 560px)", color: "#e8b86a", lineHeight: 1 }}
      >
        伊勢
      </span>

      <div className="relative max-w-6xl mx-auto px-6 py-20">
        {/* Parting line */}
        <div className="flex flex-col items-center mb-16 text-center">
          <p className="font-jp text-2xl mb-3" style={{ color: "#e8b86a" }}>また お会いしましょう</p>
          <p className="font-serif text-3xl md:text-4xl text-white leading-tight max-w-xl">
            Until the cedars call you back.
          </p>
          <span className="w-12 h-px mt-6" style={{ background: "#e8b86a" }} />
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-16">
          <div>
            <Image src="/logo-white.png" alt="Real Japan by YamaTrips" width={160} height={48} className="object-contain h-10 w-auto mb-5" />
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              Authentic Japan experiences, guided by locals in Ise, Mie. Environmental Ministry certified nature tourism partner.
            </p>
          </div>

          <div>
            <p className="font-jp text-sm mb-4" style={{ color: "#e8b86a" }}>案内</p>
            <h4 className="text-white font-serif text-lg mb-5">The Walk</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#tour"    className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#journey" className="hover:text-white transition-colors">The Route</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#faq"     className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#booking" className="hover:text-white transition-colors">Reserve</a></li>
            </ul>
          </div>

          <div>
            <p className="font-jp text-sm mb-4" style={{ color: "#e8b86a" }}>連絡</p>
            <h4 className="text-white font-serif text-lg mb-5">Find Us</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <div className="text-white/50 text-[10px] uppercase tracking-[0.3em] mb-1">Meeting Point</div>
                <div className="text-white/80">Real Japan by YamaTrips<br />Geku Sando, Ise-shi, Mie</div>
              </li>
              <li>
                <div className="text-white/50 text-[10px] uppercase tracking-[0.3em] mb-1">Email</div>
                <a href="mailto:contact@yamatrips.com" className="text-white/80 hover:text-white transition-colors">
                  contact@yamatrips.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} 株式会社YamaTrips · All rights reserved.</p>
          <Link href="/admin" className="hover:text-white/80 transition-colors font-jp">
            管理画面
          </Link>
        </div>
      </div>
    </footer>
  );
}
