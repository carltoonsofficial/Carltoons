"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

type MonetizationSettings = { enabled: boolean; autoAds: boolean; publisherId: string; showHome: boolean; showContent: boolean; showVideos: boolean; showSearch: boolean; showSidebar: boolean };

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
  "Stories",
  "Tips",
  "How-To",
  "Rankings",
  "Videos",
  "Artwork",
  "Projects",
  "Files",
];

async function readApiResponse(response: Response) {
  const text = await response.text();
  if (!text) return {};
  try { return JSON.parse(text); } catch { return { error: text }; }
}

const emptyForm = {
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
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [importingReels, setImportingReels] = useState(false);
  const [error, setError] = useState("");
  const [monetization, setMonetization] = useState<MonetizationSettings>({ enabled:false, autoAds:false, publisherId:"", showHome:false, showContent:true, showVideos:true, showSearch:true, showSidebar:false });
  const [savingMonetization, setSavingMonetization] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const response = await fetch("/api/auth", {
        cache: "no-store",
      });

      const data = await readApiResponse(response);

      setAuthenticated(Boolean(data.authenticated));

      if (data.authenticated) {
        await loadContent();
        await loadMonetization();
      }
    } catch {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  async function loadMonetization() {
    const response = await fetch("/api/monetization", { cache: "no-store" });
    const data = await readApiResponse(response);
    if (response.ok) setMonetization(data);
  }

  async function saveMonetization() {
    setSavingMonetization(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/monetization", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(monetization) });
      const data = await readApiResponse(response);
      if (!response.ok) throw new Error(data.error || "Unable to save monetization settings.");
      setMonetization(data);
      setMessage("Monetization settings saved.");
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to save monetization settings."); }
    finally { setSavingMonetization(false); }
  }

  async function loadContent() {
    const response = await fetch("/api/content?admin=1", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Unable to load content.");
    }

    const data = await readApiResponse(response);

    setItems(Array.isArray(data) ? data : []);
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!password.trim()) {
      setError("Enter your Studio password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "login",
          password,
        }),
      });

      const data = await readApiResponse(response);

      if (!response.ok || !data.success) {
        setError(data.error || "Invalid password.");
        return;
      }

      setAuthenticated(true);
      setPassword("");
      await loadContent();
    } catch {
      setError("Unable to connect to the Studio.");
    } finally {
      setLoading(false);
    }
  }

  async function importFacebookReels() {
    setImportingReels(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/reels/import", { method: "POST" });
      const data = await readApiResponse(response);

      if (!response.ok) throw new Error(data.error || "Reel import failed.");

      await loadContent();
      setMessage(
        data.added
          ? `Imported ${data.added} Facebook Reels. They are published and ready to edit.`
          : "All supplied Facebook Reels are already in the library."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reel import failed.");
    } finally {
      setImportingReels(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth", {
      method: "DELETE",
    });

    setAuthenticated(false);
    setItems([]);
    setEditingId(null);
  }

  function newContent() {
    setEditingId(null);

    setForm({
      ...emptyForm,
      order: items.length,
    });

    setMessage("");
    setError("");
  }

  function editContent(item: ContentItem) {
    setEditingId(item.id);

    setForm({
      title: item.title,
      description: item.description,
      category: item.category || "Stories",
      mediaUrl: item.mediaUrl || "",
      mediaType: item.mediaType || "",
      published: item.published,
      featured: item.featured,
      order: item.order,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function updateForm(
    key: keyof typeof emptyForm,
    value: string | boolean | number
  ) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "mediaUrl" && typeof value === "string" && /facebook\.com\/(?:reel|watch)\//i.test(value)) {
        next.mediaType = "facebook-reel";
      }
      return next;
    });
  }

  async function saveContent(event: FormEvent) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const method = editingId ? "PUT" : "POST";

      const body = editingId
        ? {
            id: editingId,
            ...form,
          }
        : form;

      const response = await fetch("/api/content", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Unable to save content.");
      }

      await loadContent();

      setMessage(
        editingId
          ? "Content updated successfully."
          : "Content created successfully."
      );

      if (!editingId) {
        setForm({
          ...emptyForm,
          order: items.length + 1,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save content."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteContent(id: string) {
    const confirmed = window.confirm(
      "Delete this content permanently?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/content", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const data = await readApiResponse(response);
        throw new Error(data.error || "Delete failed.");
      }

      await loadContent();

      if (editingId === id) {
        newContent();
      }

      setMessage("Content deleted.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Delete failed."
      );
    }
  }

  async function togglePublish(item: ContentItem) {
    await updateItem(item, {
      published: !item.published,
    });
  }

  async function toggleFeatured(item: ContentItem) {
    await updateItem(item, {
      featured: !item.featured,
    });
  }

  async function updateItem(
    item: ContentItem,
    changes: Partial<ContentItem>
  ) {
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...item,
          ...changes,
        }),
      });

      if (!response.ok) {
        const data = await readApiResponse(response);
        throw new Error(data.error || "Update failed.");
      }

      await loadContent();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Update failed."
      );
    }
  }

  async function duplicateContent(item: ContentItem) {
    setSaving(true);

    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `${item.title} Copy`,
          description: item.description,
          category: item.category,
          mediaUrl: item.mediaUrl,
          mediaType: item.mediaType,
          published: false,
          featured: false,
          order: items.length,
        }),
      });

      if (!response.ok) {
        const data = await readApiResponse(response);
        throw new Error(data.error || "Duplicate failed.");
      }

      await loadContent();
      setMessage("Content duplicated as a draft.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Duplicate failed."
      );
    } finally {
      setSaving(false);
    }
  }

  async function uploadMedia(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const modeResponse = await fetch("/api/upload", { cache: "no-store" });
      const modeData = await modeResponse.json().catch(() => ({}));
      if (!modeResponse.ok) throw new Error(modeData.error || "Upload service is unavailable.");

      let mediaUrl = "";

      if (modeData.mode === "blob-client") {
        // Dynamically import so local development does not depend on a Blob token.
        const { upload } = await import("@vercel/blob/client");
        const blob = await upload(`carltoons/${Date.now()}-${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        mediaUrl = blob.url;
      } else {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Media upload failed.");
        mediaUrl = data.url;
      }

      updateForm("mediaUrl", mediaUrl);
      updateForm(
        "mediaType",
        file.type.startsWith("video/")
          ? "video"
          : "image"
      );

      setMessage("Media uploaded successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Media upload failed."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...items]
      .sort((a, b) => a.order - b.order)
      .filter((item) => {
        const matchesFilter =
          filter === "All" ||
          (filter === "Published" && item.published) ||
          (filter === "Drafts" && !item.published) ||
          (filter === "Featured" && item.featured) ||
          String(item.category || "").toLowerCase() ===
            filter.toLowerCase();

        const matchesSearch =
          !query ||
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          String(item.category || "")
            .toLowerCase()
            .includes(query);

        return matchesFilter && matchesSearch;
      });
  }, [items, filter, search]);

  const publishedCount = items.filter((item) => item.published).length;
  const draftCount = items.filter((item) => !item.published).length;
  const featuredCount = items.filter((item) => item.featured).length;

  if (loading && authenticated === null) {
    return (
      <main className="studio-login">
        <div className="studio-login-box">
          <div className="ct-eyebrow">Carltoons</div>
          <h1>Loading Studio...</h1>
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="studio-login">
        <form className="studio-login-box" onSubmit={handleLogin}>
          <div className="ct-brand">
            <span className="ct-brand-mark">C</span>
            <span className="ct-brand-name">CARLTOONS</span>
          </div>

          <div style={{ marginTop: 30 }}>
            <div className="ct-eyebrow">
              Private Creator Area
            </div>

            <h1>Carltoons Studio</h1>

            <p>
              Manage, edit and publish your Carltoons content.
            </p>
          </div>

          <div className="studio-field">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Studio password"
              autoFocus
            />
          </div>

          {error && (
            <div className="studio-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="ct-btn ct-btn-primary"
            style={{
              width: "100%",
              marginTop: 15,
            }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Enter Studio"}
          </button>

          <a
            href="/"
            className="ct-btn ct-btn-light"
            style={{
              width: "100%",
              marginTop: 10,
            }}
          >
            ← Back to Website
          </a>
        </form>
      </main>
    );
  }

  return (
    <main className="studio">
      <header className="studio-header">
        <div className="ct-container studio-header-inner">
          <a href="/" className="ct-brand">
            <span className="ct-brand-mark">C</span>
            <span className="ct-brand-name">
              CARLTOONS STUDIO
            </span>
          </a>

          <div className="studio-actions">
            <a
              href="/"
              target="_blank"
              className="ct-btn ct-btn-light ct-btn-small"
            >
              View Website ↗
            </a>

            <button
              className="ct-btn ct-btn-primary ct-btn-small"
              onClick={newContent}
            >
              + New Content
            </button>

            <button
              className="ct-btn ct-btn-dark ct-btn-small"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="studio-layout">
        <aside className="studio-sidebar">
          <div className="ct-eyebrow">
            Management
          </div>

          <div className="studio-nav" style={{ marginTop: 15 }}>
            <a href="/admin/pages" style={{ display: "block", padding: "10px 12px", borderRadius: 8, color: "inherit", textDecoration: "none" }}>Pages</a>
            <button
              className={filter === "All" ? "active" : ""}
              onClick={() => setFilter("All")}
            >
              All Content
            </button>

            <button
              className={filter === "Published" ? "active" : ""}
              onClick={() => setFilter("Published")}
            >
              Published
            </button>

            <button
              className={filter === "Drafts" ? "active" : ""}
              onClick={() => setFilter("Drafts")}
            >
              Drafts
            </button>

            <button
              className={filter === "Featured" ? "active" : ""}
              onClick={() => setFilter("Featured")}
            >
              Featured
            </button>

            {categories.map((category) => (
              <button
                key={category}
                className={
                  filter === category ? "active" : ""
                }
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </aside>

        <section className="studio-main">
          <div className="studio-title">
            <div className="ct-eyebrow">Dashboard</div>
            <h1>Carltoons Studio</h1>
            <p>
              Create, edit, organize and publish your website
              content.
            </p>
            <div className="studio-actions" style={{ marginTop: 16 }}>
              <button
                type="button"
                className="ct-btn ct-btn-primary"
                onClick={importFacebookReels}
                disabled={importingReels}
              >
                {importingReels ? "Importing Reels..." : "Import 39 Facebook Reels"}
              </button>
              <a href="/videos" target="_blank" className="ct-btn ct-btn-light">
                Open Videos Library ↗
              </a>
            </div>
          </div>

          <section className="studio-panel" style={{ marginBottom: 24 }}>
            <div className="ct-eyebrow">Monetization</div>
            <h2 style={{ marginTop: 8 }}>Advertising</h2>
            <p>Prepare Carltoons for Google AdSense. Ads will remain off until you enter your publisher ID and enable them.</p>
            <div className="studio-form-grid">
              <div className="studio-field">
                <label>AdSense Publisher ID</label>
                <input value={monetization.publisherId} onChange={e => setMonetization(v => ({...v, publisherId:e.target.value}))} placeholder="ca-pub-1234567890" />
                <small>Get this from your AdSense account. Never put a secret key here.</small>
              </div>
              <div className="studio-field">
                <label>
                  <input type="checkbox" checked={monetization.enabled} onChange={e => setMonetization(v => ({...v, enabled:e.target.checked}))} /> Enable advertising
                </label>
                <label>
                  <input type="checkbox" checked={monetization.autoAds} onChange={e => setMonetization(v => ({...v, autoAds:e.target.checked}))} /> Enable Auto ads
                </label>
              </div>
            </div>
            <div className="studio-form-grid" style={{ marginTop: 12 }}>
              {([['showContent','Content pages'],['showVideos','Videos'],['showSearch','Search'],['showHome','Home (off by default)'],['showSidebar','Sidebar']] as const).map(([key,label]) => (
                <label key={key}><input type="checkbox" checked={monetization[key]} onChange={e => setMonetization(v => ({...v, [key]:e.target.checked}))} /> {label}</label>
              ))}
            </div>
            <button className="ct-btn ct-btn-primary" style={{ marginTop: 16 }} onClick={saveMonetization} disabled={savingMonetization}>{savingMonetization ? 'Saving...' : 'Save Monetization Settings'}</button>
            <p style={{ fontSize: 13, opacity: .75, marginTop: 12 }}>After AdSense approves your site, Auto ads can place ads automatically. Your public <code>/ads.txt</code> is generated from this publisher ID.</p>
          </section>

          <div className="studio-stats">
            <div className="studio-stat">
              <span>Total</span>
              <strong>{items.length}</strong>
            </div>

            <div className="studio-stat">
              <span>Published</span>
              <strong>{publishedCount}</strong>
            </div>

            <div className="studio-stat">
              <span>Drafts</span>
              <strong>{draftCount}</strong>
            </div>

            <div className="studio-stat">
              <span>Featured</span>
              <strong>{featuredCount}</strong>
            </div>

            <div className="studio-stat">
              <span>Categories</span>
              <strong>
                {
                  new Set(
                    items.map((item) => item.category)
                  ).size
                }
              </strong>
            </div>
          </div>

          {(message || error) && (
            <div
              className={
                error ? "studio-error" : "studio-success"
              }
              style={{ marginBottom: 20 }}
            >
              {error || message}
            </div>
          )}

          <form className="studio-card" onSubmit={saveContent}>
            <h2>
              {editingId
                ? "Edit Content"
                : "Create New Content"}
            </h2>

            <div className="studio-form-grid">
              <div className="studio-field full">
                <label>Title</label>

                <input
                  value={form.title}
                  onChange={(event) =>
                    updateForm("title", event.target.value)
                  }
                  placeholder="Enter content title"
                />
              </div>

              <div className="studio-field">
                <label>Category</label>

                <select
                  value={form.category}
                  onChange={(event) =>
                    updateForm(
                      "category",
                      event.target.value
                    )
                  }
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="studio-field">
                <label>Display Order</label>

                <input
                  type="number"
                  value={form.order}
                  onChange={(event) =>
                    updateForm(
                      "order",
                      Number(event.target.value)
                    )
                  }
                />
              </div>

              <div className="studio-field full">
                <label>Description</label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateForm(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Write your content description..."
                />
              </div>

              <div className="studio-field">
                <label>Media URL</label>

                <input
                  value={form.mediaUrl}
                  onChange={(event) =>
                    updateForm(
                      "mediaUrl",
                      event.target.value
                    )
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="studio-field">
                <label>Media Type</label>

                <select
                  value={form.mediaType}
                  onChange={(event) =>
                    updateForm(
                      "mediaType",
                      event.target.value
                    )
                  }
                >
                  <option value="">Auto / None</option>
                  <option value="image">Image</option>
                  <option value="video">Uploaded Video</option>
                  <option value="facebook-reel">Facebook Reel URL</option>
                </select>
              </div>

              <div className="studio-field full">
                <label>Upload Media</label>

                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={uploadMedia}
                  disabled={uploading}
                />

                {uploading && (
                  <small>
                    Uploading media to Carltoons...
                  </small>
                )}
              </div>

              {form.mediaUrl && (
                <div className="studio-field full">
                  <label>Preview</label>

                  <div className="studio-preview">
                    {form.mediaType === "video" ? (
                      <video src={form.mediaUrl} controls playsInline />
                    ) : form.mediaType === "facebook-reel" || /facebook\.com\/(?:reel|watch)\//i.test(form.mediaUrl) ? (
                      <div style={{ padding: 35, color: "white", textAlign: "center" }}>
                        Facebook Reel URL saved.<br />
                        <a href={form.mediaUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#ff6a00" }}>
                          Open Reel ↗
                        </a>
                      </div>
                    ) : (
                      <img src={form.mediaUrl} alt="Media preview" />
                    )}
                  </div>
                </div>
              )}

              <div className="studio-field full">
                <div className="studio-checks">
                  <label className="studio-check">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(event) =>
                        updateForm(
                          "published",
                          event.target.checked
                        )
                      }
                    />
                    Publish immediately
                  </label>

                  <label className="studio-check">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(event) =>
                        updateForm(
                          "featured",
                          event.target.checked
                        )
                      }
                    />
                    Featured content
                  </label>
                </div>
              </div>

              <div className="studio-field full">
                <div className="studio-actions">
                  <button
                    type="submit"
                    className="ct-btn ct-btn-primary"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Save Changes"
                        : "Create Content"}
                  </button>

                  <button
                    type="button"
                    className="ct-btn ct-btn-light"
                    onClick={newContent}
                  >
                    Clear
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      className="ct-btn ct-btn-danger"
                      onClick={() =>
                        deleteContent(editingId)
                      }
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>

          <section className="studio-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 15,
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h2 style={{ margin: 0 }}>
                Content Library
              </h2>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search content..."
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: "10px 12px",
                  width: 250,
                }}
              />
            </div>

            {visibleItems.length === 0 ? (
              <div className="studio-empty">
                No content found.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="studio-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Content</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.order}</td>

                        <td>
                          <strong>{item.title}</strong>

                          <div
                            style={{
                              color: "#888",
                              fontSize: 11,
                              marginTop: 4,
                            }}
                          >
                            {new Date(
                              item.createdAt
                            ).toLocaleDateString()}
                          </div>
                        </td>

                        <td>
                          <span className="ct-badge ct-badge-orange">
                            {item.category || "General"}
                          </span>
                        </td>

                        <td>
                          <button
                            className={`ct-badge ${
                              item.published
                                ? "ct-badge-green"
                                : "ct-badge-gray"
                            }`}
                            onClick={() =>
                              togglePublish(item)
                            }
                          >
                            {item.published
                              ? "Published"
                              : "Draft"}
                          </button>
                        </td>

                        <td>
                          <button
                            className={`ct-badge ${
                              item.featured
                                ? "ct-badge-orange"
                                : "ct-badge-gray"
                            }`}
                            onClick={() =>
                              toggleFeatured(item)
                            }
                          >
                            {item.featured
                              ? "Featured"
                              : "Normal"}
                          </button>
                        </td>

                        <td>
                          <div className="studio-actions">
                            <button
                              className="ct-btn ct-btn-primary ct-btn-small"
                              onClick={() =>
                                editContent(item)
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="ct-btn ct-btn-light ct-btn-small"
                              onClick={() =>
                                duplicateContent(item)
                              }
                            >
                              Duplicate
                            </button>

                            <a
                              href={`/content/${item.id}`}
                              target="_blank"
                              className="ct-btn ct-btn-light ct-btn-small"
                            >
                              View
                            </a>

                            <button
                              className="ct-btn ct-btn-danger ct-btn-small"
                              onClick={() =>
                                deleteContent(item.id)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}