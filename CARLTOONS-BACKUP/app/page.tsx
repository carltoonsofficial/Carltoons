"use client";

import { useEffect, useMemo, useState } from "react";

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

const categories = [
  "All",
  "Stories",
  "Tips",
  "How-To",
  "Rankings",
  "Videos",
  "Artwork",
];

export default function HomePage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch("/api/content", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load content");
        }

        const data = await response.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const categoryMatch =
        category === "All" ||
        String(item.category || "").toLowerCase() ===
          category.toLowerCase();

      const searchMatch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        String(item.category || "")
          .toLowerCase()
          .includes(query);

      return categoryMatch && searchMatch;
    });
  }, [items, category, search]);

  const featured = items.find((item) => item.featured) || items[0];

  return (
    <main className={dark ? "site dark" : "site"}>
      <header className="navbar">
        <div className="nav-inner">
          <a href="/" className="brand">
            <span className="brand-mark">C</span>
            <span>
              <strong>Carltoons</strong>
              <small>CREATE • ENTERTAIN • INSPIRE</small>
            </span>
          </a>

          <nav className="desktop-nav">
            <a href="/">Home</a>
            <a href="#stories">Stories</a>
            <a href="#tips">Tips</a>
            <a href="#videos">Videos</a>
            <a href="#about">About</a>
          </nav>

          <div className="nav-actions">
            <a href="/admin" className="studio-button">
              Studio
            </a>

            <button
              className="theme-button"
              onClick={() => setDark((value) => !value)}
              aria-label="Toggle theme"
            >
              {dark ? "☀" : "☾"}
            </button>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">WELCOME TO CARLTOONS</div>

            <h1>
              Stories.
              <br />
              Ideas.
              <br />
              <span>Entertainment.</span>
            </h1>

            <p>
              Discover original stories, creative ideas, helpful guides,
              rankings, artwork and entertainment from Carltoons.
            </p>

            <div className="hero-actions">
              <a href="#content" className="primary-button">
                Explore Carltoons
              </a>

              <a href="#about" className="secondary-button">
                Learn More
              </a>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-top">
              <span>CARLTOONS</span>
              <span>MAX</span>
            </div>

            <div className="hero-card-center">
              <div className="big-c">C</div>
              <p>Original content made to entertain.</p>
            </div>

            <div className="hero-card-bottom">
              <span>STORIES</span>
              <span>ART</span>
              <span>VIDEO</span>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-stats">
        <div>
          <strong>{items.length}</strong>
          <span>Published Content</span>
        </div>

        <div>
          <strong>
            {new Set(items.map((item) => item.category)).size}
          </strong>
          <span>Categories</span>
        </div>

        <div>
          <strong>MAX</strong>
          <span>Creator Platform</span>
        </div>
      </section>

      <section className="content-section" id="content">
        <div className="section-heading">
          <div>
            <span className="eyebrow">DISCOVER</span>
            <h2>Latest from Carltoons</h2>
          </div>

          <div className="search-box">
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Carltoons..."
            />
          </div>
        </div>

        <div className="category-row">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "category active" : "category"}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {featured && !search && category === "All" && (
          <article className="featured">
            <div className="featured-media">
              {featured.mediaUrl ? (
                featured.mediaType?.startsWith("video") ? (
                  <video
                    src={featured.mediaUrl}
                    controls
                    playsInline
                  />
                ) : (
                  <img
                    src={featured.mediaUrl}
                    alt={featured.title}
                  />
                )
              ) : (
                <div className="media-placeholder">
                  <span>CARLTOONS</span>
                  <strong>FEATURED</strong>
                </div>
              )}
            </div>

            <div className="featured-copy">
              <span className="content-label">
                {featured.category || "Featured"}
              </span>

              <h3>{featured.title}</h3>

              <p>{featured.description}</p>

              <a
                href={`/content/${featured.id}`}
                className="read-button"
              >
                Read / Watch →
              </a>
            </div>
          </article>
        )}

        <div className="content-grid">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div className="skeleton" key={index} />
            ))
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <article className="content-card" key={item.id}>
                <div className="card-media">
                  {item.mediaUrl ? (
                    item.mediaType?.startsWith("video") ? (
                      <video
                        src={item.mediaUrl}
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                      />
                    )
                  ) : (
                    <div className="card-placeholder">
                      <span>{item.category || "CARLTOONS"}</span>
                    </div>
                  )}
                </div>

                <div className="card-body">
                  <span className="content-label">
                    {item.category || "Carltoons"}
                  </span>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                  <a href={`/content/${item.id}`}>
                    Explore →
                  </a>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <div>✦</div>
              <h3>No content found</h3>
              <p>
                New Carltoons content will appear here when published.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="creator-section" id="about">
        <div>
          <span className="eyebrow">ABOUT CARLTOONS</span>

          <h2>A creative space for original content.</h2>

          <p>
            Carltoons brings together stories, artwork, videos, useful
            information and entertainment in one independent creator
            platform.
          </p>

          <a href="/admin" className="primary-button">
            Open Carltoons Studio
          </a>
        </div>

        <div className="creator-panel">
          <div className="creator-logo">C</div>

          <h3>CARLTOONS MAX</h3>

          <p>
            Create. Publish. Grow.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div>
          <strong>Carltoons</strong>
          <p>
            Original stories, creativity and entertainment.
          </p>
        </div>

        <div className="footer-links">
          <a href="/">Home</a>
          <a href="#content">Content</a>
          <a href="#about">About</a>
          <a href="/admin">Studio</a>
        </div>

        <div className="copyright">
          © {new Date().getFullYear()} Carltoons. All rights reserved.
        </div>
      </footer>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
        }

        .site {
          min-height: 100vh;
          background: #f7f7f5;
          color: #111;
          transition: 0.25s ease;
        }

        .site.dark {
          background: #0d0d0f;
          color: #f4f4f4;
        }

        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255,255,255,.88);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(0,0,0,.08);
        }

        .dark .navbar {
          background: rgba(13,13,15,.88);
          border-color: rgba(255,255,255,.08);
        }

        .nav-inner {
          max-width: 1250px;
          margin: auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
          color: inherit;
        }

        .brand-mark {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #111;
          color: #fff;
          font-size: 21px;
          font-weight: 900;
        }

        .brand strong {
          display: block;
          font-size: 18px;
        }

        .brand small {
          display: block;
          font-size: 8px;
          letter-spacing: 1.5px;
          opacity: .55;
          margin-top: 3px;
        }

        .desktop-nav {
          display: flex;
          gap: 28px;
        }

        .desktop-nav a,
        .footer-links a {
          color: inherit;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          opacity: .72;
        }

        .desktop-nav a:hover,
        .footer-links a:hover {
          opacity: 1;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .studio-button,
        .primary-button {
          background: #111;
          color: white;
          text-decoration: none;
          border-radius: 10px;
          padding: 12px 18px;
          font-weight: 700;
          font-size: 13px;
        }

        .dark .studio-button,
        .dark .primary-button {
          background: white;
          color: #111;
        }

        .theme-button {
          width: 42px;
          height: 42px;
          border: 1px solid rgba(0,0,0,.1);
          border-radius: 10px;
          background: transparent;
          cursor: pointer;
          font-size: 17px;
        }

        .dark .theme-button {
          color: white;
          border-color: rgba(255,255,255,.12);
        }

        .hero {
          padding: 85px 24px 70px;
          background:
            radial-gradient(circle at 75% 25%, rgba(255,190,70,.28), transparent 28%),
            radial-gradient(circle at 20% 20%, rgba(100,120,255,.12), transparent 30%);
        }

        .hero-inner {
          max-width: 1250px;
          margin: auto;
          display: grid;
          grid-template-columns: 1.15fr .85fr;
          gap: 70px;
          align-items: center;
        }

        .eyebrow {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 2px;
          opacity: .55;
        }

        .hero h1 {
          margin: 16px 0;
          font-size: clamp(52px, 8vw, 100px);
          line-height: .9;
          letter-spacing: -5px;
        }

        .hero h1 span {
          opacity: .45;
        }

        .hero-copy p {
          max-width: 600px;
          font-size: 18px;
          line-height: 1.7;
          opacity: .68;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          margin-top: 30px;
        }

        .secondary-button {
          border: 1px solid rgba(0,0,0,.15);
          border-radius: 10px;
          padding: 12px 18px;
          text-decoration: none;
          color: inherit;
          font-weight: 700;
          font-size: 13px;
        }

        .dark .secondary-button {
          border-color: rgba(255,255,255,.15);
        }

        .hero-card {
          min-height: 460px;
          border-radius: 28px;
          background: #111;
          color: white;
          padding: 25px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 30px 80px rgba(0,0,0,.18);
        }

        .hero-card-top,
        .hero-card-bottom {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          letter-spacing: 2px;
          opacity: .55;
        }

        .hero-card-center {
          text-align: center;
        }

        .big-c {
          font-size: 180px;
          line-height: .8;
          font-weight: 900;
          letter-spacing: -15px;
        }

        .hero-card-center p {
          opacity: .65;
        }

        .quick-stats {
          max-width: 1250px;
          margin: auto;
          padding: 30px 24px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid rgba(0,0,0,.08);
          border-bottom: 1px solid rgba(0,0,0,.08);
        }

        .dark .quick-stats {
          border-color: rgba(255,255,255,.08);
        }

        .quick-stats div {
          text-align: center;
        }

        .quick-stats strong {
          display: block;
          font-size: 28px;
        }

        .quick-stats span {
          font-size: 11px;
          opacity: .55;
        }

        .content-section,
        .creator-section {
          max-width: 1250px;
          margin: auto;
          padding: 90px 24px;
        }

        .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 30px;
        }

        .section-heading h2,
        .creator-section h2 {
          margin: 10px 0 0;
          font-size: clamp(32px, 5vw, 55px);
          letter-spacing: -2px;
        }

        .search-box {
          width: 300px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(0,0,0,.12);
          border-radius: 12px;
          padding: 12px 14px;
          background: white;
        }

        .dark .search-box {
          background: #161619;
          border-color: rgba(255,255,255,.12);
        }

        .search-box input {
          border: 0;
          outline: 0;
          background: transparent;
          color: inherit;
          width: 100%;
        }

        .category-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 30px 0;
        }

        .category {
          border: 1px solid rgba(0,0,0,.1);
          background: transparent;
          border-radius: 999px;
          padding: 9px 15px;
          cursor: pointer;
          color: inherit;
        }

        .category.active {
          background: #111;
          color: white;
        }

        .dark .category {
          border-color: rgba(255,255,255,.12);
        }

        .dark .category.active {
          background: white;
          color: #111;
        }

        .featured {
          display: grid;
          grid-template-columns: 1.1fr .9fr;
          background: white;
          border-radius: 25px;
          overflow: hidden;
          margin-bottom: 35px;
        }

        .dark .featured {
          background: #161619;
        }

        .featured-media {
          min-height: 390px;
        }

        .featured-media img,
        .featured-media video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .media-placeholder,
        .card-placeholder {
          width: 100%;
          height: 100%;
          min-height: 240px;
          background: linear-gradient(135deg, #151515, #454545);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .media-placeholder strong {
          font-size: 50px;
        }

        .featured-copy {
          padding: 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .content-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 900;
          opacity: .5;
        }

        .featured-copy h3 {
          font-size: 42px;
          line-height: 1;
          margin: 15px 0;
        }

        .featured-copy p,
        .card-body p,
        .creator-section p {
          line-height: 1.7;
          opacity: .65;
        }

        .read-button {
          color: inherit;
          text-decoration: none;
          font-weight: 800;
          margin-top: 20px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .content-card {
          background: white;
          border-radius: 18px;
          overflow: hidden;
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .dark .content-card {
          background: #161619;
        }

        .content-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(0,0,0,.1);
        }

        .card-media {
          aspect-ratio: 16 / 10;
          overflow: hidden;
        }

        .card-media img,
        .card-media video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-body {
          padding: 22px;
        }

        .card-body h3 {
          margin: 8px 0;
          font-size: 21px;
        }

        .card-body a {
          color: inherit;
          font-weight: 800;
          text-decoration: none;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 20px;
          border: 1px dashed rgba(0,0,0,.15);
          border-radius: 20px;
        }

        .dark .empty-state {
          border-color: rgba(255,255,255,.15);
        }

        .empty-state div {
          font-size: 40px;
        }

        .skeleton {
          height: 380px;
          border-radius: 18px;
          background: linear-gradient(
            90deg,
            rgba(0,0,0,.06),
            rgba(0,0,0,.12),
            rgba(0,0,0,.06)
          );
        }

        .creator-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .creator-section p {
          max-width: 600px;
          font-size: 17px;
          margin: 25px 0;
        }

        .creator-panel {
          min-height: 350px;
          border-radius: 25px;
          background: #111;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .creator-logo {
          font-size: 130px;
          line-height: 1;
          font-weight: 900;
        }

        .creator-panel h3 {
          letter-spacing: 4px;
        }

        .creator-panel p {
          margin: 0;
          opacity: .55;
        }

        .footer {
          background: #111;
          color: white;
          padding: 50px max(24px, calc((100vw - 1250px) / 2));
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 30px;
        }

        .footer p {
          opacity: .5;
          font-size: 13px;
        }

        .footer-links {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .copyright {
          grid-column: 1 / -1;
          border-top: 1px solid rgba(255,255,255,.1);
          padding-top: 20px;
          font-size: 11px;
          opacity: .45;
        }

        @media (max-width: 850px) {
          .desktop-nav {
            display: none;
          }

          .hero-inner,
          .featured,
          .creator-section {
            grid-template-columns: 1fr;
          }

          .content-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .section-heading {
            align-items: stretch;
            flex-direction: column;
          }

          .search-box {
            width: 100%;
          }
        }

        @media (max-width: 600px) {
          .hero {
            padding-top: 55px;
          }

          .hero h1 {
            letter-spacing: -3px;
          }

          .hero-card {
            min-height: 330px;
          }

          .big-c {
            font-size: 120px;
          }

          .quick-stats {
            grid-template-columns: 1fr;
            gap: 25px;
          }

          .content-grid {
            grid-template-columns: 1fr;
          }

          .featured-copy {
            padding: 30px;
          }

          .featured-copy h3 {
            font-size: 32px;
          }

          .creator-section {
            padding-top: 50px;
            padding-bottom: 50px;
          }

          .footer {
            grid-template-columns: 1fr;
          }

          .footer-links {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </main>
  );
}