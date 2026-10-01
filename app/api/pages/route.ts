import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { normalizeSlug, readPages, writePages, type SitePage } from "@/lib/pages";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const json = (data: unknown, status = 200) => NextResponse.json(data, { status });

export async function GET(request: Request) {
  try {
    const pages = await readPages();
    const admin = new URL(request.url).searchParams.get("admin") === "1" && await isAdmin();
    return json(pages.filter(p => admin || p.published).sort((a,b) => a.order - b.order));
  } catch (e) { return json({ error: e instanceof Error ? e.message : "Unable to load pages." }, 500); }
}
export async function POST(request: Request) {
  if (!await isAdmin()) return json({ error: "Unauthorized" }, 401);
  try {
    const body = await request.json(); const pages = await readPages(); const now = new Date().toISOString();
    let slug = normalizeSlug(String(body?.slug || body?.title || "page")) || `page-${Date.now()}`;
    let n = 2; while (pages.some(p => p.slug === slug)) slug = `${normalizeSlug(String(body?.slug || body?.title || "page"))}-${n++}`;
    const page: SitePage = { id: crypto.randomUUID(), title: String(body?.title || "Untitled Page").trim(), slug, content: String(body?.content || ""), description: String(body?.description || ""), seoTitle: String(body?.seoTitle || body?.title || "").trim(), seoDescription: String(body?.seoDescription || body?.description || "").trim(), published: Boolean(body?.published), order: Number.isFinite(Number(body?.order)) ? Number(body.order) : pages.length, createdAt: now, updatedAt: now };
    pages.push(page); await writePages(pages); return json(page, 201);
  } catch (e) { return json({ error: e instanceof Error ? e.message : "Unable to create page." }, 500); }
}
export async function PUT(request: Request) {
  if (!await isAdmin()) return json({ error: "Unauthorized" }, 401);
  try {
    const body = await request.json(); const pages = await readPages(); const index = pages.findIndex(p => p.id === body?.id); if (index < 0) return json({ error: "Page not found." }, 404);
    const nextSlug = normalizeSlug(String(body?.slug || pages[index].slug)) || pages[index].slug;
    if (pages.some((p,i) => i !== index && p.slug === nextSlug)) return json({ error: "That slug is already in use." }, 409);
    pages[index] = { ...pages[index], ...body, slug: nextSlug, id: pages[index].id, updatedAt: new Date().toISOString() };
    await writePages(pages); return json(pages[index]);
  } catch (e) { return json({ error: e instanceof Error ? e.message : "Unable to update page." }, 500); }
}
export async function DELETE(request: Request) {
  if (!await isAdmin()) return json({ error: "Unauthorized" }, 401);
  try { const { id } = await request.json(); const pages = await readPages(); await writePages(pages.filter(p => p.id !== id)); return json({ success: true }); }
  catch (e) { return json({ error: e instanceof Error ? e.message : "Unable to delete page." }, 500); }
}
