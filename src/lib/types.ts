/**
 * Dátový model projektu „Aqualand BB – verejná kontrola".
 *
 * Celý obsah webu je typovaný tu. Kolekcie sa ukladajú ako JSON súbory v /content
 * a čítajú/zapisujú cez src/lib/store.ts. Administrácia (src/app/admin) používa
 * tie isté typy, takže model je jediný zdroj pravdy.
 */

/** Stav publikovania platí pre každú obsahovú položku. */
export type PublishStatus = "concept" | "published";

/**
 * Rozlíšenie druhu tvrdenia – kľúčové pre dôveryhodnosť a právnu bezpečnosť.
 * Web musí vždy odlišovať fakty, citácie, právne výklady a názory.
 */
export type ClaimKind =
  | "fact" // potvrdený fakt
  | "document_conclusion" // záver dokumentu
  | "citation" // doslovná citácia
  | "legal_interpretation" // právny výklad
  | "opinion" // názor autora webu
  | "open_question"; // otvorená otázka

export const CLAIM_KIND_LABEL: Record<ClaimKind, string> = {
  fact: "Potvrdený fakt",
  document_conclusion: "Záver dokumentu",
  citation: "Citácia",
  legal_interpretation: "Právny výklad",
  opinion: "Názor autora webu",
  open_question: "Otvorená otázka",
};

/** Odkaz na zdroj – povinný pri každom významnom tvrdení. */
export interface SourceRef {
  /** Popis zdroja, napr. „Nájomná zmluva, čl. IV, ods. 2". */
  label: string;
  /** URL na originál alebo interný odkaz na dokument (napr. /dokumenty#slug). */
  url?: string;
  /** ID dokumentu z kolekcie „documents" (ak ide o interný dokument). */
  documentId?: string;
  /** Konkrétna strana PDF, na ktorú odkaz smeruje. */
  page?: number;
}

/** Spoločné metadáta pre všetky obsahové položky (SEO, publikovanie, audit). */
export interface BaseEntity {
  id: string;
  status: PublishStatus;
  /** ISO dátum publikovania (YYYY-MM-DD). */
  publishedAt?: string;
  /** ISO dátum poslednej aktualizácie. */
  updatedAt?: string;
  /** Autor / redaktor položky. */
  author?: string;
  /** SEO titulok (voliteľný override). */
  seoTitle?: string;
  /** SEO popis (voliteľný override). */
  seoDescription?: string;
  /** Zdroje k položke. */
  sources?: SourceRef[];
  /** Interná poznámka – označenie, či ide o vzorové/placeholder dáta. */
  isPlaceholder?: boolean;
}

/* ── 2. Prípad v skratke ─────────────────────────────────────────────── */

export interface CasePoint {
  id: string;
  kind: ClaimKind;
  text: string;
  sources?: SourceRef[];
}

export interface CaseSection {
  /** „potvrdene-fakty" | „zavery-dokumentov" | „otvorene-otazky" | „nazory-autora" */
  key: string;
  title: string;
  intro?: string;
  points: CasePoint[];
}

/* ── 3. Časová os ────────────────────────────────────────────────────── */

export interface TimelineItem extends BaseEntity {
  /** Rok alebo presný dátum (YYYY alebo YYYY-MM-DD). */
  date: string;
  title: string;
  description: string;
  /** Voliteľné farebné/tematické označenie míľnika. */
  tag?: string;
  /** Kľúčový moment – zobrazuje sa aj v skrátenej (zbalenej) časovej osi. */
  milestone?: boolean;
}

/* ── 4. Zmluva a jej rozbor (Q&A) ────────────────────────────────────── */

export interface ContractQA extends BaseEntity {
  order: number;
  question: string;
  /** Jednoduché laické vysvetlenie. */
  answer: string;
  /** Konkrétny článok zmluvy, napr. „čl. IV ods. 2". */
  article?: string;
  /** Druh tvrdenia (citácia / právny výklad / názor …). */
  kind: ClaimKind;
  /** Odkaz na dokument/stranu PDF. */
  document?: SourceRef;
}

/* ── 5. Dokumenty a analýzy ──────────────────────────────────────────── */

export type DocumentCategory =
  | "zmluva" // nájomná zmluva a dodatky
  | "pravne-stanovisko" // právne stanoviská
  | "kontrolor" // správy hlavného kontrolóra
  | "audit" // audity
  | "uznesenie" // uznesenia mesta
  | "infoziadost" // odpovede na infožiadosti
  | "vyjadrenie"; // verejné vyjadrenia

