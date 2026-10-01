import { list, put } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";

export type ContentCategory =
  | "Artwork" | "Videos" | "Stories" | "Projects" | "Files"
  | "Tips" | "How-To" | "Rankings" | string;

export type ContentItem = {
  id: string;
  title: string;
  description: string;
  category: ContentCategory;
  mediaUrl?: string;
  mediaType?: string;
  published: boolean;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

const DATA_PATH = "data/carltoons-content.json";
const LOCAL_DATA_FILE = path.join(process.cwd(), DATA_PATH);

export const emptyContent: ContentItem[] = [];

function useBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function isProductionWithoutStorage() {
  return process.env.NODE_ENV === "production" && !useBlobStorage();
}

async function readLocal(): Promise<ContentItem[]> {
  try {
    const raw = await fs.readFile(LOCAL_DATA_FILE, "utf8");
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? (data as ContentItem[]) : [];
  } catch (error: unknown) {
    const code = error && typeof error === "object" && "code" in error
      ? String((error as { code?: string }).code)
      : "";
    if (code !== "ENOENT") console.error("Local content read failed:", error);
    return [];
  }
}

async function writeLocal(items: ContentItem[]) {
  await fs.mkdir(path.dirname(LOCAL_DATA_FILE), { recursive: true });
  await fs.writeFile(LOCAL_DATA_FILE, JSON.stringify(items, null, 2), "utf8");
}

export async function readContent(): Promise<ContentItem[]> {
  if (!useBlobStorage()) {
    return readLocal();
  }

  try {
    const result = await list({ prefix: DATA_PATH, limit: 20 });
    const blob = result.blobs
      .filter((item) => item.pathname === DATA_PATH)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0];

    if (!blob) return [];

    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Content storage returned ${response.status}.`);

    const data: unknown = await response.json();
    return Array.isArray(data) ? (data as ContentItem[]) : [];
  } catch (error) {
    console.error("Content storage read failed:", error);
    if (process.env.NODE_ENV !== "production") return readLocal();
    return [];
  }
}

export async function writeContent(items: ContentItem[]) {
  if (!useBlobStorage()) {
    if (isProductionWithoutStorage()) {
      throw new Error("BLOB_READ_WRITE_TOKEN is required in production. Add it in Vercel Environment Variables.");
    }
    await writeLocal(items);
    return;
  }

  await put(DATA_PATH, JSON.stringify(items, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
