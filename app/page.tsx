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

const socials = [
  {
    name: "Facebook",
    handle: "@carltoonsofficial",
    url: "https://www.facebook.com/carltoonsofficial",
  },
  {
    name: "Instagram",
    handle: "@carltoonsofficial",
    url: "https://www.instagram.com/carltoonsofficial",
  },
  {
    name: "YouTube",
    handle: "@carltoonsofficial",
    url: "https://www.youtube.com/@carltoonsofficial",
  },
  {
    name: "TikTok",
    handle: "@carltoonsofficial",
    url: "https://www.tiktok.com/@carltoonsofficial",
  },
];

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function MediaPreview({
  item,
  large = false,
}: {
  item: ContentItem;
  large?: boolean;
}) {
  const type = String(item.mediaType || "").toLowerCase();

  if (!item.mediaUrl) {
    return (
      <div className="ct-card-placeholder">
        C
      </div>
    );
  }

  if (type === "facebook-reel") {
    return (
      <div className="ct-facebook-reel-card">
        <div className="ct-reel-symbol">f</div>
        <span>FACEBOOK REEL</span>
      </div>
    );
  }

  if (type === "video" || type.startsWith("video/")) {
    return (
      <video
        src={item.mediaUrl}
        controls={large}
        muted={!large}
        playsInline
      />
    );
  }

  return (
    <img
      src={item.mediaUrl}
      alt={item.title}
      loading={large ? "eager" : "lazy"}
    />
  );
}

