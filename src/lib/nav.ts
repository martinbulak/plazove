/** Hlavná navigácia webu – zdieľaná medzi Header, Footer a sitemap. */

export interface NavItem {
  href: string;
  label: string;
  /** Krátky popis pre sitemap/rozcestník. */
  desc?: string;
}

export const MAIN_NAV: NavItem[] = [
  {
    href: "/pripad",
    label: "Čo sa stalo",
    desc: "Príbeh prípadu v skratke a časová os udalostí",
  },
  {
    href: "/zmluva",
    label: "Zmluva a dokumenty",
    desc: "Zmluva vysvetlená v otázkach a odpovediach + archív dokumentov",
  },
  {
    href: "/aktualny-stav",
    label: "Aktuálny stav",
    desc: "Čo urobilo mesto, čo je nezodpovedané a čo hovoria ľudia",
  },
  {
    href: "/porovnanie",
    label: "Porovnanie",
    desc: "Ako fungujú kúpaliská v iných mestách a ako sú hodnotené",
  },
  {
    href: "/galeria",
    label: "Galéria",
    desc: "Fotografie stavu areálu",
  },
  {
    href: "/o-projekte",
    label: "O projekte",
    desc: "Kto a prečo web prevádzkuje",
  },
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
