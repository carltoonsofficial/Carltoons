"use client";

import { useEffect, useState } from "react";

type ContentItem = {
  id: string;
  title: string;
  description: string;
  category?: string;
  mediaUrl?: string;
  mediaType?: string;
  published: boolean;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

const socials = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/carltoonsofficial",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/carltoonsofficial",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@carltoonsofficial",
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@carltoonsofficial",
  },
];

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function getId() {
  if (typeof window === "undefined") {
    return "";
  }

  const parts = window.location.pathname.split("/");

  return parts[parts.length - 1] || "";
}

export default function ContentPage() {
  const [item, setItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const id = getId();

        const response = await fetch("/api/content", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();

        const found = Array.isArray(data)
          ? data.find((entry: ContentItem) => entry.id === id)
          : null;

        if (!found) {
          setNotFound(true);
        } else {
          setItem(found);

          document.title = `${found.title} | Carltoons`;
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <main className="ct-page">
        <div className="ct-container ct-detail">
          <div className="ct-eyebrow">
            Carltoons
          </div>

          <h1>Loading...</h1>
        </div>
      </main>
    );
  }

  if (notFound || !item) {
    return (
      <main className="ct-page">
        <header className="ct-header">
          <div className="ct-container ct-header-inner">
            <a href="/" className="ct-brand">
              <span className="ct-brand-mark">C</span>
              <span className="ct-brand-name">
                CARLTOONS
              </span>
            </a>
          </div>
        </header>

        <section className="ct-detail">
          <div className="ct-container">
            <div className="ct-eyebrow">404</div>

            <h1>Content not found.</h1>

            <p className="ct-muted">
              This content may have been removed or is no
              longer published.
            </p>

            <a
              href="/"
              className="ct-btn ct-btn-primary"
              style={{ marginTop: 20 }}
            >
              ← Back to Carltoons
            </a>
          </div>
        </section>
      </main>
    );
  }

  const type = String(item.mediaType || "").toLowerCase();
  const isVideo = type === "video" || type.startsWith("video/");
  const isFacebookReel = type === "facebook-reel";

  return (
    <main className="ct-page">
      <header className="ct-header">
        <div className="ct-container ct-header-inner">
          <a href="/" className="ct-brand">
            <span className="ct-brand-mark">C</span>
            <span className="ct-brand-name">
              CARLTOONS
            </span>
          </a>

          <nav className="ct-nav">
            <a href="/">Home</a>
            <a href="/#content">Content</a>
            <a href="/#about">About</a>
            <a href="/admin" className="ct-nav-button">
              Studio
            </a>
          </nav>
        </div>
      </header>

      <article className="ct-detail">
        <div className="ct-container">
          <header className="ct-detail-header">
            <div className="ct-eyebrow">
              {item.category || "Carltoons"}
            </div>

            <h1>{item.title}</h1>

            <div className="ct-detail-date">
              Published {formatDate(item.createdAt)}
            </div>
          </header>

          {item.mediaUrl && (
            isFacebookReel ? (
              <div className="ct-reel-frame">
                <iframe
                  src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(item.mediaUrl)}&show_text=false&width=500`}
                  title={item.title}
                  scrolling="no"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="ct-detail-media">
                {isVideo ? (
                  <video src={item.mediaUrl} controls playsInline preload="metadata" />
                ) : (
                  <img src={item.mediaUrl} alt={item.title} />
                )}
              </div>
            )
          )}

          <div className="ct-detail-description">
            {item.description}
          </div>

          <div
            style={{
              maxWidth: 800,
              margin: "45px auto 0",
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <a
              href="/"
              className="ct-btn ct-btn-dark"
            >
              ← Back to Carltoons
            </a>

            <a
              href="/#content"
              className="ct-btn ct-btn-primary"
            >
              Explore More
            </a>
          </div>
        </div>
      </article>

      <section className="ct-section ct-section-dark">
        <div className="ct-container">
          <div className="ct-section-head">
            <div>
              <div className="ct-eyebrow">
                Connect
              </div>

              <h2>Follow Carltoons</h2>
            </div>
          </div>

          <div className="ct-social-grid">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ct-social"
              >
                <strong>{social.name}</strong>
                <span>Follow Carltoons</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="ct-footer">
        <div className="ct-container">
          <div className="ct-footer-bottom">
            © {new Date().getFullYear()} Carltoons. All rights
            reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}