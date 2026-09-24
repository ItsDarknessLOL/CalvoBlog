import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const sharedSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  readingTime: z.string(),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  draft: z.boolean().default(false)
});

const tutoriales = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/tutoriales" }),
  schema: sharedSchema.extend({ level: z.enum(["Principiante", "Intermedio", "Avanzado"]) })
});

const articulos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articulos" }),
  schema: sharedSchema
});

const noticias = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/noticias" }),
  schema: sharedSchema.extend({ sourceUrl: z.string().url().optional(), sourceName: z.string().optional() })
});

export const collections = { tutoriales, articulos, noticias };
