import type { CollectionEntry } from 'astro:content';

type Publishable = {
  data: {
    draft: boolean;
    featured?: boolean;
    priority?: number;
    publishedAt?: Date;
  };
};

export function isPublished<T extends Publishable>(entry: T) {
  return !entry.data.draft;
}

export function byPriority<T extends Publishable>(a: T, b: T) {
  const priority = (b.data.priority ?? 0) - (a.data.priority ?? 0);
  if (priority !== 0) return priority;

  return (b.data.publishedAt?.getTime() ?? 0) - (a.data.publishedAt?.getTime() ?? 0);
}

export function byDate<T extends Publishable>(a: T, b: T) {
  return (b.data.publishedAt?.getTime() ?? 0) - (a.data.publishedAt?.getTime() ?? 0);
}

export function featured<T extends Publishable>(entries: T[]) {
  return entries.filter((entry) => isPublished(entry) && entry.data.featured).sort(byPriority);
}

export type NoteEntry = CollectionEntry<'notes'>;
export type ProjectEntry = CollectionEntry<'projects'>;
export type ProductEntry = CollectionEntry<'products'>;
