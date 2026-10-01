from pathlib import Path
import zipfile, textwrap, os, json

root = Path("/mnt/data/carltoons-premium")
if root.exists():
    import shutil
    shutil.rmtree(root)

files = {}

files["app/globals.css"] = r'''@import "tailwindcss";

:root {
  --orange: #ff6a00;
  --orange-dark: #e65100;
  --orange-soft: #fff1e8;
  --black: #080808;
  --black-2: #111111;
  --white: #ffffff;
  --gray-50: #f7f7f7;
  --gray-100: #eeeeee;
  --gray-500: #737373;
  --gray-700: #3d3d3d;
  --border: #e7e7e7;
  --shadow: 0 12px 40px rgba(0,0,0,.08);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--white);
  color: var(--black);
  font-family: Arial, Helvetica, sans-serif;
}
a { color: inherit; text-decoration: none; }
button, input, textarea, select { font: inherit; }

.ct-container { width: min(1180px, calc(100% - 32px)); margin: 0 auto; }
.ct-header {
  position: sticky; top: 0; z-index: 50;
  background: rgba(8,8,8,.96); color: white;
  border-bottom: 3px solid var(--orange);
  backdrop-filter: blur(12px);
}
.ct-nav { min-height: 74px; display:flex; align-items:center; justify-content:space-between; gap:24px; }
.ct-brand { display:flex; align-items:center; gap:10px; font-weight:900; letter-spacing:-1px; font-size:25px; }
.ct-logo { width:38px; height:38px; border-radius:10px; display:grid; place-items:center; background:var(--orange); color:#fff; font-weight:900; }
.ct-navlinks { display:flex; align-items:center; gap:22px; font-size:14px; font-weight:700; }
.ct-navlinks a:hover { color:var(--orange); }
.ct-nav-actions { display:flex; align-items:center; gap:10px; }
.ct-btn {
  border:0; border-radius:10px; padding:11px 17px; cursor:pointer; font-weight:800;
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
}
.ct-btn-orange { background:var(--orange); color:#fff; }
.ct-btn-orange:hover { background:var(--orange-dark); }
.ct-btn-dark { background:var(--black); color:#fff; }
.ct-btn-white { background:#fff; color:#111; }
.ct-btn-outline { background:transparent; color:inherit; border:1px solid currentColor; }

.ct-hero {
  background: radial-gradient(circle at 80% 20%, #ff8a3d 0, var(--orange) 25%, var(--black) 70%);
  color:#fff; padding:90px 0 82px; overflow:hidden;
}
.ct-hero-grid { display:grid; grid-template-columns:1.15fr .85fr; gap:55px; align-items:center; }
.ct-kicker { color:#ffb37c; font-size:13px; font-weight:900; letter-spacing:2px; text-transform:uppercase; }
.ct-hero h1 { font-size:clamp(46px,7vw,82px); line-height:.94; margin:14px 0 22px; letter-spacing:-4px; }
.ct-hero h1 span { color:#ff9a52; }
.ct-hero p { color:#eee; font-size:19px; line-height:1.65; max-width:650px; }
.ct-hero-actions { display:flex; gap:12px; flex-wrap:wrap; margin-top:30px; }
.ct-hero-card {
  min-height:360px; border-radius:26px; background:#fff; color:#111; padding:26px;
  box-shadow:0 25px 70px rgba(0,0,0,.3); transform:rotate(2deg);
}
.ct-hero-card-inner { height:100%; min-height:308px; border-radius:20px; background:linear-gradient(145deg,#ff6a00,#111); display:flex; flex-direction:column; justify-content:end; padding:25px; color:white; }
.ct-hero-card-inner strong { font-size:34px; }

.ct-section { padding:70px 0; }
.ct-section-head { display:flex; justify-content:space-between; align-items:end; gap:20px; margin-bottom:28px; }
.ct-section-head h2 { margin:0; font-size:34px; letter-spacing:-1.5px; }
.ct-muted { color:var(--gray-500); }
.ct-categories { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:28px; }
.ct-pill { padding:9px 14px; border:1px solid var(--border); border-radius:999px; background:#fff; font-weight:800; font-size:13px; }
.ct-pill:hover, .ct-pill.active { background:var(--orange); color:#fff; border-color:var(--orange); }

.ct-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
.ct-card { border:1px solid var(--border); border-radius:18px; overflow:hidden; background:#fff; box-shadow:0 8px 25px rgba(0,0,0,.04); transition:.2s; }
.ct-card:hover { transform:translateY(-4px); box-shadow:var(--shadow); }
.ct-media { aspect-ratio:16/10; background:linear-gradient(135deg,#111,#ff6a00); overflow:hidden; }
.ct-media img, .ct-media video { width:100%; height:100%; object-fit:cover; display:block; }
.ct-card-body { padding:18px; }
.ct-card-meta { font-size:11px; font-weight:900; text-transform:uppercase; color:var(--orange-dark); letter-spacing:1px; }
.ct-card h3 { margin:8px 0; font-size:21px; }
.ct-card p { margin:0; color:var(--gray-500); line-height:1.55; }
.ct-card-footer { display:flex; justify-content:space-between; align-items:center; margin-top:18px; }
.ct-link { color:var(--orange-dark); font-weight:900; }

.ct-ad { margin:10px 0; min-height:110px; border:1px dashed #cfcfcf; background:#fafafa; display:grid; place-items:center; color:#999; font-size:12px; letter-spacing:1px; text-transform:uppercase; }

.ct-footer { background:var(--black); color:#fff; padding:55px 0 30px; border-top:4px solid var(--orange); }
.ct-footer-grid { display:grid; grid-template-columns:1.5fr 1fr 1fr 1fr; gap:40px; }
.ct-footer h4 { color:#ff914d; margin-top:0; }
.ct-footer a { color:#ddd; display:block; margin:10px 0; }
.ct-footer a:hover { color:#fff; }
.ct-copyright { border-top:1px solid #292929; margin-top:40px; padding-top:22px; color:#999; font-size:13px; }

.ct-search { display:flex; gap:10px; max-width:600px; }
.ct-input { width:100%; border:1px solid var(--border); border-radius:10px; padding:12px 14px; outline:none; }
.ct-input:focus { border-color:var(--orange); box-shadow:0 0 0 3px var(--orange-soft); }

.ct-admin { min-height:100vh; background:#f5f5f5; }
.ct-admin-top { background:#080808; color:#fff; border-bottom:3px solid var(--orange); }
.ct-admin-layout { display:grid; grid-template-columns:235px 1fr; min-height:calc(100vh - 74px); }
.ct-sidebar { background:#111; color:#fff; padding:22px 14px; }
.ct-sidebar a, .ct-sidebar button { width:100%; text-align:left; display:block; padding:12px 14px; border:0; background:transparent; color:#ddd; border-radius:9px; margin:3px 0; cursor:pointer; }
.ct-sidebar a:hover, .ct-sidebar button:hover { background:#242424; color:#fff; }
.ct-sidebar .active { background:var(--orange); color:#fff; }
.ct-admin-main { padding:32px; }
.ct-stat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin:20px 0 28px; }
.ct-stat { background:#fff; border:1px solid var(--border); border-radius:15px; padding:20px; }
.ct-stat small { color:#777; font-weight:700; }
.ct-stat strong { display:block; font-size:32px; margin-top:6px; }
.ct-panel { background:#fff; border:1px solid var(--border); border-radius:16px; padding:22px; margin-bottom:20px; }
.ct-panel h2 { margin-top:0; }
.ct-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.ct-field { display:flex; flex-direction:column; gap:7px; }
.ct-field.full { grid-column:1/-1; }
.ct-field label { font-size:12px; font-weight:900; text-transform:uppercase; color:#555; }
.ct-field input, .ct-field textarea, .ct-field select { border:1px solid #ddd; border-radius:9px; padding:11px 12px; background:#fff; }
.ct-field textarea { min-height:140px; resize:vertical; }
.ct-table-wrap { overflow:auto; }
.ct-table { width:100%; border-collapse:collapse; min-width:720px; }
.ct-table th, .ct-table td { padding:13px 10px; border-bottom:1px solid #eee; text-align:left; }
.ct-table th { font-size:11px; text-transform:uppercase; color:#777; }
.ct-badge { display:inline-block; padding:5px 9px; border-radius:999px; font-size:11px; font-weight:900; }
.ct-badge-green { background:#e7f8ec; color:#167536; }
.ct-badge-gray { background:#eee; color:#555; }
.ct-actions { display:flex; gap:7px; flex-wrap:wrap; }
.ct-error { background:#fff0f0; color:#a00; border:1px solid #f0caca; padding:12px; border-radius:9px; margin-bottom:15px; }
.ct-success { background:#ecfff2; color:#176b32; border:1px solid #c8efd4; padding:12px; border-radius:9px; margin-bottom:15px; }

@media (max-width: 900px) {
  .ct-navlinks { display:none; }
  .ct-hero-grid, .ct-footer-grid { grid-template-columns:1fr; }
  .ct-grid { grid-template-columns:repeat(2,1fr); }
  .ct-stat-grid { grid-template-columns:repeat(2,1fr); }
  .ct-admin-layout { grid-template-columns:1fr; }
  .ct-sidebar { display:flex; overflow:auto; gap:5px; }
  .ct-sidebar a, .ct-sidebar button { min-width:max-content; width:auto; }
}
@media (max-width: 600px) {
  .ct-container { width:min(100% - 22px, 1180px); }
  .ct-hero { padding:62px 0; }
  .ct-hero h1 { letter-spacing:-2px; }
  .ct-grid, .ct-form-grid, .ct-stat-grid { grid-template-columns:1fr; }
  .ct-admin-main { padding:18px; }
  .ct-nav-actions .ct-btn-outline { display:none; }
}
'''

