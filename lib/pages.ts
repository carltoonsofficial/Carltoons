import { list, put } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";

export type SitePage = {
  id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

const DATA_PATH = "data/carltoons-pages.json";
const LOCAL_DATA_FILE = path.join(process.cwd(), DATA_PATH);

function useBlobStorage() { return Boolean(process.env.BLOB_READ_WRITE_TOKEN); }
function normalizeSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
export { normalizeSlug };

async function readLocal(): Promise<SitePage[]> {
  try { const raw = await fs.readFile(LOCAL_DATA_FILE, "utf8"); const data: unknown = JSON.parse(raw); return Array.isArray(data) ? data as SitePage[] : []; }
  catch (e: any) { if (e?.code !== "ENOENT") console.error("Page storage read failed:", e); return []; }
}
async function writeLocal(items: SitePage[]) {
  await fs.mkdir(path.dirname(LOCAL_DATA_FILE), { recursive: true });
  await fs.writeFile(LOCAL_DATA_FILE, JSON.stringify(items, null, 2), "utf8");
}
export async function readPages(): Promise<SitePage[]> {
  if (!useBlobStorage()) return readLocal();
  try {
    const result = await list({ prefix: DATA_PATH, limit: 20 });
    const blob = result.blobs.filter(b => b.pathname === DATA_PATH).sort((a,b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0];
    if (!blob) return [];
    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Page storage returned ${response.status}.`);
    const data: unknown = await response.json();
    return Array.isArray(data) ? data as SitePage[] : [];
  } catch (e) { console.error("Page storage read failed:", e); return process.env.NODE_ENV !== "production" ? readLocal() : []; }
}
export async function writePages(items: SitePage[]) {
  if (!useBlobStorage()) {
    if (process.env.NODE_ENV === "production") throw new Error("BLOB_READ_WRITE_TOKEN is required in production.");
    return writeLocal(items);
  }
  await put(DATA_PATH, JSON.stringify(items, null, 2), { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
}
