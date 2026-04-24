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
  tourName: "Ise Sacred Walk",
  maxParticipants: 12,

  sessions: {
    groupDeparture:  { active: true,  startTime: "12:00", endTime: "15:00" },
    privateWindow:   { active: true,  earliestStart: "10:00", latestStart: "14:00", durationHours: 3 },
    arriveEarlyMinutes: 15,
  },

  pricing: {
    private: { basePrice: 20000, basePersons: 2, additionalPersonPrice: 5000 },
    group:   { pricePerPerson: 5000, minParticipants: 4 },
  },

  blockedDates: [],
  announcement: "",

  hero: {
    eyebrow: "A Sacred Walk in Ise",
    heading: "Where the gods<br/>still <em>walk at dawn.</em>",
    subheading:
      "A three-hour pilgrimage through Japan's most revered shrines — Gekū, Naikū, and the four-hundred-year-old streets of Oharaimachi. Guided in English.",
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
      "We walk the same path, at the same pace, for three quiet hours. No rush, no schedule besides the one the cedars keep.",
    ],
    images: [
      "/photos/24825820_m.jpeg",
      "/photos/2801930_m.jpeg",
      "/photos/IMG_3545.jpg",
      "/photos/22321235_m.jpeg",
    ],
  },

  stats: [
    { kanji: "時", value: "3 Hours",     label: "Guided walk" },
    { kanji: "人", value: "2 – 12",      label: "Small group" },
    { kanji: "駅", value: "3 min walk",  label: "From Iseshi Station" },
    { kanji: "社", value: "Two Shrines", label: "Gekū · Naikū" },
  ],

  chapters: [
    {
      kanji: "店",
      romaji: "Mise",
      title: "Real Japan by YamaTrips",
      body:
        "We open with tea at our shop on Geku Sando. Arrive 15 minutes early to browse samue attire, Ise crafts, and local goods before the walk begins. Your guide will introduce the day's route over a warm welcome.",
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
      kanji: "おはらい町",
      romaji: "Oharaimachi",
      title: "Oharaimachi · The Pilgrim's Street",
      body:
        "Edo-period storefronts line the walk back from Naikū. Here we share 食べ歩き — Matsusaka beef skewers, Ise udon, akafuku mochi, fresh oysters. Your guide recommends the best stands; purchases are on your own so you can pick what you love.",
      imageUrl: "/photos/26802378_m.jpeg",
    },
  ],

  included: {
    kanji: "巡礼",
    eyebrow: "The Pilgrim's Kit",
    heading: "What comes<br/>with the <em>walk.</em>",
    included: [
      "Expert bilingual guide (English & Japanese)",
      "Welcome tea at the YamaTrips shop on Geku Sando",
      "Guided walk of Gekū — the Outer Shrine",
      "Bus transfer from Gekū to Naikū",
      "Guided exploration of Naikū — the Inner Shrine",
      "Street food introductions in Oharaimachi",
      "Best photo spots along the path",
    ],
    notIncluded: [
      "Shrine entry (always free)",
      "Personal food & drink purchases",
      "Return transport from Oharaimachi",
      "Bus fare from Gekū to Naikū (~¥140 pp)",
    ],
    foodImage: "/photos/26802378_m.jpeg",
    foodCaption: "Eat as the pilgrims did — Matsusaka skewers, Ise udon, akafuku mochi.",
  },

  pricingSection: {
    kanji: "料金",
    eyebrow: "The Offering",
    heading: "Choose your<br/><em>pilgrimage.</em>",
    backdropImage: "/photos/24825820_m.jpeg",
    privateDescription: "Your party only. Choose any start between 10:00 and 14:00.",
    privateBullets: [
      "Your party only",
      "Flexible start (10:00 – 14:00)",
      "Up to 12 participants",
      "Tailored pace and stops",
    ],
    groupDescription: "A shared walk. Departs once daily at 12:00.",
    groupBullets: [
      "Meet fellow travellers",
      "Single daily departure — 12:00",
      "Minimum 4 to run",
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
    { q: "What language is the tour conducted in?", a: "The tour is fully conducted in English by an expert bilingual guide." },
    { q: "Where exactly is the meeting point?", a: "We meet at Real Japan by YamaTrips on Geku Sando — approximately 3 minutes on foot from Iseshi Station (JR/Kintetsu). Please arrive 15 minutes before your tour start time so you have time to browse the shop and settle in." },
    { q: "What should I wear and bring?", a: "Comfortable walking shoes are essential — the total walking distance is 3–4 km. Dress for the weather, bring a small bag for any purchases on Oharaimachi, and carry some cash for street food and the local bus (~¥140 per person)." },
    { q: "What happens if the group tour minimum isn't met?", a: "For group tours, we require a minimum of 4 participants to run the session. If the minimum hasn't been reached 48 hours before your tour, we will contact you with the option to upgrade to a private tour or receive a full refund." },
    { q: "What is your cancellation policy?", a: "Full refunds are available for cancellations made more than 48 hours before the tour start time. Cancellations within 48 hours are non-refundable." },
    { q: "Is the tour suitable for children?", a: "Yes — children are very welcome. The route is gentle walking on paved and gravel paths." },
    { q: "Can I book a tour for the same day?", a: "Same-day bookings are subject to availability. We recommend booking at least 24 hours in advance." },
  ],

  contact: {
    email: "contact@yamatrips.com",
    meetingPoint: "Real Japan by YamaTrips",
    meetingPointAddress: "Geku Sando, Ise-shi, Mie",
  },
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
