import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://carltoons-nine.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Carltoons | Creator, Artist & Entertainment", template: "%s | Carltoons" },
  description: "Official Carltoons website featuring original artwork, funny videos, stories, entertainment and official social media accounts.",
  keywords: ["Carltoons", "Carltoons official", "Carltoons creator", "Carltoons artist", "funny drawings", "funny videos", "original artwork", "Filipino humor", "comedy", "entertainment"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", url: siteUrl, title: "Carltoons | Creator, Artist & Entertainment",
    description: "Official Carltoons website featuring original artwork, funny videos, stories and entertainment.",
    siteName: "Carltoons", locale: "en_US",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: "Carltoons", description: "Official Carltoons website." },
    { "@type": "Person", "@id": `${siteUrl}/#creator`, name: "Carltoons", url: siteUrl, jobTitle: "Creator and Artist",
      sameAs: ["https://www.facebook.com/carltoonsofficial","https://www.instagram.com/carltoonsofficial","https://www.youtube.com/@carltoonsofficial","https://www.tiktok.com/@carltoonsofficial"] }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /></head><body>{children}</body></html>;
}