files["app/layout.tsx"] = r'''import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://carltoons-nine.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Carltoons | Stories, Videos, Artwork & Entertainment",
    template: "%s | Carltoons",
  },
  description:
    "Carltoons — original stories, funny videos, artwork, tips, how-to content and entertainment.",
  keywords: [
    "Carltoons", "stories", "funny videos", "artwork", "tips",
    "how to", "entertainment", "creator", "Filipino creator"
  ],
  authors: [{ name: "Carltoons", url: siteUrl }],
  creator: "Carltoons",
  publisher: "Carltoons",
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Carltoons | Stories, Videos, Artwork & Entertainment",
    description:
      "Original stories, videos, artwork, tips and entertainment from Carltoons.",
    siteName: "Carltoons",
    locale: "en_US",
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
  url: siteUrl,
  description:
    "Original stories, videos, artwork, tips and entertainment from Carltoons.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
'''

files["app/page.tsx"] = r''' "use client";

import { useEffect, useMemo, useState } from "react";

type Item = {
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

const categories = ["All", "Stories", "Videos", "Artwork", "Tips", "How-To"];

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.ok ? r.json() : [])
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const categoryMatch =
        category === "All" ||
        String(item.category || "").toLowerCase() === category.toLowerCase();
      const q = query.trim().toLowerCase();
      const queryMatch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return categoryMatch && queryMatch;
    });
  }, [items, category, query]);

  const featured = filtered.find((x) => x.featured) || filtered[0];

  return (
    <main>
      <header className="ct-header">
        <div className="ct-container ct-nav">
          <a href="/" className="ct-brand">
            <span className="ct-logo">C</span>
            <span>CARLTOONS</span>
          </a>

          <nav className="ct-navlinks">
            <a href="#latest">Latest</a>
            <a href="#stories">Stories</a>
            <a href="#videos">Videos</a>
            <a href="#artwork">Artwork</a>
            <a href="#tips">Tips</a>
            <a href="#howto">How-To</a>
          </nav>

          <div className="ct-nav-actions">
            <a className="ct-btn ct-btn-outline" href="/admin">Studio</a>
          </div>
        </div>
      </header>

      <section className="ct-hero">
        <div className="ct-container ct-hero-grid">
          <div>
            <div className="ct-kicker">Official Carltoons</div>
            <h1>Create.<br /><span>Entertain.</span><br />Inspire.</h1>
            <p>
              Welcome to Carltoons — a growing home for original stories,
              funny videos, artwork, useful tips, how-to content and entertainment.
            </p>
            <div className="ct-hero-actions">
              <a href="#latest" className="ct-btn ct-btn-orange">Explore Content →</a>
              <a href="#search" className="ct-btn ct-btn-white">Search Carltoons</a>
            </div>
          </div>

          <div className="ct-hero-card">
            <div className="ct-hero-card-inner">
              <div className="ct-kicker">Featured</div>
              <strong>{featured?.title || "Your next great story"}</strong>
              <p>{featured?.description || "Create your first publication from Carltoons Studio."}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="search" className="ct-section">
        <div className="ct-container">
          <div className="ct-section-head">
            <div>
              <h2>Explore Carltoons</h2>
              <div className="ct-muted">Find stories, videos, artwork and useful content.</div>
            </div>
          </div>

          <div className="ct-search">
            <input
              className="ct-input"
              placeholder="Search Carltoons..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="ct-btn ct-btn-orange" onClick={() => setQuery(query.trim())}>
              Search
            </button>
          </div>

          <div className="ct-categories" style={{ marginTop: 22 }}>
            {categories.map((c) => (
              <button
                key={c}
                className={`ct-pill ${category === c ? "active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="ct-container">
        <div className="ct-ad">Advertisement</div>
      </div>

      <section id="latest" className="ct-section">
        <div className="ct-container">
          <div className="ct-section-head">
            <div>
              <h2>Latest Content</h2>
              <div className="ct-muted">{filtered.length} published item{filtered.length === 1 ? "" : "s"}</div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="ct-panel">
              <h2>No published content yet.</h2>
              <p className="ct-muted">
                Open <a className="ct-link" href="/admin">Carltoons Studio</a> and publish your first item.
              </p>
            </div>
          ) : (
            <div className="ct-grid">
              {filtered.map((item) => (
                <article className="ct-card" key={item.id}>
                  <div className="ct-media">
                    {item.mediaUrl && item.mediaType?.startsWith("video") ? (
                      <video src={item.mediaUrl} controls preload="metadata" />
                    ) : item.mediaUrl ? (
                      <img src={item.mediaUrl} alt={item.title} />
                    ) : null}
                  </div>
                  <div className="ct-card-body">
                    <div className="ct-card-meta">{item.category || "Carltoons"}</div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="ct-card-footer">
                      <span className="ct-muted">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span className="ct-link">Read / Watch →</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="ct-container"><div className="ct-ad">Advertisement</div></div>

      <footer className="ct-footer">
        <div className="ct-container">
          <div className="ct-footer-grid">
            <div>
              <div className="ct-brand"><span className="ct-logo">C</span> CARLTOONS</div>
              <p className="ct-muted" style={{ color: "#aaa", lineHeight: 1.7 }}>
                Original stories, entertainment, artwork, videos, tips and more.
              </p>
            </div>
            <div>
              <h4>Explore</h4>
              <a href="#latest">Latest</a>
              <a href="#stories">Stories</a>
              <a href="#videos">Videos</a>
            </div>
            <div>
              <h4>Categories</h4>
              <a href="#artwork">Artwork</a>
              <a href="#tips">Tips</a>
              <a href="#howto">How-To</a>
            </div>
            <div>
              <h4>Creator</h4>
              <a href="/admin">Carltoons Studio</a>
              <a href="https://www.facebook.com/carltoonsofficial">Facebook</a>
              <a href="https://www.instagram.com/carltoonsofficial">Instagram</a>
            </div>
          </div>
          <div className="ct-copyright">
            © {new Date().getFullYear()} Carltoons. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
'''

