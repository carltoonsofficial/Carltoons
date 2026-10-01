import { readMonetization } from "@/lib/monetization";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await readMonetization();
  if (!settings.publisherId || !settings.adsTxtAuthorized) {
    return new Response("", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  return new Response(`google.com, ${settings.publisherId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
