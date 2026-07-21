/**
 * Definície polí pre generický editor administrácie. Každá kolekcia má zoznam
 * polí; editor podľa nich vykreslí formulár a uloží položku cez API.
 * Model zostáva v src/lib/types.ts – tu je len „UI mapa" preň.
 */

import {
  ACTION_STATUS_LABEL,
  CLAIM_KIND_LABEL,
  DOCUMENT_CATEGORY_LABEL,
} from "./types";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "checkbox"
  | "date"
  | "stringList"
  | "sources"
  | "sourceRef";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  /** Pri type=text default hodnota pre nové položky. */
  default?: string | number | boolean;
}

export interface CollectionDef {
  /** Kľúč = názov JSON súboru v /content. */
  name: string;
  title: string;
  /** Pole zobrazené ako názov v zozname. */
  labelField: string;
  /** Pomocné pole (napr. dátum) v zozname. */
  subField?: string;
  fields: FieldDef[];
}

const opts = (rec: Record<string, string>) =>
  Object.entries(rec).map(([value, label]) => ({ value, label }));

const CLAIM_OPTIONS = opts(CLAIM_KIND_LABEL);
const STATUS_OPTIONS = opts(ACTION_STATUS_LABEL);
const DOC_CAT_OPTIONS = opts(DOCUMENT_CATEGORY_LABEL);
const PUBLISH_OPTIONS = [
  { value: "concept", label: "Koncept" },
  { value: "published", label: "Publikované" },
];

/** Spoločné meta polia (publikovanie, SEO, audit). */
const META_FIELDS: FieldDef[] = [
  { name: "status", label: "Stav publikovania", type: "select", options: PUBLISH_OPTIONS, default: "concept" },
  { name: "publishedAt", label: "Dátum publikovania", type: "date" },
  { name: "author", label: "Autor / redaktor", type: "text" },
  { name: "seoTitle", label: "SEO názov", type: "text" },
  { name: "seoDescription", label: "SEO popis", type: "textarea" },
  { name: "isPlaceholder", label: "Vzorové (placeholder) dáta", type: "checkbox" },
  { name: "sources", label: "Zdroje", type: "sources" },
];