export const DOCUMENT_CATEGORY_LABEL: Record<DocumentCategory, string> = {
  zmluva: "Nájomná zmluva a dodatky",
  "pravne-stanovisko": "Právne stanoviská",
  kontrolor: "Správy hlavného kontrolóra",
  audit: "Audity",
  uznesenie: "Uznesenia mesta",
  infoziadost: "Odpovede na infožiadosti",
  vyjadrenie: "Verejné vyjadrenia",
};

export interface DocumentItem extends BaseEntity {
  slug: string;
  title: string;
  /** Dátum dokumentu (YYYY-MM-DD alebo YYYY). */
  date: string;
  category: DocumentCategory;
  /** Stručné zhrnutie. */
  summary: string;
  /** Autor / vydávajúca inštitúcia. */
  issuer: string;
  /** Cesta k PDF (napr. /dokumenty/subor.pdf) alebo externá URL. */
  fileUrl?: string;
  /** Hlavné závery dokumentu (odrážky). */
  keyFindings?: string[];
  /** Odkaz na pôvodný zdroj dokumentu. */
  sourceUrl?: string;
}

/* ── 6. Galéria ──────────────────────────────────────────────────────── */

export interface GalleryItem extends BaseEntity {
  /** Cesta k obrázku (v /public alebo interná). */
  src: string;
  /** Alt text – povinný kvôli prístupnosti. */
  alt: string;
  /** Dátum vzniku fotografie. */
  date?: string;
  caption?: string;
  /** Autor alebo zdroj fotografie. */
  credit?: string;
  /** Vlastná („own") alebo prevzatá („external") fotografia. */
  origin: "own" | "external";
  width?: number;
  height?: number;
}

/* ── 7. Názory verejnosti ────────────────────────────────────────────── */

export type OpinionSentiment = "negative" | "neutral" | "positive";
export type OpinionPlatform =
  | "facebook"
  | "google"
  | "instagram"
  | "x"
  | "tripadvisor"
  | "iny";

export interface OpinionItem extends BaseEntity {
  /** Krátky autentický úryvok. */
  excerpt: string;
  /** Meno / verejný názov profilu presne podľa pôvodného príspevku. */
  profileName: string;
  platform: OpinionPlatform;
  /** Dátum publikovania pôvodného príspevku. */
  postedAt?: string;
  /** Odkaz na pôvodný príspevok. */
  originalUrl?: string;
  /** Dátum archivácie/pridania na web. */
  archivedAt?: string;
  sentiment: OpinionSentiment;
  /** Voliteľný oficiálny embed HTML (Facebook/Instagram/X). */
  embedHtml?: string;
  /** Bol príspevok manuálne schválený administrátorom? */
  approved: boolean;
  /** Redakčná poznámka ku kontextu zdroja (napr. politická angažovanosť autora). */
  note?: string;
}

/* ── Porovnanie a súvislosti ─────────────────────────────────────────── */

export interface CityFact {
  label: string;
  value: string;
  note?: string;
  sourceUrl?: string;
}

/** Typ prevádzkovateľa kúpaliska v porovnávaných mestách. */
export type OperatorType = "municipal" | "private" | "none";

export const OPERATOR_TYPE_LABEL: Record<OperatorType, string> = {
  municipal: "Mesto / mestská organizácia",
  private: "Súkromný subjekt",
  none: "Mimo prevádzky",
};

export interface CityComparison {
  id: string;
  city: string;
  population: string;
  facility: string;
  operator: string;
  operatorType: OperatorType;
  detail?: string;
  inOperation: string;
  sourceUrl?: string;
  /** Zvýrazniť riadok (Banská Bystrica). */
  highlight?: boolean;
}

/** Google hodnotenie jedného zariadenia. */
export interface FacilityRating {
  id: string;
  /** Názov presne podľa Google Máp. */
  name: string;
  /** Mesto / obec. */
  place: string;
  /** Priemerné hodnotenie, napr. 3.4 */
  rating: number;
  /** Počet Google recenzií – používame ho ako ukazovateľ návštevnosti. */
  reviews: number;
  /** Kto zariadenie prevádzkuje (typ). */
  operatorType?: OperatorType;
  note?: string;
  /** Zvýrazniť (plážové kúpalisko BB). */
  highlight?: boolean;
}

export interface RatingsBlock {
  /** Dátum overenia hodnotení. */
  checkedAt: string;
  /**
   * Minimálny počet recenzií pre zaradenie do zúženého rebríčka.
   * Odfiltruje prevádzky, ktorých hodnotenie stojí na desiatkach recenzií.
   */
  minReviews: number;
  items: FacilityRating[];
  /** Doplňujúce poznámky pod tabuľkou (napr. zatvorené kúpaliská). */
  footnotes?: string[];
}

export interface ComparisonData {
  cityFacts: CityFact[];
  cities: CityComparison[];
  ratings: RatingsBlock;
}

