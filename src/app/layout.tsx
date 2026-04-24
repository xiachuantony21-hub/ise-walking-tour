import type { Metadata } from "next";
import { Inter, Lora, Shippori_Mincho } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const shippori = Shippori_Mincho({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-shippori",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ise Sacred Walk · Real Japan by YamaTrips",
  description:
    "A 3-hour guided walking tour from Geku Sando to Naiku — experience Japan's most sacred pilgrimage route with an expert local guide.",
  keywords: ["Ise", "Ise Jingu", "walking tour", "guided tour", "Japan", "YamaTrips", "Real Japan"],
  openGraph: {
    title: "Ise Sacred Walk · Real Japan by YamaTrips",
    description: "Walk Japan's most sacred pilgrimage route with an expert local guide.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} ${shippori.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
