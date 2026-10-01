"use client";

import { useEffect, useState } from "react";

type Reel = {
  id: string;
  title: string;
  description: string;
  category?: string;
  mediaUrl?: string;
  mediaType?: string;
  createdAt: string;
};

function reelEmbed(url: string) {
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=500`;
}

export default function ReelPage() {
  const [item, setItem] = useState<Reel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = window.location.pathname.split("/").pop();
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const found = Array.isArray(data)
          ? data.find((x: Reel) => x.id === id && x.mediaType === "facebook-reel")
          : null;
        setItem(found || null);
        if (found) document.title = `${found.title} | Carltoons`;
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main className="ct-page"><section className="ct-detail"><div className="ct-container"><h1>Loading...</h1></div></section></main>;

  if (!item) {
    return (
      <main className="ct-page">
        <header className="ct-header"><div className="ct-container ct-header-inner">
          <a href="/" className="ct-brand"><span className="ct-brand-mark">C</span><span className="ct-brand-name">CARLTOONS</span></a>
        </div></header>
        <section className="ct-detail"><div className="ct-container">
          <div className="ct-eyebrow">404</div><h1>Reel not found.</h1>
          <a href="/videos" className="ct-btn ct-btn-primary">← Back to Videos</a>
        </div></section>
      </main>
    );
  }

  return (
    <main className="ct-page">
      <header className="ct-header">
        <div className="ct-container ct-header-inner">
          <a href="/" className="ct-brand"><span className="ct-brand-mark">C</span><span className="ct-brand-name">CARLTOONS</span></a>
          <nav className="ct-nav"><a href="/">Home</a><a href="/videos">Videos</a><a href="/admin" className="ct-nav-button">Studio</a></nav>
        </div>
      </header>

      <article className="ct-detail">
        <div className="ct-container">
          <div className="ct-detail-header">
            <div className="ct-eyebrow">Facebook Reel</div>
            <h1>{item.title}</h1>
            <div className="ct-detail-date">
              Published {new Date(item.createdAt).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" })}
            </div>
          </div>

          <div className="ct-reel-frame">
            <iframe
              src={reelEmbed(item.mediaUrl || "")}
              title={item.title}
              scrolling="no"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <div className="ct-detail-description">{item.description}</div>

          <div className="ct-detail-actions">
            <a href={item.mediaUrl} target="_blank" rel="noopener noreferrer" className="ct-btn ct-btn-primary">Open on Facebook ↗</a>
            <a href="/videos" className="ct-btn ct-btn-dark">← All Videos</a>
          </div>
        </div>
      </article>
    </main>
  );
}
