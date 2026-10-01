import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { readContent, writeContent, type ContentItem } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (data: unknown, status = 200) => NextResponse.json(data, { status });

function normalizeMedia(url: unknown, type: unknown) {
  const mediaUrl = String(url || "").trim();
  const requested = String(type || "").trim();
  if (requested) return { mediaUrl, mediaType: requested };
  if (/facebook\.com\/(?:reel|watch)\//i.test(mediaUrl)) return { mediaUrl, mediaType: "facebook-reel" };
  if (/\.(mp4|webm|mov|m4v)(?:\?|$)/i.test(mediaUrl)) return { mediaUrl, mediaType: "video" };
  if (/\.(png|jpe?g|gif|webp|avif)(?:\?|$)/i.test(mediaUrl)) return { mediaUrl, mediaType: "image" };
  return { mediaUrl, mediaType: "" };
}

export async function GET(request: Request) {
  try {
    const items = await readContent();
    const url = new URL(request.url);
    const adminView = url.searchParams.get("admin") === "1" && (await isAdmin());
    const visible = adminView ? items : items.filter((item) => item.published);
    return json([...visible].sort((a, b) => a.order - b.order));
  } catch (error) {
    console.error("GET /api/content failed:", error);
    return json({ error: "Unable to load content." }, 500);
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return json({ error: "Unauthorized" }, 401);

  try {
    const body = await request.json();
    const items = await readContent();
    const now = new Date().toISOString();

    const item: ContentItem = {
      id: crypto.randomUUID(),
      title: String(body?.title || "Untitled").trim(),
      description: String(body?.description || ""),
      category: String(body?.category || "Stories"),
      ...normalizeMedia(body?.mediaUrl, body?.mediaType),
      published: Boolean(body?.published),
      featured: Boolean(body?.featured),
      order: Number.isFinite(Number(body?.order)) ? Number(body.order) : items.length,
      createdAt: now,
      updatedAt: now,
    };

    items.push(item);
    await writeContent(items);
    return json(item, 201);
  } catch (error) {
    console.error("POST /api/content failed:", error);
    return json({ error: error instanceof Error ? error.message : "Unable to create content." }, 500);
  }
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) return json({ error: "Unauthorized" }, 401);

  try {
    const body = await request.json();
    const items = await readContent();
    const index = items.findIndex((item) => item.id === body?.id);
    if (index === -1) return json({ error: "Not found" }, 404);

    const media = normalizeMedia(body?.mediaUrl ?? items[index].mediaUrl, body?.mediaType ?? items[index].mediaType);
    items[index] = {
      ...items[index],
      ...body,
      ...media,
      id: items[index].id,
      updatedAt: new Date().toISOString(),
    };

    await writeContent(items);
    return json(items[index]);
  } catch (error) {
    console.error("PUT /api/content failed:", error);
    return json({ error: error instanceof Error ? error.message : "Unable to update content." }, 500);
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return json({ error: "Unauthorized" }, 401);

  try {
    const { id } = await request.json();
    const items = await readContent();
    const next = items.filter((item) => item.id !== id);
    await writeContent(next);
    return json({ success: true });
  } catch (error) {
    console.error("DELETE /api/content failed:", error);
    return json({ error: error instanceof Error ? error.message : "Unable to delete content." }, 500);
  }
}