/* ── 8. Čo urobilo mesto ─────────────────────────────────────────────── */

export type ActionStatus = "done" | "in_progress" | "not_done" | "no_answer";

export const ACTION_STATUS_LABEL: Record<ActionStatus, string> = {
  done: "Splnené",
  in_progress: "Prebieha",
  not_done: "Nesplnené",
  no_answer: "Bez verejnej odpovede",
};

export interface CityAction extends BaseEntity {
  date: string;
  /** Krok alebo verejný prísľub mesta. */
  step: string;
  /** Stav plnenia (pozor: `status` z BaseEntity je stav publikovania). */
  actionStatus: ActionStatus;
  /** Aktuálny stav / poznámka. */
  note?: string;
}

/* ── 9. Otvorené otázky ──────────────────────────────────────────────── */

export interface OpenQuestion extends BaseEntity {
  question: string;
  /** Stav odpovede (pozor: `status` z BaseEntity je stav publikovania). */
  actionStatus: ActionStatus;
  /** Odpoveď mesta, ak existuje. */
  cityAnswer?: string;
  /** Dátum poslednej aktualizácie stavu. */
  lastUpdated?: string;
}

/* ── 1./2. Články (voliteľné dlhšie texty) ───────────────────────────── */

export interface Article extends BaseEntity {
  slug: string;
  title: string;
  perex: string;
  /** Telo článku v Markdowne (jednoduchý podset). */
  body: string;
}

/* ── 10. Podania od verejnosti (výzva, newsletter, tipy) ─────────────── */

export interface PetitionSignature {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  email: string;
  /** Zobraziť verejne meno a mesto? */
  showPublicly: boolean;
  /** Súhlas so spracovaním osobných údajov. */
  consent: boolean;
  /** Potvrdený e-mail (double opt-in). */
  confirmed: boolean;
  confirmToken?: string;
  createdAt: string;
  confirmedAt?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  confirmed: boolean;
  confirmToken?: string;
  createdAt: string;
  confirmedAt?: string;
}

export interface Submission {
  id: string;
  /** „tip" (dokument/tip) | „photo" (fotografia) | „correction" (nahlásenie chyby) */
  type: "tip" | "photo" | "correction";
  name?: string;
  email?: string;
  message: string;
  /** Pri fotografii potvrdenie autorstva a súhlasu so zverejnením. */
  photoConsent?: boolean;
  /** Pri fotografii – URL/odkaz, ak bol priložený. */
  attachmentNote?: string;
  createdAt: string;
  handled: boolean;
}

/* ── Globálne nastavenia webu ────────────────────────────────────────── */

export interface HeroFact {
  label: string;
  value: string;
  kind: ClaimKind;
}

export interface SiteConfig {
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  disclaimer: string;
  heroFacts: HeroFact[];
  contactEmail: string;
  operator: string;
  petitionText: string;
}

/* ── Analýza verejných recenzií ──────────────────────────────────────── */

/** Rozloženie hodnotení podľa počtu hviezd. */
export interface RatingBucket {
  stars: number;
  count: number;
}

/** Opakujúca sa téma sťažností. */
export interface ComplaintTheme {
  id: string;
  label: string;
  /**
   * Koľkokrát sa téma v preskúmanej vzorke objavila. Nepovinné – ak vzorka
   * nie je dosť veľká na počítanie, tému uvedieme bez čísla a doložíme zdrojmi.
   */
  count?: number;
  description: string;
  /** Zdroje, z ktorých téma vyplýva (ak nie je podložená počtom). */
  evidence?: string[];
}

/** Ukážka konkrétnej verejnej recenzie. */
export interface ReviewSample {
  id: string;
  /** Autor tak, ako je uvedený na webe (možno skrátene kvôli súkromiu). */
  author: string;
  stars: number;
  /** Napr. „pred 3 týždňami“ alebo dátum. */
  date: string;
  excerpt: string;
  platform: string;
  /** Reagoval prevádzkovateľ na recenziu? */
  ownerReplied?: boolean;
}

export interface ReviewAnalysis {
  facility: string;
  /** Dátum, ku ktorému boli údaje odčítané. */
  checkedAt: string;
  average: number;
  totalReviews: number;
  distribution: RatingBucket[];
  /** Počet recenzií, ktoré boli podrobne prečítané pri analýze tém. */
  analysedSample: number;
  sourceUrl?: string;
  themes: ComplaintTheme[];
  samples: ReviewSample[];
}

/** Názvy kolekcií = názvy JSON súborov v /content (bez prípony). */
export type CollectionName =
  | "site"
  | "case"
  | "timeline"
  | "contract"
  | "documents"
  | "gallery"
  | "opinions"
  | "cityActions"
  | "openQuestions"
  | "articles";
