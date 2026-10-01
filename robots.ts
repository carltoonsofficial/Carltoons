<<<<<<< HEAD
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://carltoons-nine.vercel.app/sitemap.xml",
  };
=======
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://carltoons-nine.vercel.app/sitemap.xml",
  };
>>>>>>> origin/main
}