files["app/admin/page.tsx"] = r''' "use client";

import { FormEvent, useEffect, useState } from "react";

type Item = {
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

const emptyForm = {
  id: "",
  title: "",
  description: "",
  category: "Stories",
  mediaUrl: "",
  mediaType: "",
  published: false,
  featured: false,
  order: 0,
};

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function load() {
    const r = await fetch("/api/content?admin=1", { cache: "no-store" });
    if (r.status === 401) {
      setLoggedIn(false);
      return;
    }
    if (!r.ok) throw new Error("Could not load content.");
    setItems(await r.json());
    setLoggedIn(true);
  }

  useEffect(() => {
    load().catch(() => setLoggedIn(false));
  }, []);

  async function login(e: FormEvent) {
    e.preventDefault();
    setError("");
    const r = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!r.ok) {
      setError("Incorrect password.");
      return;
    }
    setPassword("");
    await load();
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    setLoggedIn(false);
  }

  function edit(item: Item) {
    setEditing(true);
    setForm({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category || "Stories",
      mediaUrl: item.mediaUrl || "",
      mediaType: item.mediaType || "",
      published: item.published,
      featured: item.featured,
      order: item.order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditing(false);
    setForm({ ...emptyForm, order: items.length });
    setMessage("");
    setError("");
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    const method = editing ? "PUT" : "POST";
    const r = await fetch("/api/content", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      setError(data.error || "Save failed.");
      return;
    }

    setMessage(editing ? "Content updated." : "Content created.");
    resetForm();
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this content permanently?")) return;
    const r = await fetch("/api/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!r.ok) {
      setError("Delete failed.");
      return;
    }
    await load();
  }

  async function upload(file: File) {
    setUploading(true);
    setError("");
    try {
      const init = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "blob.generate-client-token",
          pathname: `carltoons/${Date.now()}-${file.name}`,
          callbackUrl: "/api/upload",
        }),
      });
      if (!init.ok) throw new Error("Upload authorization failed.");
      const tokenData = await init.json();

      // This endpoint returns a Vercel Blob client token when configured.
      // The actual client upload is intentionally kept simple for this starter.
      if (tokenData.url) {
        setForm((f) => ({ ...f, mediaUrl: tokenData.url, mediaType: file.type }));
      } else if (tokenData.clientToken) {
        setError("Blob client upload requires the Vercel Blob client package configuration.");
      } else {
        setError("No upload URL/token was returned.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  if (loggedIn === null) {
    return <main className="ct-admin"><div className="ct-panel" style={{ maxWidth: 500, margin: "80px auto" }}>Loading Studio...</div></main>;
  }

  if (!loggedIn) {
    return (
      <main className="ct-admin" style={{ display: "grid", placeItems: "center", padding: 20 }}>
        <form className="ct-panel" style={{ width: "min(430px,100%)" }} onSubmit={login}>
          <div className="ct-brand" style={{ marginBottom: 25 }}>
            <span className="ct-logo">C</span> CARLTOONS STUDIO
          </div>
          <h1>Private Studio</h1>
          <p className="ct-muted">Sign in to create, edit and publish Carltoons content.</p>
          {error && <div className="ct-error">{error}</div>}
          <div className="ct-field">
            <label>Admin Password</label>
            <input
              className="ct-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          <button className="ct-btn ct-btn-orange" style={{ width: "100%", marginTop: 16 }}>
            Enter Studio
          </button>
          <a href="/" className="ct-link" style={{ display: "block", marginTop: 18 }}>← Back to website</a>
        </form>
      </main>
    );
  }

  return (
    <main className="ct-admin">
      <header className="ct-admin-top">
        <div className="ct-container ct-nav">
          <a className="ct-brand" href="/"><span className="ct-logo">C</span> CARLTOONS STUDIO</a>
          <div className="ct-nav-actions">
            <a className="ct-btn ct-btn-white" href="/" target="_blank">View Website</a>
            <button className="ct-btn ct-btn-orange" onClick={logout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="ct-admin-layout">
        <aside className="ct-sidebar">
          <a className="active" href="#dashboard">Dashboard</a>
          <a href="#editor">Create / Edit</a>
          <a href="#content">Content</a>
          <a href="#settings">Settings</a>
        </aside>

        <section className="ct-admin-main">
          <div id="dashboard" className="ct-section-head">
            <div>
              <h1 style={{ margin: 0 }}>Carltoons Studio</h1>
              <div className="ct-muted">Manage your entire public website.</div>
            </div>
            <button className="ct-btn ct-btn-orange" onClick={resetForm}>+ New Content</button>
          </div>

          {message && <div className="ct-success">{message}</div>}
          {error && <div className="ct-error">{error}</div>}

          <div className="ct-stat-grid">
            <div className="ct-stat"><small>Total</small><strong>{items.length}</strong></div>
            <div className="ct-stat"><small>Published</small><strong>{items.filter(x => x.published).length}</strong></div>
            <div className="ct-stat"><small>Drafts</small><strong>{items.filter(x => !x.published).length}</strong></div>
            <div className="ct-stat"><small>Featured</small><strong>{items.filter(x => x.featured).length}</strong></div>
          </div>

          <div id="editor" className="ct-panel">
            <h2>{editing ? "Edit Content" : "Create Content"}</h2>
            <form onSubmit={save}>
              <div className="ct-form-grid">
                <div className="ct-field">
                  <label>Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>

                <div className="ct-field">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option>Stories</option>
                    <option>Videos</option>
                    <option>Artwork</option>
                    <option>Tips</option>
                    <option>How-To</option>
                  </select>
                </div>

                <div className="ct-field full">
                  <label>Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>

                <div className="ct-field">
                  <label>Media URL</label>
                  <input value={form.mediaUrl} onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })} placeholder="https://..." />
                </div>

                <div className="ct-field">
                  <label>Media Type</label>
                  <input value={form.mediaType} onChange={(e) => setForm({ ...form, mediaType: e.target.value })} placeholder="image/jpeg or video/mp4" />
                </div>

                <div className="ct-field">
                  <label>Display Order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
                </div>

                <div className="ct-field" style={{ justifyContent: "center" }}>
                  <label>
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured content
                  </label>
                  <label>
                    <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
                  </label>
                </div>

                <div className="ct-field full">
                  <label>Upload Media</label>
                  <input type="file" accept="image/*,video/*" disabled={uploading} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
                  <small className="ct-muted">{uploading ? "Uploading..." : "For production, configure Vercel Blob storage."}</small>
                </div>
              </div>

              <div className="ct-actions" style={{ marginTop: 20 }}>
                <button className="ct-btn ct-btn-orange">{editing ? "Save Changes" : "Create Content"}</button>
                {editing && <button type="button" className="ct-btn ct-btn-dark" onClick={resetForm}>Cancel</button>}
              </div>
            </form>
          </div>

          <div id="content" className="ct-panel">
            <h2>Content Library</h2>
            <div className="ct-table-wrap">
              <table className="ct-table">
                <thead>
                  <tr>
                    <th>Title</th><th>Category</th><th>Status</th><th>Featured</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.title}</strong></td>
                      <td>{item.category || "—"}</td>
                      <td>
                        <span className={`ct-badge ${item.published ? "ct-badge-green" : "ct-badge-gray"}`}>
                          {item.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td>{item.featured ? "⭐" : "—"}</td>
                      <td>
                        <div className="ct-actions">
                          <button className="ct-btn ct-btn-dark" onClick={() => edit(item)}>Edit</button>
                          <button className="ct-btn ct-btn-orange" onClick={() => remove(item.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div id="settings" className="ct-panel">
            <h2>Website Settings</h2>
            <p className="ct-muted">
              The public site uses Carltoons Orange, Black and White branding.
              SEO metadata is configured in <code>app/layout.tsx</code>.
            </p>
            <p className="ct-muted">
              Advertising placeholders are included. Actual ad revenue requires an approved advertising network/account and valid ad placement.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
'''

