import type { Metadata } from "next";
import "./globals.css";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://carltoons-nine.vercel.app/#website",
      url: "https://carltoons-nine.vercel.app/",
      name: "Carltoons",
      description:
        "Official Carltoons website featuring original artwork, funny videos, stories, entertainment and official social media accounts.",
      publisher: {
        "@id": "https://carltoons-nine.vercel.app/#creator",
      },
    },
    {
      "@type": "Person",
      "@id": "https://carltoons-nine.vercel.app/#creator",
      name: "Carltoons",
      url: "https://carltoons-nine.vercel.app/",
      jobTitle: "Creator and Artist",
      description:
        "Carltoons is a creator and artist producing original artwork, funny videos, stories, and entertainment content.",
      sameAs: [
        "https://www.facebook.com/carltoonsofficial",
        "https://www.instagram.com/carltoonsofficial",
        "https://www.youtube.com/@carltoonsofficial",
        "https://www.tiktok.com/@carltoonsofficial",
      ],
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://carltoons-nine.vercel.app"),

  title: {
    default: "Carltoons | Creator, Artist & Entertainment",
    template: "%s | Carltoons",
  },

  description:
    "Official Carltoons website featuring original artwork, funny videos, stories, entertainment and official social media accounts.",

  keywords: [
    "Carltoons",
    "Carltoons official",
    "Carltoons creator",
    "Carltoons artist",
    "Carltoons entertainment",
    "funny drawings",
    "funny videos",
    "original artwork",
    "Filipino humor",
    "comedy",
    "entertainment",
  ],

  authors: [
    {
      name: "Carltoons",
      url: "https://carltoons-nine.vercel.app/",
    },
  ],

  creator: "Carltoons",
  publisher: "Carltoons",

  alternates: {
    canonical: "https://carltoons-nine.vercel.app/",
  },

  openGraph: {
    type: "website",
    url: "https://carltoons-nine.vercel.app/",
    title: "Carltoons | Creator, Artist & Entertainment",
    description:
      "Official Carltoons website featuring original artwork, funny videos, stories, entertainment and official social media accounts.",
    siteName: "Carltoons",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Carltoons | Creator, Artist & Entertainment",
    description:
      "Official Carltoons website featuring original artwork, funny videos, stories and entertainment.",
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

      <body>{children}</body>
    </html>
  );
}