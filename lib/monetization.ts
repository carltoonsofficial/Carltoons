import { promises as fs } from "node:fs";
import { list, put } from "@vercel/blob";
import path from "node:path";

export type MonetizationSettings = {
  enabled: boolean;
  autoAds: boolean;
  publisherId: string;
  showHome: boolean;
  showContent: boolean;
  showVideos: boolean;
  showSearch: boolean;
  showSidebar: boolean;
  adsTxtAuthorized: boolean;
  updatedAt: string;
};

const FILE = path.join(process.cwd(), "data", "carltoons-monetization.json");

export const defaultMonetization: MonetizationSettings = {
  enabled: false,
  autoAds: false,
  publisherId: "",
  showHome: false,
  showContent: true,
  showVideos: true,
  showSearch: true,
  showSidebar: false,
  adsTxtAuthorized: true,
  updatedAt: new Date(0).toISOString(),
};

async function readLocal() {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return { ...defaultMonetization, ...(JSON.parse(raw) as Partial<MonetizationSettings>) };
  } catch {
    return { ...defaultMonetization };
  }
}

export async function readMonetization(): Promise<MonetizationSettings> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return readLocal();
  try {
    const result = await list({ prefix: "data/carltoons-monetization.json", limit: 10 });
    const blob = result.blobs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0];
    if (!blob) return readLocal();
    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Storage returned ${response.status}`);
    return { ...defaultMonetization, ...(await response.json() as Partial<MonetizationSettings>) };
  } catch {
    return readLocal();
  }
}

export async function writeMonetization(settings: MonetizationSettings) {
  const payload = JSON.stringify(settings, null, 2);
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put("data/carltoons-monetization.json", payload, { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
    return;
  }
  if (process.env.NODE_ENV === "production") throw new Error("BLOB_READ_WRITE_TOKEN is required for persistent production monetization settings.");
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, payload, "utf8");
}
