import fs from "fs";
import path from "path";
import { list, put } from "@vercel/blob";

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_BLOB_KEY = "settings.json";
const useBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;

/* ─────────────────────────────────────────────────────────────
 * Site content — ALL editable from /admin/dashboard
 * ────────────────────────────────────────────────────────────── */

export interface HeroSlide {
  imageUrl: string;
  kanji: string;
  caption: string;
}

export interface Chapter {
  kanji: string;
  romaji: string;
  title: string;
  body: string;
  imageUrl: string;
}

export interface StatItem {
  kanji: string;
  value: string;
  label: string;
}

export interface Review {
  name: string;
  date: string;        // e.g. "April 2026"
  stars: number;       // 0-5
  body: string;
  photos: string[];    // image URLs (optional)
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface TourCard {
  slug: string;
  name: string;
  kanji: string;
  summary: string;
  heroImage: string;
  durationLabel: string;
  fromPriceJpy: number;
  location: string;
  active: boolean;
}

export interface CategoryCard {
  key: "store" | "tours" | "accommodations" | "shop";
  title: string;
  kanji: string;
  blurb: string;
  image: string;
  href: string;
  status: "live" | "construction";
}

export interface SiteConfig {
  brandName: string;
  brandTagline: string;
  homeHero: {
    eyebrow: string;
    heading: string;
    subheading: string;
    backgroundImage: string;
  };
  categories: CategoryCard[];
  store: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    images: string[];
    address: string;
    hours: string;
  };
}

export interface Settings {
  /* tour */
  tourName: string;
  maxParticipants: number;

  /* sessions */
  sessions: {
    groupDeparture:    { active: boolean; startTime: string; endTime: string };
    privateWindow:     { active: boolean; earliestStart: string; latestStart: string; durationHours: number };
    arriveEarlyMinutes: number;
  };

  /* pricing */
  pricing: {
    private: { basePrice: number; basePersons: number; additionalPersonPrice: number };
    group:   { pricePerPerson: number; minParticipants: number };
  };

  /* calendar */
  blockedDates: string[];
  announcement: string;

  /* content */
  hero: {
    eyebrow: string;
    heading: string;     // can use <em>word</em> for the accent phrase
    subheading: string;
    slides: HeroSlide[];
  };
  story: {
    kanji: string;
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    images: string[];    // 4 collage images
  };
  stats: StatItem[];
  chapters: Chapter[];
  included: {
    kanji: string;
    eyebrow: string;
    heading: string;
    included: string[];
    notIncluded: string[];
    foodImage: string;
    foodCaption: string;
  };
  pricingSection: {
    kanji: string;
    eyebrow: string;
    heading: string;
    backdropImage: string;
    privateDescription: string;
    privateBullets: string[];
    groupDescription: string;
    groupBullets: string[];
  };
  reviews: {
    eyebrow: string;
    heading: string;
    items: Review[];
  };
  faq: FAQItem[];
  contact: {
    email: string;
    meetingPoint: string;
    meetingPointAddress: string;
  };

  /* multi-tour platform */
  site: SiteConfig;
  tours: TourCard[];
}

export interface Booking {
  id: string;
  createdAt: string;
  tourType: "private" | "group";
  date: string;
  session: string;      // stored time like "12:00" (group) or a chosen private start like "10:30"
  participants: number;
  totalPrice: number;
  status: "pending" | "paid" | "cancelled";
  customer: { name: string; email: string; phone: string; notes: string };
  stripeSessionId: string;
}

/* ─── Default settings (used on first boot) ──────────────── */

