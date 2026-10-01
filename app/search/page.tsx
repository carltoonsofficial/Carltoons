"use client";

import { useEffect, useMemo, useState } from "react";

type ContentItem = {
  id: string; title: string; description: string; category?: string;
  mediaType?: string; published: boolean; createdAt: string;
};

export default function SearchPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []));
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((x) =>
      `${x.title} ${x.description} ${x.category || ""}`.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <main className="ct-page">
      <header className="ct-header">
        <div className="ct-container ct-header-inner">
          <a href="/" className="ct-brand"><span className="ct-brand-mark">C</span><span className="ct-brand-name">CARLTOONS</span></a>
          <nav className="ct-nav"><a href="/">Home</a><a href="/videos">Videos</a><a href="/admin" className="ct-nav-button">Studio</a></nav>
        </div>
      </header>
      <section className="ct-section">
        <div className="ct-container">
          <div className="ct-eyebrow">Library Search</div>
          <h1>Search Carltoons</h1>
          <div className="ct-toolbar">
            <div className="ct-search" style={{ width: "100%" }}>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search all published Carltoons content..." autoFocus />
            </div>
          </div>
          <div className="ct-grid">
            {results.map((item) => (
              <article className="ct-card" key={item.id}>
                <div className="ct-card-body">
                  <div className="ct-card-category">{item.category || "Carltoons"}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="ct-card-footer">
                    <span className="ct-muted">{new Date(item.createdAt).toLocaleDateString()}</span>
                    <a href={`/content/${item.id}`} className="ct-btn ct-btn-primary ct-btn-small">Open</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!results.length && <div className="ct-empty">No published content matches your search.</div>}
        </div>
      </section>
    </main>
  );
}
