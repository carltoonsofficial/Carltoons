"use client";

import { useEffect, useMemo, useState } from "react";

type Reel = {
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
};

function date(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function VideosPage() {
  const [items, setItems] = useState<Reel[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const reels = Array.isArray(data)
          ? data.filter((x: Reel) =>
              x.category === "Videos" && x.mediaType === "facebook-reel"
            )
          : [];
        setItems(reels.sort((a, b) => a.order - b.order));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) =>
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <main className="ct-page">
      <header className="ct-header">
        <div className="ct-container ct-header-inner">
          <a href="/" className="ct-brand">
            <span className="ct-brand-mark">C</span>
            <span className="ct-brand-name">CARLTOONS</span>
          </a>
          <nav className="ct-nav">
            <a href="/">Home</a>
            <a href="/videos" className="active">Videos</a>
            <a href="/#about">About</a>
            <a href="/#social">Social</a>
            <a href="/admin" className="ct-nav-button">Studio</a>
          </nav>
        </div>
      </header>

      <section className="ct-section">
        <div className="ct-container">
          <div className="ct-section-head">
            <div>
              <div className="ct-eyebrow">Facebook Reels</div>
              <h1>Carltoons Videos</h1>
            </div>
            <p>Browse the published Carltoons Reel library.</p>
          </div>

          <div className="ct-toolbar">
            <div className="ct-search">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Carltoons Reels..."
                aria-label="Search Carltoons Reels"
              />
            </div>
          </div>

          {loading ? (
            <div className="ct-empty">Loading Reels...</div>
          ) : filtered.length === 0 ? (
            <div className="ct-card" style={{ padding: 40 }}>
              <strong>No published Reels found.</strong>
              <p className="ct-muted">Add or publish Reels from Carltoons Studio.</p>
            </div>
          ) : (
            <div className="ct-grid">
              {filtered.map((item) => (
                <article className="ct-card" key={item.id}>
                  <div className="ct-card-media ct-facebook-reel-card">
                    <div className="ct-reel-symbol">f</div>
                    <span>FACEBOOK REEL</span>
                  </div>
                  <div className="ct-card-body">
                    <div className="ct-card-category">Videos</div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="ct-card-footer">
                      <span className="ct-muted">{date(item.createdAt)}</span>
                      <a
                        href={`/videos/${item.id}`}
                        className="ct-btn ct-btn-primary ct-btn-small"
                      >
                        Open
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="ct-footer">
        <div className="ct-container">
          <div className="ct-footer-bottom">
            © {new Date().getFullYear()} Carltoons. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