export default function HomePage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch("/api/content", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load content.");
        }

        const data = await response.json();

        if (active) {
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load content."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        category === "All" ||
        String(item.category || "").toLowerCase() ===
          category.toLowerCase();

      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        String(item.category || "")
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [items, category, search]);

  const featured = items.find((item) => item.featured) || items[0];

  return (
    <main className="ct-page">
      <header className="ct-header">
        <div className="ct-container ct-header-inner">
          <a href="/" className="ct-brand">
            <span className="ct-brand-mark">C</span>
            <span className="ct-brand-name">CARLTOONS</span>
          </a>

          <nav className="ct-nav">
            <a href="#content">Content</a>
            <a href="/videos">Videos</a>
            <a href="/pages/about">About</a>
            <a href="/pages/contact">Contact</a>
            <a href="/admin" className="ct-nav-button">
              Studio
            </a>
          </nav>

          <button
            className="ct-menu"
            onClick={() =>
              document
                .getElementById("content")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            aria-label="Open content"
          >
            ☰
          </button>
        </div>
      </header>

      <section className="ct-hero">
        <div className="ct-container">
          <div className="ct-hero-content">
            <div className="ct-eyebrow">
              Official Carltoons
            </div>

            <h1>
              CREATE.
              <br />
              <span>PUBLISH.</span>
              <br />
              ENTERTAIN.
            </h1>

            <p>
              Welcome to Carltoons — a creator-driven home for
              original stories, artwork, videos, useful tips,
              rankings, how-to content and entertainment.
            </p>

            <div className="ct-hero-actions">
              <a href="#content" className="ct-btn ct-btn-primary">
                Explore Content →
              </a>

              <a href="#social" className="ct-btn ct-btn-light">
                Follow Carltoons
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="ct-section">
        <div className="ct-container">
          <div className="ct-section-head">
            <div>
              <div className="ct-eyebrow">Featured</div>
              <h2>What&apos;s happening at Carltoons</h2>
            </div>
          </div>

          {featured ? (
            <div className="ct-featured">
              <div className="ct-featured-media">
                <MediaPreview item={featured} large />
              </div>

              <div className="ct-featured-content">
                <div className="ct-eyebrow">
                  {featured.category || "Featured"}
                </div>

                <h3>{featured.title}</h3>

                <p>{featured.description}</p>

                <div>
                  <a
                    href={`/content/${featured.id}`}
                    className="ct-btn ct-btn-primary"
                  >
                    Read / Watch →
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="ct-card" style={{ padding: 35 }}>
              <strong>No featured content yet.</strong>
              <p className="ct-muted">
                Publish content from Carltoons Studio and mark
                one item as Featured.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="ct-section" id="content">
        <div className="ct-container">
          <div className="ct-section-head">
            <div>
              <div className="ct-eyebrow">Explore</div>
              <h2>Carltoons Content</h2>
            </div>

            <p>
              Browse everything published to the Carltoons
              platform.
            </p>
          </div>

          <div className="ct-toolbar">
            <div className="ct-search">
              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search Carltoons..."
                aria-label="Search Carltoons"
              />
            </div>

            <div className="ct-filters">
              {categories.map((item) => (
                <button
                  key={item}
                  className={`ct-filter ${
                    category === item ? "active" : ""
                  }`}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="ct-empty">
              Loading Carltoons content...
            </div>
          ) : error ? (
            <div className="ct-card" style={{ padding: 30 }}>
              <strong>Content could not be loaded.</strong>
              <p className="ct-muted">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="ct-card" style={{ padding: 40 }}>
              <strong>No content found.</strong>
              <p className="ct-muted">
                Try another search or category.
              </p>
            </div>
          ) : (
            <div className="ct-grid">
              {filtered.map((item) => (
                <article className="ct-card" key={item.id}>
                  <a href={`/content/${item.id}`}>
                    <div className="ct-card-media">
                      <MediaPreview item={item} />
                    </div>
                  </a>

                  <div className="ct-card-body">
                    <div className="ct-card-category">
                      {item.category || "Carltoons"}
                    </div>

                    <h3>{item.title}</h3>

                    <p>
                      {item.description.length > 150
                        ? `${item.description.slice(0, 150)}...`
                        : item.description}
                    </p>

                    <div className="ct-card-footer">
                      <span className="ct-muted">
                        {formatDate(item.createdAt)}
                      </span>

                      <a
                        href={`/content/${item.id}`}
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

      <section className="ct-section ct-section-dark" id="about">
        <div className="ct-container">
          <div className="ct-section-head">
            <div>
              <div className="ct-eyebrow">About</div>
              <h2>Built by Carltoons.</h2>
            </div>

            <p style={{ color: "#aaa" }}>
              A flexible publishing platform where you can
              create, edit, organize and publish your own
              content through Carltoons Studio.
            </p>
          </div>

          <div className="ct-grid">
            <div className="ct-card" style={{ background: "#111", color: "white", padding: 25 }}>
              <div className="ct-eyebrow">01</div>
              <h3>Original</h3>
              <p style={{ color: "#aaa" }}>
                Your own stories, ideas, artwork and creative
                projects.
              </p>
            </div>

            <div className="ct-card" style={{ background: "#111", color: "white", padding: 25 }}>
              <div className="ct-eyebrow">02</div>
              <h3>Interactive</h3>
              <p style={{ color: "#aaa" }}>
                Search, categories, videos, featured content
                and individual pages.
              </p>
            </div>

            <div className="ct-card" style={{ background: "#111", color: "white", padding: 25 }}>
              <div className="ct-eyebrow">03</div>
              <h3>Publishable</h3>
              <p style={{ color: "#aaa" }}>
                Manage your content through your private
                Carltoons Studio.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ct-section ct-section-dark" id="social">
        <div className="ct-container">
          <div className="ct-section-head">
            <div>
              <div className="ct-eyebrow">Connect</div>
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
                <span>{social.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="ct-footer">
        <div className="ct-container">
          <div className="ct-footer-grid">
            <div>
              <div className="ct-brand">
                <span className="ct-brand-mark">C</span>
                <span className="ct-brand-name">
                  CARLTOONS
                </span>
              </div>

              <p>
                Original stories, artwork, videos, tips,
                rankings and entertainment.
              </p>
            </div>

            <div>
              <h4>Explore</h4>
              <a href="#content">Content</a>
            <a href="/videos">Videos</a>
              <br />
              <a href="/pages/about">About</a>
              <br />
              <a href="/pages/contact">Contact</a>
            </div>

            <div>
              <h4>Creator</h4>
              <a href="/admin">Carltoons Studio</a>
            </div>

            <div>
              <h4>Social</h4>
              {socials.map((social) => (
                <div key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.name}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="ct-footer-bottom">
            © {new Date().getFullYear()} Carltoons. All rights
            reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}