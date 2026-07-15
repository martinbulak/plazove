/** Hlavná navigácia webu – zdieľaná medzi Header, Footer a sitemap. */

export interface NavItem {
  href: string;
  label: string;
  /** Krátky popis pre sitemap/rozcestník. */
  desc?: string;
}

export const MAIN_NAV: NavItem[] = [
  { href: "/pripad", label: "Prípad v skratke", desc: "Čo sa stalo, komu a na ako dlho" },
  { href: "/casova-os", label: "Časová os", desc: "Chronológia udalostí" },
  { href: "/zmluva", label: "Zmluva", desc: "Laický rozbor nájomnej zmluvy" },
  { href: "/dokumenty", label: "Dokumenty", desc: "Zmluvy, analýzy, audity, uznesenia" },
  { href: "/galeria", label: "Galéria", desc: "Aktuálny a historický stav areálu" },
  { href: "/nazory", label: "Názory verejnosti", desc: "Verejne publikované skúsenosti" },
  { href: "/co-urobilo-mesto", label: "Čo urobilo mesto", desc: "Kroky a prísľuby mesta" },
  { href: "/otvorene-otazky", label: "Otvorené otázky", desc: "Na čo nie je jasná odpoveď" },
  { href: "/o-projekte", label: "O projekte", desc: "Kto a prečo web prevádzkuje" },
];

export const CTA_NAV: NavItem = {
  href: "/podporte",
  label: "Podporiť výzvu",
};

export const LEGAL_NAV: NavItem[] = [
  { href: "/ochrana-osobnych-udajov", label: "Ochrana osobných údajov" },
  { href: "/cookies", label: "Cookies" },
  { href: "/podmienky", label: "Podmienky používania" },
  { href: "/nahlasit", label: "Nahlásiť chybu / obsah" },
];
