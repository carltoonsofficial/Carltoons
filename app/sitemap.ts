import type { MetadataRoute } from "next";
import { readContent } from "@/lib/content";
import { readPages } from "@/lib/pages";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://carltoons-nine.vercel.app";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [content, pages] = await Promise.all([readContent(), readPages()]);
  return [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/videos`, lastModified: new Date() },
    { url: `${SITE_URL}/search`, lastModified: new Date() },
    ...content.filter(x=>x.published).map(x=>({url:`${SITE_URL}/content/${x.id}`,lastModified:new Date(x.updatedAt)})),
    ...pages.filter(x=>x.published).map(x=>({url:`${SITE_URL}/pages/${x.slug}`,lastModified:new Date(x.updatedAt)})),
  ];
}
