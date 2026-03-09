import { defineCollection, reference } from "astro:content";
import { glob, file } from "astro/loaders"; // Not available with legacy API
import { z } from "astro/zod";

const guides = defineCollection({
  loader: glob({
    pattern: ["*.md"],
    base: "src/data/guides",
  }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { guides };