files["lib/content.ts"] = r'''import { promises as fs } from "fs";
import path from "path";

export type ContentItem = {
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

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "content.json");

const seed: ContentItem[] = [];

async function ensureFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(seed, null, 2), "utf8");
  }
}

export async function readContent(): Promise<ContentItem[]> {
  await ensureFile();
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeContent(items: ContentItem[]) {
  await ensureFile();
  await fs.writeFile(dataFile, JSON.stringify(items, null, 2), "utf8");
}
'''

files["lib/auth.ts"] = r'''import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE = "carltoons_admin";
const SECRET = process.env.CARLTOONS_SESSION_SECRET || "change-this-secret";

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export function makeSession() {
  const value = `${Date.now()}`;
  return `${value}.${sign(value)}`;
}

export function validSession(value?: string) {
  if (!value) return false;
  const [timestamp, signature] = value.split(".");
  if (!timestamp || !signature) return false;

  const expected = sign(timestamp);
  if (signature.length !== expected.length) return false;

  const good = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );

  const age = Date.now() - Number(timestamp);
  return good && Number.isFinite(age) && age >= 0 && age < 1000 * 60 * 60 * 24 * 7;
}

export async function isAdmin() {
  const jar = await cookies();
  return validSession(jar.get(COOKIE)?.value);
}

export const SESSION_COOKIE = COOKIE;
'''

