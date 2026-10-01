import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { readContent, writeContent, type ContentItem } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const items = await readContent();
  const url = new URL(request.url);
  const adminView = url.searchParams.get("admin") === "1" && (await isAdmin());
  const visible = adminView ? items : items.filter((item) => item.published);
  return NextResponse.json(visible.sort((a, b) => a.order - b.order));
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const items = await readContent();
  const now = new Date().toISOString();

  const item: ContentItem = {
    id: crypto.randomUUID(),
    title: String(body.title || "Untitled"),
    description: String(body.description || ""),
    category: body.category,
    mediaUrl: body.mediaUrl || "",
    mediaType: body.mediaType || "",
    published: Boolean(body.published),
    featured: Boolean(body.featured),
    order: Number.isFinite(body.order) ? body.order : items.length,
    createdAt: now,
    updatedAt: now,
  };

  items.push(item);
  await writeContent(items);
  return NextResponse.json(item);
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const items = await readContent();
  const index = items.findIndex((item) => item.id === body.id);

  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  items[index] = {
    ...items[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  await writeContent(items);
  return NextResponse.json(items[index]);
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  const items = await readContent();
  const next = items.filter((item) => item.id !== id);

  await writeContent(next);
  return NextResponse.json({ success: true });
}
