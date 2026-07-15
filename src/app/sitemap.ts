import type { MetadataRoute } from "next";
import { MAIN_NAV, LEGAL_NAV, CTA_NAV } from "@/lib/nav";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://aqualandbb.sk";
  const routes = ["/", CTA_NAV.href, ...MAIN_NAV.map((i) => i.href), ...LEGAL_NAV.map((i) => i.href)];
  const unique = Array.from(new Set(routes));
  return unique.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
