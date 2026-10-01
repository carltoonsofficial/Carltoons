import { list, put } from "@vercel/blob";

export type ContentItem = {
  id: string;
  title: string;
  description: string;
  category: "Artwork" | "Videos" | "Stories" | "Projects" | "Files";
  mediaUrl?: string;
  mediaType?: string;
  published: boolean;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

const DATA_PATH = "data/carltoons-content.json";

export const emptyContent: ContentItem[] = [];

export async function readContent(): Promise<ContentItem[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return emptyContent;
  const result = await list({ prefix: DATA_PATH, limit: 1 });
  const blob = result.blobs[0];
  if (!blob) return emptyContent;

  const response = await fetch(blob.url, { cache: "no-store" });
  if (!response.ok) return emptyContent;

  const data = await response.json();
  return Array.isArray(data) ? data : emptyContent;
}

export async function writeContent(items: ContentItem[]) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  }

  await put(DATA_PATH, JSON.stringify(items, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
