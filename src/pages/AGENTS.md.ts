import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { composeGuidesMarkdown } from "../lib/compose-markdown";

const markdownResponse = (body: string, status = 200): Response =>
  new Response(body, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=600",
      "X-Robots-Tag":
        "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    },
  });

export const GET: APIRoute = async () => {
  const guides = await getCollection("guides");
  const sections = guides
    .slice()
    .sort((leftGuide, rightGuide) => leftGuide.id.localeCompare(rightGuide.id))
    .map((guide) => ({
      title: guide.data.title,
      body: guide.body,
    }))
    .filter(
      (section): section is { title: string; body: string } =>
        section.body !== undefined,
    );

  return markdownResponse(composeGuidesMarkdown(sections));
};