const DEFAULT_SETTINGS: Settings = {
  tourName: "Ise Sacred Walk & Eat",
  maxParticipants: 10,

  sessions: {
    groupDeparture:  { active: true,  startTime: "12:00", endTime: "17:00" },
    privateWindow:   { active: true,  earliestStart: "10:00", latestStart: "14:00", durationHours: 5 },
    arriveEarlyMinutes: 0,
  },

  pricing: {
    private: { basePrice: 26000, basePersons: 1, additionalPersonPrice: 6000 },
    group:   { pricePerPerson: 6000, minParticipants: 1 },
  },

  blockedDates: [],
  announcement: "",

  hero: {
    eyebrow: "A Sacred Walk in Ise",
    heading: "Walk and eat your way<br/>through <em>Real Japan.</em>",
    subheading:
      "A four-to-five-hour walking and eating tour through Ise's two grand shrines and the Edo-era streets of Okage Yokochō — led by our own Private Licensed YamaTrips Guides. Come hungry.",
    slides: [
      { imageUrl: "/photos/24825820_m.jpeg", kanji: "鳥居", caption: "Pass beneath the torii" },
      { imageUrl: "/photos/2801930_m.jpeg",  kanji: "森",   caption: "The mossy cedar path" },
      { imageUrl: "/photos/IMG_3545.jpg",    kanji: "店",   caption: "Welcome at the shop" },
      { imageUrl: "/photos/26802378_m.jpeg", kanji: "食",   caption: "Taste old Ise" },
    ],
  },

  story: {
    kanji: "物語",
    eyebrow: "Our Story",
    heading: "A quiet pilgrimage,<br/>told in <em>English.</em>",
    paragraphs: [
      "For over two thousand years, pilgrims have walked to Ise. Emperors, poets, merchants, farmers — all have come to stand before Amaterasu, the sun goddess, at the holiest shrine in Japan.",
      "We meet you at our shop on the Geku approach, slip on a samue, share a 15-minute briefing on Ise and Shintō, and walk the path together — through serene cedar forests, ancient rituals, and the bustling Edo-era food street of Okage Yokochō.",
    ],
    images: [
      "/photos/24825820_m.jpeg",
      "/photos/2801930_m.jpeg",
      "/photos/IMG_3545.jpg",
      "/photos/22321235_m.jpeg",
    ],
  },

  stats: [
    { kanji: "時", value: "4 – 5 Hours", label: "Walk & eat" },
    { kanji: "人", value: "Up to 10",    label: "Small group" },
    { kanji: "駅", value: "3 min walk",  label: "From Iseshi Station" },
    { kanji: "社", value: "Two Shrines", label: "Gekū · Naikū" },
  ],

  chapters: [
    {
      kanji: "店",
      romaji: "Mise",
      title: "Meet the YamaTrips Members",
      body:
        "Arrive at our shop on Geku Sando by 12:00 — drop your luggage, meet the team, slip on a samue, and sip a charcoal-infused local drink. At 12:30 we share a 15-minute briefing on Ise and Shintō before the walk begins.",
      imageUrl: "/photos/IMG_3545.jpg",
    },
    {
      kanji: "外宮参道",
      romaji: "Gekū Sandō",
      title: "Gekū Sandō · The Approach",
      body:
        "We set out down one of Japan's most atmospheric pilgrim streets — stone lanterns, wooden shopfronts, and cedar shadows lead the way toward the Outer Shrine.",
      imageUrl: "/photos/2801930_m.jpeg",
    },
    {
      kanji: "外宮",
      romaji: "Gekū",
      title: "Gekū · The Outer Shrine",
      body:
        "We cross into the sacred ground of Toyouke Ōmikami — the deity of food, clothing, and shelter. Traditionally visited first before the Inner Shrine, following centuries of pilgrimage custom.",
      imageUrl: "/photos/22321235_m.jpeg",
    },
    {
      kanji: "内宮",
      romaji: "Naikū",
      title: "Naikū · The Inner Shrine",
      body:
        "A short bus ride to the most sacred shrine in all of Japan — dedicated to the sun goddess Amaterasu Ōmikami. Cross the Uji Bridge and feel the stillness of the Isuzu River.",
      imageUrl: "/photos/24825820_m.jpeg",
    },
    {
      kanji: "おかげ横丁",
      romaji: "Okage Yokochō",
      title: "Okage Yokochō · The Edo Food Street",
      body:
        "Edo-era storefronts line the streets back from Naikū. Come hungry — this food crawl replaces lunch. Matsusaka beef skewers, Ise udon, tekone-zushi, akafuku mochi, fresh oysters. Your guide leads you to the best stands; purchases are on your own so you can pick what you love.",
      imageUrl: "/photos/26802378_m.jpeg",
    },
    {
      kanji: "帰店",
      romaji: "Kiten",
      title: "Return to the Shop",
      body:
        "Around 16:30 we return by bus to Real Japan by YamaTrips. Browse omamori, samue, and local crafts, settle into the shop, and close the day at 17:00.",
      imageUrl: "/photos/IMG_3545.jpg",
    },
  ],

  included: {
    kanji: "巡礼",
    eyebrow: "The Pilgrim's Kit",
    heading: "What comes<br/>with the <em>walk.</em>",
    included: [
      "Private Licensed YamaTrips Guides (English & Japanese)",
      "Meet & greet at the shop, samue to wear during the tour",
      "Charcoal-infused local welcome drink",
      "15-minute briefing on Ise and Shintō",
      "Luggage drop at the shop during the tour",
      "Guided walk of Gekū — the Outer Shrine",
      "Guided walk of Naikū — the Inner Shrine",
      "Food crawl through Okage Yokochō (replaces lunch)",
    ],
    notIncluded: [
      "Shrine entry (always free)",
      "Personal food & drink purchases on Okage Yokochō",
      "Bus fares between Gekū and Naikū (~¥520 pp)",
      "Travel to Iseshi Station",
    ],
    foodImage: "/photos/26802378_m.jpeg",
    foodCaption: "Come hungry — Matsusaka skewers, Ise udon, tekone-zushi, akafuku mochi.",
  },

  pricingSection: {
    kanji: "料金",
    eyebrow: "The Offering",
    heading: "Choose your<br/><em>pilgrimage.</em>",
    backdropImage: "/photos/24825820_m.jpeg",
    privateDescription: "¥6,000 per person + ¥20,000 private surcharge. Your party only — choose any start between 10:00 and 14:00. Groups of 11+ receive the private upgrade free of charge — email admin@yamatrips.com.",
    privateBullets: [
      "¥6,000 / person + ¥20,000 private surcharge",
      "Your party only — up to 10 participants",
      "Flexible start (10:00 – 14:00)",
      "Tailored pace and stops",
      "11+ guests: free private upgrade",
    ],
    groupDescription: "¥6,000 per person. Mixed group up to 10. Runs Monday, Wednesday, and Saturday at 12:00.",
    groupBullets: [
      "¥6,000 per person",
      "Mixed group, up to 10 travellers",
      "Mon · Wed · Sat departures at 12:00",
      "Online advance payment via Stripe",
      "Same guide, same full route",
    ],
  },

  reviews: {
    eyebrow: "Traveler Voices",
    heading: "Reviews from Travelers",
    items: [
      {
        name: "Sarah M.",
        date: "April 2026",
        stars: 5,
        body: "Our guide made the shrines feel alive. We learned so much about the rituals and the history — and the street food in Oharaimachi was the perfect ending.",
        photos: [],
      },
      {
        name: "Hiroshi T.",
        date: "March 2026",
        stars: 5,
        body: "Beautifully paced. Neither rushed nor slow. My wife and I walked quietly for three hours and felt we had seen the real Ise.",
        photos: [],
      },
      {
        name: "Emma & James",
        date: "February 2026",
        stars: 5,
        body: "The private tour was worth every yen. We asked endless questions and our guide answered every one with patience and warmth.",
        photos: [],
      },
    ],
  },

  faq: [
    { q: "What language is the tour conducted in?", a: "The tour is fully conducted in English by our Private Licensed YamaTrips Guides." },
    { q: "Where exactly is the meeting point?", a: "We meet at Real Japan by YamaTrips on Geku Sando — approximately 3 minutes on foot from Iseshi Station (JR/Kintetsu). Please arrive by 12:00 to drop your luggage, slip on a samue, and meet the team before the 12:30 briefing." },
    { q: "How long is the tour?", a: "Approximately 4–5 hours. Group tours run from 12:00 (meet & greet) to 17:00 (close at the shop). Group departures: Monday, Wednesday, Saturday. Private tours can start any time between 10:00 and 14:00." },
    { q: "What should I wear and bring?", a: "Comfortable walking shoes are essential — total walking distance is 3–4 km. Come hungry — the food crawl through Okage Yokochō replaces lunch. Carry some cash for street food and the bus (~¥520 per person between Gekū and Naikū)." },
    { q: "How does pricing work?", a: "Group tour: ¥6,000 per person, mixed group up to 10, runs Mon · Wed · Fri. Private tour: ¥6,000 per person plus a ¥20,000 private surcharge for a dedicated group up to 10. Groups of 11+ receive the private upgrade free of charge — please email admin@yamatrips.com." },
    { q: "How do I pay?", a: "Online advance payment via Stripe at the time of booking." },
    { q: "What is your cancellation policy?", a: "Full refunds are available for cancellations made more than 48 hours before the tour start time. Cancellations within 48 hours are non-refundable." },
    { q: "Is the tour suitable for children?", a: "Yes — children are very welcome. The route is gentle walking on paved and gravel paths." },
    { q: "Can I leave my luggage at the shop?", a: "Yes — drop your luggage at Real Japan by YamaTrips when you arrive. It will be safely stored at the shop while you walk." },
  ],

  contact: {
    email: "admin@yamatrips.com",
    meetingPoint: "Real Japan by YamaTrips",
    meetingPointAddress: "Geku Sando, Ise-shi, Mie · 3 min walk from Iseshi Station",
  },

  site: {
    brandName: "Real Japan by YamaTrips",
    brandTagline: "Quiet pilgrimages, real Japan.",
    homeHero: {
      eyebrow: "Real Japan by YamaTrips",
      heading: "Walk the <em>real</em> Japan.",
      subheading: "Guided tours, a local shop, traditional stays, and crafts shipped from Ise.",
      backgroundImage: "/photos/24825820_m.jpeg",
    },
    categories: [
      {
        key: "store",
        title: "Our Store",
        kanji: "店",
        blurb: "Visit us on Geku Sando — samue attire, Ise crafts, and local goods.",
        image: "/photos/IMG_3545.jpg",
        href: "/store",
        status: "live",
      },
      {
        key: "tours",
        title: "Our Tours",
        kanji: "旅",
        blurb: "Bilingual walking tours through Ise's most sacred ground.",
        image: "/photos/2801930_m.jpeg",
        href: "/tours",
        status: "live",
      },
      {
        key: "accommodations",
        title: "Our Accommodations",
        kanji: "宿",
        blurb: "Traditional stays, opening soon.",
        image: "/photos/22321235_m.jpeg",
        href: "/accommodations",
        status: "construction",
      },
      {
        key: "shop",
        title: "Online Shipping",
        kanji: "送",
        blurb: "Ise crafts and goods, shipped worldwide. Coming soon.",
        image: "/photos/26802378_m.jpeg",
        href: "/shop",
        status: "construction",
      },
    ],
    store: {
      eyebrow: "Our Store",
      heading: "Real Japan <em>by YamaTrips.</em>",
      paragraphs: [
        "Our shop sits three minutes on foot from Iseshi Station, on the historic Geku Sando approach. Drop in for tea, browse samue attire and Ise crafts, or simply meet your guide before the walk.",
        "All our tours begin and end here. We hope to see you in person.",
      ],
      images: ["/photos/IMG_3545.jpg", "/photos/2801930_m.jpeg"],
      address: "Geku Sando, Ise-shi, Mie",
      hours: "Daily, 9:00 – 17:00",
    },
  },

  tours: [
    {
      slug: "ise-sacred-walk",
      name: "Ise Sacred Walk & Eat",
      kanji: "参道",
      summary: "A 4–5 hour walking and eating tour through Gekū, Naikū, and the Edo-era streets of Okage Yokochō. Led by Private Licensed YamaTrips Guides.",
      heroImage: "/photos/24825820_m.jpeg",
      durationLabel: "4 – 5 hours",
      fromPriceJpy: 6000,
      location: "Ise, Mie",
      active: true,
    },
  ],
};

