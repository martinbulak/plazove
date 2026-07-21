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
    label: "Prípad a chronológia",
    desc: "Čo sa stalo, komu mesto areál prenajalo a ako sa situácia vyvíjala",
  },
  {
    href: "/zmluva",
    label: "Zmluva a dokumenty",
    desc: "Laický rozbor nájomnej zmluvy a archív dokumentov",
  },
  {
    href: "/aktualny-stav",
    label: "Aktuálny stav",
    desc: "Kroky mesta, otvorené otázky a názory verejnosti",
  },
  {
    href: "/porovnanie",
    label: "Porovnanie a súvislosti",
    desc: "Ako to riešia iné mestá a v akom kontexte",
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
