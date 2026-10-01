import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { initialFacebookReels } from "@/lib/facebook-reels";
import { readContent, writeContent } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const items = await readContent();
    const existingUrls = new Set(
      items.filter((item) => item.mediaType === "facebook-reel").map((item) => item.mediaUrl)
    );
    const now = new Date().toISOString();
    let added = 0;

    for (const reel of initialFacebookReels) {
      if (existingUrls.has(reel.url)) continue;
      const nextOrder = items.length;
      items.push({
        id: crypto.randomUUID(),
        title: `Carltoons Reel ${String(nextOrder + 1).padStart(2, "0")}`,
        description: "Facebook Reel from the Carltoons content library.",
        category: "Videos",
        mediaUrl: reel.url,
        mediaType: "facebook-reel",
        published: true,
        featured: false,
        order: nextOrder,
        createdAt: now,
        updatedAt: now,
      });
      existingUrls.add(reel.url);
      added++;
    }

    if (added) await writeContent(items);

    return NextResponse.json({
      success: true,
      added,
      totalReels: items.filter((item) => item.mediaType === "facebook-reel").length,
    });
  } catch (error) {
    console.error("POST /api/reels/import failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Reel import failed." },
      { status: 500 }
    );
  }
}
