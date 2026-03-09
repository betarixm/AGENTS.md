import type { APIRoute } from "astro";
import { getCollection, getEntry } from "astro:content";
import { composeGuidesMarkdown } from "../../lib/compose-markdown";
import { orderedNonEmptyCombinations } from "../../lib/guide-route-combinations";

type RouteParams = {
  key: string;
};

type StaticPath = { params: RouteParams };

const RESPONSE_MESSAGES = {
  emptyKey: "No guide keys were provided.",
  duplicateKey: "Duplicate guide keys are not allowed.",
  notFound: "One or more guide keys were not found.",
} as const;

const toStaticPathParam = (guideIds: string[]): StaticPath => ({
  params: { key: guideIds.join(",") },
});

const parseGuideIds = (rawKey: string): string[] => rawKey.split(",").filter(Boolean);

const validateGuideIds = (
  guideIds: string[],
  validGuideIdSet: Set<string>,
): { status: number; message: string } | null => {
  if (guideIds.length === 0) return { status: 400, message: RESPONSE_MESSAGES.emptyKey };

  if (new Set(guideIds).size !== guideIds.length) {
    return { status: 400, message: RESPONSE_MESSAGES.duplicateKey };
  }

  if (guideIds.some((guideId) => !validGuideIdSet.has(guideId))) {
    return { status: 404, message: RESPONSE_MESSAGES.notFound };
  }

  return null;
};

const loadGuideSections = async (
  guideIds: string[],
): Promise<{ title: string; body: string }[] | null> => {
  const guideEntries = await Promise.all(
    guideIds.map((guideId) => getEntry("guides", guideId)),
  );
  const guideSections: { title: string; body: string }[] = [];

  for (const guideEntry of guideEntries) {
    if (!guideEntry || guideEntry.body === undefined) return null;
    guideSections.push({
      title: guideEntry.data.title,
      body: guideEntry.body,
    });
  }

  return guideSections;
};

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

export const getStaticPaths = async (): Promise<StaticPath[]> => {
  const guideEntries = await getCollection("guides");
  const guideIds = guideEntries.map((guide) => guide.id);

  return Array.from(orderedNonEmptyCombinations(guideIds), toStaticPathParam);
};

export const GET = (async ({ params }) => {
  const requestedGuideIds = parseGuideIds(params.key);
  const validGuideIdSet = new Set((await getCollection("guides")).map((guide) => guide.id));
  const validation = validateGuideIds(requestedGuideIds, validGuideIdSet);

  if (validation) {
    return markdownResponse(validation.message, validation.status);
  }

  const sections = await loadGuideSections(requestedGuideIds);
  if (!sections) {
    return markdownResponse(RESPONSE_MESSAGES.notFound, 404);
  }

  return markdownResponse(composeGuidesMarkdown(sections));
}) satisfies APIRoute<{}, RouteParams>;
