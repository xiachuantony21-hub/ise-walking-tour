/**
 * Curated imagery for the Ise Sacred Walk site.
 *
 * Sourced from Unsplash (free-to-use). To replace with YamaTrips' own
 * photography, just change the URLs below — all sections read from here.
 *
 * Hi-res delivery via Unsplash's image CDN (w=1800 for hero, w=900 for cards).
 */

const unsplash = (id: string, w = 1800, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export interface HeroSlide {
  id: string;
  url: string;
  kanji: string;
  caption: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "1492571350019-22de08371fd3",
    url: unsplash("1492571350019-22de08371fd3"),
    kanji: "鳥居",
    caption: "Pass beneath the torii",
  },
  {
    id: "1528164344705-47542687000d",
    url: unsplash("1528164344705-47542687000d"),
    kanji: "伊勢",
    caption: "Where the sacred mountain meets the shrine",
  },
  {
    id: "1578637387939-43c525550085",
    url: unsplash("1578637387939-43c525550085"),
    kanji: "朝",
    caption: "Walk with the rising sun",
  },
  {
    id: "1480796927426-f609979314bd",
    url: unsplash("1480796927426-f609979314bd"),
    kanji: "町",
    caption: "Old town, eternal streets",
  },
];

export interface RouteStop {
  kanji: string;
  romaji: string;
  title: string;
  body: string;
  image: string;
  imageHalf: string;
}

export const ROUTE_STOPS: RouteStop[] = [
  {
    kanji: "店",
    romaji: "Mise",
    title: "The Store — Real Japan by YamaTrips",
    body:
      "We gather at our shop on Geku Sando, just three minutes on foot from Iseshi Station. Over tea we share the quiet rituals of Ise before the first step is taken.",
    image: unsplash("1480796927426-f609979314bd", 1400),
    imageHalf: unsplash("1480796927426-f609979314bd", 900),
  },
  {
    kanji: "外宮",
    romaji: "Gekū",
    title: "Gekū · The Outer Shrine",
    body:
      "Walk the cedar-lined sandō to Toyouke Ōmikami — the deity of food, clothing, and shelter. Traditionally visited first before the Inner Shrine, following centuries of pilgrimage custom.",
    image: unsplash("1492571350019-22de08371fd3", 1400),
    imageHalf: unsplash("1492571350019-22de08371fd3", 900),
  },
  {
    kanji: "内宮",
    romaji: "Naikū",
    title: "Naikū · The Inner Shrine",
    body:
      "A short bus ride brings us to the most sacred shrine in all of Japan, dedicated to the sun goddess Amaterasu Ōmikami. Cross the Uji Bridge and feel the stillness of the Isuzu River.",
    image: unsplash("1528164344705-47542687000d", 1400),
    imageHalf: unsplash("1528164344705-47542687000d", 900),
  },
  {
    kanji: "おはらい町",
    romaji: "Oharaimachi",
    title: "Oharaimachi · The Pilgrim's Street",
    body:
      "Edo-period storefronts line the path back from Naikū. We taste Ise udon, akafuku mochi, and grilled skewers — flavours the pilgrims have shared for four hundred years.",
    image: unsplash("1553621042-f6e147245754", 1400),
    imageHalf: unsplash("1554502078-ef0fc409efce", 900),
  },
];

export const GALLERY: { url: string; label: string; span: string }[] = [
  { url: unsplash("1492571350019-22de08371fd3", 1200), label: "Torii",      span: "col-span-2 row-span-2" },
  { url: unsplash("1578637387939-43c525550085", 800),  label: "Dawn",       span: "col-span-1 row-span-1" },
  { url: unsplash("1480796927426-f609979314bd", 800),  label: "Oharaimachi",span: "col-span-1 row-span-1" },
  { url: unsplash("1528164344705-47542687000d", 1200), label: "Sacred Peak",span: "col-span-2 row-span-1" },
  { url: unsplash("1553621042-f6e147245754", 800),     label: "Ise Eats",   span: "col-span-1 row-span-1" },
  { url: unsplash("1554502078-ef0fc409efce", 800),     label: "Street Food",span: "col-span-1 row-span-1" },
];
