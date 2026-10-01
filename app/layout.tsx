import type { Metadata } from "next";
import "./globals.css";
import AdSenseLoader from "./AdSense";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://carltoons-nine.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Carltoons | Creator, Stories, Tips & Entertainment",
    template: "%s | Carltoons",
  },

  description:
    "Carltoons — original stories, artwork, funny videos, tips, rankings, how-to content and entertainment.",

  keywords: [
    "Carltoons",
    "Carltoons official",
    "stories",
    "tips",
    "how to",
    "rankings",
    "funny videos",
    "artwork",
    "entertainment",
    "Filipino creator",
  ],

  authors: [
    {
      name: "Carltoons",
      url: SITE_URL,
    },
  ],

  creator: "Carltoons",
  publisher: "Carltoons",

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Carltoons",
    title: "Carltoons | Creator, Stories, Tips & Entertainment",
    description:
      "Original stories, artwork, funny videos, tips, rankings, how-to content and entertainment.",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Carltoons",
    description:
      "Original stories, artwork, funny videos, tips, rankings, how-to content and entertainment.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Carltoons",
  url: SITE_URL,
  description:
    "Carltoons creator website featuring stories, tips, artwork, videos, rankings and entertainment.",
  sameAs: [
    "https://www.facebook.com/carltoonsofficial",
    "https://www.instagram.com/carltoonsofficial",
    "https://www.youtube.com/@carltoonsofficial",
    "https://www.tiktok.com/@carltoonsofficial",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>

      <body><AdSenseLoader />{children}</body>
    </html>
  );
}