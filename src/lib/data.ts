import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export interface Settings {
  tourName: string;
  maxParticipants: number;
  sessions: {
    morning:   { active: boolean; startTime: string; endTime: string };
    afternoon: { active: boolean; startTime: string; endTime: string };
  };
  pricing: {
    private: { basePrice: number; basePersons: number; additionalPersonPrice: number };
    group:   { pricePerPerson: number; minParticipants: number };
  };
  blockedDates: string[];
  announcement: string;
}

export interface Booking {
  id: string;
  createdAt: string;
  tourType: "private" | "group";
  date: string;
  session: "morning" | "afternoon";
  participants: number;
  totalPrice: number;
  status: "pending" | "paid" | "cancelled";
  customer: { name: string; email: string; phone: string; notes: string };
  stripeSessionId: string;
}

const DEFAULT_SETTINGS: Settings = {
  tourName: "Ise Sacred Walk",
  maxParticipants: 12,
  sessions: {
    morning:   { active: true, startTime: "10:00", endTime: "13:00" },
    afternoon: { active: true, startTime: "15:00", endTime: "18:00" },
  },
  pricing: {
    private: { basePrice: 20000, basePersons: 2, additionalPersonPrice: 5000 },
    group:   { pricePerPerson: 5000, minParticipants: 4 },
  },
  blockedDates: [],
  announcement: "",
};

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function getSettings(): Settings {
  try {
    const file = path.join(DATA_DIR, "settings.json");
    if (!fs.existsSync(file)) { saveSettings(DEFAULT_SETTINGS); return DEFAULT_SETTINGS; }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(fs.readFileSync(file, "utf-8")) };
  } catch { return DEFAULT_SETTINGS; }
}

export function saveSettings(s: Settings): void {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, "settings.json"), JSON.stringify(s, null, 2));
}

export function getBookings(): Booking[] {
  try {
    const file = path.join(DATA_DIR, "bookings.json");
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, "utf-8")).bookings ?? [];
  } catch { return []; }
}

export function addBooking(booking: Booking): void {
  ensureDir();
  const file = path.join(DATA_DIR, "bookings.json");
  const list = getBookings();
  list.push(booking);
  fs.writeFileSync(file, JSON.stringify({ bookings: list }, null, 2));
}

export function updateBookingStatus(stripeSessionId: string, status: "paid" | "cancelled"): void {
  const file = path.join(DATA_DIR, "bookings.json");
  const list = getBookings().map((b) =>
    b.stripeSessionId === stripeSessionId ? { ...b, status } : b
  );
  fs.writeFileSync(file, JSON.stringify({ bookings: list }, null, 2));
}