files["app/api/auth/route.ts"] = r'''import { NextResponse } from "next/server";
import { isAdmin, makeSession, SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ authenticated: await isAdmin() });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const password = String(body.password || "");
  const expected = process.env.CARLTOONS_ADMIN_PASSWORD || "";

  if (!expected || password !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, makeSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
'''

files["app/api/content/route.ts"] = r'''import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { readContent, writeContent, type ContentItem } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const items = await readContent();
  const url = new URL(request.url);
  const adminView = url.searchParams.get("admin") === "1" && (await isAdmin());

  const visible = adminView ? items : items.filter((item) => item.published);

  visible.sort((a, b) => a.order - b.order);
  return NextResponse.json(visible);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const items = await readContent();
  const now = new Date().toISOString();

  const item: ContentItem = {
    id: crypto.randomUUID(),
    title: String(body.title || "Untitled"),
    description: String(body.description || ""),
    category: String(body.category || "Stories"),
    mediaUrl: String(body.mediaUrl || ""),
    mediaType: String(body.mediaType || ""),
    published: Boolean(body.published),
    featured: Boolean(body.featured),
    order: Number.isFinite(Number(body.order)) ? Number(body.order) : items.length,
    createdAt: now,
    updatedAt: now,
  };

  items.push(item);
  await writeContent(items);
  return NextResponse.json(item);
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const items = await readContent();
  const index = items.findIndex((item) => item.id === body.id);

  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  items[index] = {
    ...items[index],
    title: String(body.title ?? items[index].title),
    description: String(body.description ?? items[index].description),
    category: String(body.category ?? items[index].category ?? "Stories"),
    mediaUrl: String(body.mediaUrl ?? items[index].mediaUrl ?? ""),
    mediaType: String(body.mediaType ?? items[index].mediaType ?? ""),
    published: Boolean(body.published),
    featured: Boolean(body.featured),
    order: Number.isFinite(Number(body.order)) ? Number(body.order) : items[index].order,
    updatedAt: new Date().toISOString(),
  };

  await writeContent(items);
  return NextResponse.json(items[index]);
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  const items = await readContent();
  const next = items.filter((item) => item.id !== id);

  if (next.length === items.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await writeContent(next);
  return NextResponse.json({ success: true });
}
'''

files["app/api/upload/route.ts"] = r'''import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => ({
        allowedContentTypes: [
          "image/*",
          "video/*",
          "application/pdf",
          "text/plain",
        ],
        maximumSizeInBytes: 100 * 1024 * 1024,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ owner: "carltoons", pathname }),
      }),
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 400 });
  }
}
'''

files[".env.example"] = '''CARLTOONS_ADMIN_PASSWORD=change-this-password
CARLTOONS_SESSION_SECRET=replace-with-a-long-random-secret
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
'''

files["data/content.json"] = "[]\n"

files["README-CARLTOONS.md"] = r'''# Carltoons Premium Website

## Development

Open PowerShell in the project folder:

```powershell
cd "F:\Download Ace\carltoons-max\carltoons"
npm run dev -- --webpack