/* ─── Persistence ─────────────────────────────────────────── */

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function deepMerge<T>(base: T, override: Partial<T>): T {
  if (typeof base !== "object" || base === null || Array.isArray(base)) {
    return (override ?? base) as T;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const k of Object.keys(override ?? {})) {
    const bv = (base as Record<string, unknown>)[k];
    const ov = (override as Record<string, unknown>)[k];
    if (bv && typeof bv === "object" && !Array.isArray(bv) && ov && typeof ov === "object" && !Array.isArray(ov)) {
      out[k] = deepMerge(bv, ov);
    } else if (ov !== undefined) {
      out[k] = ov;
    }
  }
  return out as T;
}

export async function getSettings(): Promise<Settings> {
  if (useBlob()) {
    try {
      const { blobs } = await list({ prefix: SETTINGS_BLOB_KEY, limit: 100 });
      const match = blobs.find(b => b.pathname === SETTINGS_BLOB_KEY);
      if (!match) return DEFAULT_SETTINGS;
      const res = await fetch(match.url, { cache: "no-store" });
      if (!res.ok) return DEFAULT_SETTINGS;
      const parsed = await res.json();
      return deepMerge(DEFAULT_SETTINGS, parsed);
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
  try {
    const file = path.join(DATA_DIR, "settings.json");
    if (!fs.existsSync(file)) {
      await saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(fs.readFileSync(file, "utf-8"));
    return deepMerge(DEFAULT_SETTINGS, parsed);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(s: Settings): Promise<void> {
  if (useBlob()) {
    await put(SETTINGS_BLOB_KEY, JSON.stringify(s, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, "settings.json"), JSON.stringify(s, null, 2));
}

const BOOKINGS_BLOB_KEY = "bookings.json";

async function readBookingsFromBlob(): Promise<Booking[]> {
  try {
    const { blobs } = await list({ prefix: BOOKINGS_BLOB_KEY, limit: 100 });
    const match = blobs.find(b => b.pathname === BOOKINGS_BLOB_KEY);
    if (!match) return [];
    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()).bookings ?? [];
  } catch {
    return [];
  }
}

async function writeBookingsToBlob(list: Booking[]): Promise<void> {
  await put(BOOKINGS_BLOB_KEY, JSON.stringify({ bookings: list }, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function getBookings(): Promise<Booking[]> {
  if (useBlob()) return readBookingsFromBlob();
  try {
    const file = path.join(DATA_DIR, "bookings.json");
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, "utf-8")).bookings ?? [];
  } catch {
    return [];
  }
}

export async function addBooking(booking: Booking): Promise<void> {
  const current = await getBookings();
  const next = [...current, booking];
  if (useBlob()) { await writeBookingsToBlob(next); return; }
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, "bookings.json"), JSON.stringify({ bookings: next }, null, 2));
}

export async function updateBookingStatus(stripeSessionId: string, status: "paid" | "cancelled"): Promise<void> {
  const current = await getBookings();
  const next = current.map((b) =>
    b.stripeSessionId === stripeSessionId ? { ...b, status } : b
  );
  if (useBlob()) { await writeBookingsToBlob(next); return; }
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, "bookings.json"), JSON.stringify({ bookings: next }, null, 2));
}
