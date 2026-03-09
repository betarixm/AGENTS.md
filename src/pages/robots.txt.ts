import type { APIRoute } from "astro";

export const GET: APIRoute = ({ url }) => {
  const sitemapUrl = new URL("/sitemap.xml", url).toString();
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
};
