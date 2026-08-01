import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const audience = z.enum(['interviewer', 'investor', 'judge', 'developer']);
const projectStatus = z.enum(['concept', 'building', 'mvp', 'beta', 'completed', 'maintained']);

const commonShowcaseFields = {
  title: z.string(),
  summary: z.string(),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  featured: z.boolean().default(false),
  priority: z.number().int().default(0),
  draft: z.boolean().default(false),
};

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...commonShowcaseFields,
    readingMinutes: z.number().int().positive().optional(),
    relatedProjects: z.array(z.string()).default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...commonShowcaseFields,
    type: z.enum(['course', 'personal', 'experiment', 'open-source']),
    status: projectStatus,
    role: z.string(),
    repo: z.url().optional(),
    demo: z.url().optional(),
    year: z.number().int(),
  }),
});

const products = defineCollection({
  loader: glob({ base: './src/content/products', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...commonShowcaseFields,
    tagline: z.string(),
    status: projectStatus,
    visibility: z.enum(['closed-source', 'private-demo', 'public-preview']),
    role: z.string(),
    audience: z.array(audience).default(['investor', 'interviewer', 'judge']),
    ctaLabel: z.string().default('查看产品案例'),
    demo: z.url().optional(),
    metrics: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        }),
      )
      .default([]),
  }),
});

const principles = defineCollection({
  loader: glob({ base: './src/content/principles', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number().int(),
    evidence: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { notes, projects, products, principles };
