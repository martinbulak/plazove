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
    href: "/otazky-a-odpovede",
    label: "Otázky a odpovede",
    desc: "Čo hovorí nájomná zmluva, vysvetlené v bežnej reči",
  },
  {
    href: "/dokumenty",
    label: "Dokumenty",
    desc: "Archív zmlúv, analýz, kontrol a odpovedí na infožiadosti",
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
];

/**
 * Sekcie v pätičke. „O projekte" je zámerne mimo hlavnej navigácie –
 * v hlavičke by zaberalo miesto obsahovým sekciám, ale odkaz naň musí
 * zostať dostupný.
 */
export const FOOTER_NAV: NavItem[] = [
  ...MAIN_NAV,
  { href: "/o-projekte", label: "O projekte", desc: "Kto a prečo web prevádzkuje" },
];

export const CTA_NAV: NavItem = {
  href: "/podporte",
  label: "Ako pomôcť",
};

export const LEGAL_NAV: NavItem[] = [
  { href: "/podmienky", label: "Podmienky používania" },
  { href: "/nahlasit", label: "Nahlásiť chybu / obsah" },
];
