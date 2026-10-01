import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { readMonetization, writeMonetization, type MonetizationSettings } from "@/lib/monetization";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const safe = (s: MonetizationSettings) => ({
  enabled: s.enabled,
  autoAds: s.autoAds,
  publisherId: s.publisherId,
  showHome: s.showHome,
  showContent: s.showContent,
  showVideos: s.showVideos,
  showSearch: s.showSearch,
  showSidebar: s.showSidebar,
});

export async function GET() {
  return NextResponse.json(safe(await readMonetization()));
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const current = await readMonetization();
    const body = await request.json();
    const publisherId = String(body?.publisherId ?? current.publisherId).trim();
    if (publisherId && !/^ca-pub-\d{6,30}$/.test(publisherId)) {
      return NextResponse.json({ error: "Publisher ID must look like ca-pub-1234567890." }, { status: 400 });
    }
    const next: MonetizationSettings = {
      ...current,
      enabled: Boolean(body?.enabled),
      autoAds: Boolean(body?.autoAds),
      publisherId,
      showHome: Boolean(body?.showHome),
      showContent: Boolean(body?.showContent),
      showVideos: Boolean(body?.showVideos),
      showSearch: Boolean(body?.showSearch),
      showSidebar: Boolean(body?.showSidebar),
      updatedAt: new Date().toISOString(),
    };
    await writeMonetization(next);
    return NextResponse.json(safe(next));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save monetization settings." }, { status: 500 });
  }
}
