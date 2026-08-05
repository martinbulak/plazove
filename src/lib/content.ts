import "server-only";
import { readJson } from "./store";
import type {
  Article,
  CaseSection,
  ComparisonData,
  CityAction,
  ContractQA,
  DocumentItem,
  GalleryAlbum,
  GalleryItem,
  OpenQuestion,
  OpinionItem,
  ReviewAnalysis,
  SiteConfig,
  TimelineItem,
} from "./types";

/**
 * Typované čítanie obsahu pre verejné stránky a administráciu.
 * Verejné stránky filtrujú len publikované položky cez onlyPublished().
 */

export function onlyPublished<T extends { status: string }>(items: T[]): T[] {
  return items.filter((i) => i.status === "published");
}

export async function getSite(): Promise<SiteConfig> {
  return readJson<SiteConfig>("site", DEFAULT_SITE);
}

export async function getCaseSections(): Promise<CaseSection[]> {
  return readJson<CaseSection[]>("case", []);
}

export async function getTimeline(): Promise<TimelineItem[]> {
  const items = await readJson<TimelineItem[]>("timeline", []);
  return items.sort((a, b) => a.date.localeCompare(b.date));
}

export async function getContractQA(): Promise<ContractQA[]> {
  const items = await readJson<ContractQA[]>("contract", []);
  return items.sort((a, b) => a.order - b.order);
}

export async function getDocuments(): Promise<DocumentItem[]> {
  return readJson<DocumentItem[]>("documents", []);
}

export async function getGallery(): Promise<GalleryItem[]> {
  return readJson<GalleryItem[]>("gallery", []);
}

/** Albumy galérie, najnovšia udalosť ako prvá. */
export async function getGalleryAlbums(): Promise<GalleryAlbum[]> {
  const items = await readJson<GalleryAlbum[]>("galleryAlbums", []);
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getOpinions(): Promise<OpinionItem[]> {
  return readJson<OpinionItem[]>("opinions", []);
}

export async function getCityActions(): Promise<CityAction[]> {
  const items = await readJson<CityAction[]>("cityActions", []);
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getOpenQuestions(): Promise<OpenQuestion[]> {
  return readJson<OpenQuestion[]>("openQuestions", []);
}

export async function getArticles(): Promise<Article[]> {
  return readJson<Article[]>("articles", []);
}

export async function getReviewAnalysis(): Promise<ReviewAnalysis | null> {
  const data = await readJson<ReviewAnalysis | null>("reviews", null);
  return data && data.totalReviews ? data : null;
}

export async function getComparison(): Promise<ComparisonData> {
  return readJson<ComparisonData>("comparison", {
    cityFacts: [],
    cities: [],
    ratings: { checkedAt: "", minReviews: 0, items: [] },
  });
}

/** Fallback konfigurácia, ak content/site.json chýba. */
export const DEFAULT_SITE: SiteConfig = {
  siteName: "Za Pláž",
  tagline: "Ktorá nebude hanbou",
  heroTitle: "Čo sa deje s plážovým kúpaliskom v Banskej Bystrici?",
  heroSubtitle:
    "Dokumenty, právne analýzy, fotografie a skúsenosti verejnosti na jednom mieste.",
  disclaimer:
    "Toto nie je oficiálny web prevádzkovateľa plážového kúpaliska ani Mesta Banská Bystrica. Ide o nezávislý občiansky informačný projekt.",
  heroFacts: [],
  contactEmail: "info@zaplaz.sk",
  operator: "Martin Bulák – občiansky projekt Za Pláž",
  petitionText: "",
};