export const COLLECTIONS: Record<string, CollectionDef> = {
  timeline: {
    name: "timeline",
    title: "Časová os",
    labelField: "title",
    subField: "date",
    fields: [
      { name: "date", label: "Dátum alebo rok (napr. 2007 alebo 2007-05-12)", type: "text", required: true },
      { name: "title", label: "Názov udalosti", type: "text", required: true },
      { name: "description", label: "Krátky opis", type: "textarea", required: true },
      { name: "tag", label: "Značka (napr. zmluva, audit)", type: "text" },
      {
        name: "milestone",
        label: "Kľúčový moment",
        type: "checkbox",
        help: "Zobrazí sa aj v skrátenej (zbalenej) časovej osi na webe.",
      },
      ...META_FIELDS,
    ],
  },
  contract: {
    name: "contract",
    title: "Zmluva (otázky a odpovede)",
    labelField: "question",
    subField: "article",
    fields: [
      { name: "order", label: "Poradie", type: "number", required: true, default: 1 },
      { name: "question", label: "Otázka", type: "text", required: true },
      { name: "answer", label: "Odpoveď (laické vysvetlenie)", type: "textarea", required: true },
      { name: "article", label: "Článok zmluvy (napr. čl. IV ods. 2)", type: "text" },
      { name: "kind", label: "Druh tvrdenia", type: "select", options: CLAIM_OPTIONS, default: "legal_interpretation" },
      { name: "document", label: "Odkaz na dokument", type: "sourceRef" },
      { name: "status", label: "Stav publikovania", type: "select", options: PUBLISH_OPTIONS, default: "concept" },
      { name: "isPlaceholder", label: "Vzorové dáta", type: "checkbox" },
    ],
  },
  documents: {
    name: "documents",
    title: "Dokumenty a analýzy",
    labelField: "title",
    subField: "date",
    fields: [
      { name: "title", label: "Názov dokumentu", type: "text", required: true },
      { name: "slug", label: "Slug (URL identifikátor)", type: "text", required: true },
      { name: "date", label: "Dátum (YYYY alebo YYYY-MM-DD)", type: "text", required: true },
      { name: "category", label: "Kategória", type: "select", options: DOC_CAT_OPTIONS, default: "zmluva" },
      { name: "summary", label: "Stručné zhrnutie", type: "textarea", required: true },
      { name: "issuer", label: "Autor / vydávajúca inštitúcia", type: "text", required: true },
      { name: "fileUrl", label: "URL PDF (napr. /dokumenty/subor.pdf)", type: "text" },
      { name: "keyFindings", label: "Hlavné závery", type: "stringList" },
      { name: "sourceUrl", label: "Zdroj dokumentu (URL)", type: "text" },
      { name: "status", label: "Stav publikovania", type: "select", options: PUBLISH_OPTIONS, default: "concept" },
      { name: "isPlaceholder", label: "Vzorové dáta", type: "checkbox" },
    ],
  },
  gallery: {
    name: "gallery",
    title: "Galéria",
    labelField: "caption",
    subField: "date",
    fields: [
      { name: "src", label: "Cesta k obrázku (napr. /placeholders/x.svg)", type: "text", required: true },
      { name: "alt", label: "Alt text (povinné – prístupnosť)", type: "text", required: true },
      { name: "caption", label: "Popis", type: "text" },
      { name: "date", label: "Dátum (YYYY-MM alebo YYYY-MM-DD)", type: "text" },
      { name: "credit", label: "Autor / zdroj", type: "text" },
      { name: "origin", label: "Pôvod", type: "select", options: [
        { value: "own", label: "Vlastná" },
        { value: "external", label: "Prevzatá" },
      ], default: "own" },
      { name: "width", label: "Šírka (px)", type: "number", default: 1200 },
      { name: "height", label: "Výška (px)", type: "number", default: 800 },
      { name: "status", label: "Stav publikovania", type: "select", options: PUBLISH_OPTIONS, default: "concept" },
      { name: "isPlaceholder", label: "Vzorové dáta", type: "checkbox" },
    ],
  },
  opinions: {
    name: "opinions",
    title: "Názory verejnosti",
    labelField: "profileName",
    subField: "platform",
    fields: [
      { name: "excerpt", label: "Krátky autentický úryvok", type: "textarea", required: true },
      { name: "profileName", label: "Meno / názov profilu (presne podľa originálu)", type: "text", required: true },
      { name: "platform", label: "Platforma", type: "select", options: [
        { value: "facebook", label: "Facebook" },
        { value: "google", label: "Google recenzie" },
        { value: "instagram", label: "Instagram" },
        { value: "x", label: "X (Twitter)" },
        { value: "tripadvisor", label: "TripAdvisor" },
        { value: "iny", label: "Iná" },
      ], default: "google" },
      { name: "sentiment", label: "Charakter", type: "select", options: [
        { value: "negative", label: "Kritický" },
        { value: "neutral", label: "Neutrálny" },
        { value: "positive", label: "Pozitívny" },
      ], default: "negative" },
      { name: "postedAt", label: "Dátum publikovania originálu", type: "date" },
      { name: "originalUrl", label: "Odkaz na pôvodný príspevok", type: "text" },
      { name: "archivedAt", label: "Dátum archivácie", type: "date" },
      { name: "embedHtml", label: "Oficiálny embed (HTML, voliteľné)", type: "textarea" },
      {
        name: "note",
        label: "Redakčná poznámka ku kontextu",
        type: "textarea",
        help: "Napr. politická angažovanosť autora, upozornenie že ide o názor a nie o overené zistenie.",
      },
      { name: "approved", label: "Schválené na zverejnenie", type: "checkbox" },
      { name: "status", label: "Stav publikovania", type: "select", options: PUBLISH_OPTIONS, default: "concept" },
      { name: "isPlaceholder", label: "Vzorové dáta", type: "checkbox" },
    ],
  },
  cityActions: {
    name: "cityActions",
    title: "Čo urobilo mesto",
    labelField: "step",
    subField: "date",
    fields: [
      { name: "date", label: "Dátum alebo rok", type: "text", required: true },
      { name: "step", label: "Krok / verejný prísľub mesta", type: "text", required: true },
      { name: "actionStatus", label: "Stav plnenia", type: "select", options: STATUS_OPTIONS, default: "no_answer" },
      { name: "note", label: "Aktuálny stav / poznámka", type: "textarea" },
      { name: "status", label: "Stav publikovania", type: "select", options: PUBLISH_OPTIONS, default: "concept" },
      { name: "isPlaceholder", label: "Vzorové dáta", type: "checkbox" },
      { name: "sources", label: "Zdroje", type: "sources" },
    ],
  },
  openQuestions: {
    name: "openQuestions",
    title: "Otvorené otázky",
    labelField: "question",
    subField: "lastUpdated",
    fields: [
      { name: "question", label: "Otázka", type: "text", required: true },
      { name: "actionStatus", label: "Stav odpovede", type: "select", options: STATUS_OPTIONS, default: "no_answer" },
      { name: "cityAnswer", label: "Odpoveď mesta (ak existuje)", type: "textarea" },
      { name: "lastUpdated", label: "Dátum poslednej aktualizácie", type: "date" },
      { name: "status", label: "Stav publikovania", type: "select", options: PUBLISH_OPTIONS, default: "concept" },
      { name: "isPlaceholder", label: "Vzorové dáta", type: "checkbox" },
      { name: "sources", label: "Zdroje", type: "sources" },
    ],
  },
  articles: {
    name: "articles",
    title: "Články",
    labelField: "title",
    subField: "publishedAt",
    fields: [
      { name: "title", label: "Názov", type: "text", required: true },
      { name: "slug", label: "Slug (URL)", type: "text", required: true },
      { name: "perex", label: "Perex", type: "textarea", required: true },
      { name: "body", label: "Telo článku (Markdown)", type: "textarea", required: true },
      ...META_FIELDS,
    ],
  },
};

export const COLLECTION_LIST = Object.values(COLLECTIONS);
