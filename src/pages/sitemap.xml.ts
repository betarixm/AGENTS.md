import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import {
  orderedNonEmptyCombinations,
  toGuideRoutePath,
} from "../lib/guide-route-combinations";

const toUrlNode = (location: string, lastModified: string, priority: string): string =>
  `<url><loc>${location}</loc><lastmod>${lastModified}</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;

export const GET: APIRoute = async ({ url }) => {
  const guideEntries = await getCollection("guides");
  const guideIds = guideEntries.map((guide) => guide.id);
  const lastModified = new Date().toISOString().split("T")[0];
  const homepageUrl = new URL("/", url).toString();
  const allGuidesUrl = new URL("/AGENTS.md", url).toString();

  const combinationUrls = Array.from(orderedNonEmptyCombinations(guideIds)).map((ids) =>
    new URL(toGuideRoutePath(ids), url).toString(),
  );

  const urlNodes = [
    toUrlNode(homepageUrl, lastModified, "1.0"),
    toUrlNode(allGuidesUrl, lastModified, "0.9"),
    ...combinationUrls.map((entryUrl) => toUrlNode(entryUrl, lastModified, "0.8")),
  ].join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlNodes}</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
};
