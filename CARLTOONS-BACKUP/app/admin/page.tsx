"use client";

import { useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";

type Item = {
  id: string;
  title: string;
  description: string;
  category: "Artwork" | "Videos" | "Stories" | "Projects" | "Files";
  mediaUrl?: string;
  mediaType?: string;
  published: boolean;
  featured: boolean;
  order: number;
};

const categories = ["Artwork", "Videos", "Stories", "Projects", "Files"] as const;

export default function Studio() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Item | null>(null);
  const [busy, setBusy] = useState(false);

  async function checkAuth() {
    const res = await fetch("/api/auth");
    const data = await res.json();
    setAuthenticated(data.authenticated);
    if (data.authenticated) loadItems();
  }

  async function loadItems() {
    const res = await fetch("/api/content?admin=1", { cache: "no-store" });
    if (res.status === 401) return setAuthenticated(false);
    setItems(await res.json());
  }

  useEffect(() => { checkAuth(); }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) {
      setPassword("");
      setAuthenticated(true);
      loadItems();
    } else alert("Incorrect password.");
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthenticated(false);
  }

  if (authenticated === null) return <main className="min-h-screen bg-black p-8 text-white">Loading Carltoons Studio…</main>;

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-5 text-white">
        <form onSubmit={login} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-400">CARLTOONS STUDIO</p>
          <h1 className="mt-3 text-4xl font-black">Owner Login</h1>
          <p className="mt-3 text-white/50">Private publishing studio.</p>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Studio password" className="mt-8 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-orange-400" />
          <button disabled={busy} className="mt-4 w-full rounded-full bg-orange-500 px-6 py-3 font-bold text-black disabled:opacity-50">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-400">CARLTOONS STUDIO</p>
            <h1 className="mt-2 text-4xl font-black">Content Manager</h1>
          </div>
          <div className="flex gap-3">
            <a href="/" target="_blank" className="rounded-full border border-white/15 px-5 py-2 text-sm font-bold">View Site</a>
            <button onClick={logout} className="rounded-full border border-white/15 px-5 py-2 text-sm font-bold">Sign out</button>
          </div>
        </header>

        <Editor
          item={editing}
          busy={busy}
          setBusy={setBusy}
          onDone={() => { setEditing(null); loadItems(); }}
        />

        <section className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-orange-400">Library</p>
              <h2 className="mt-2 text-3xl font-black">{items.length} items</h2>
            </div>
            <button onClick={() => setEditing(null)} className="rounded-full bg-orange-500 px-5 py-2 font-bold text-black">+ New Content</button>
          </div>

          <div className="mt-6 space-y-3">
            {items.map((item, index) => (
              <div key={item.id} draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", String(index))}
                onDragOver={(e) => e.preventDefault()}
                onDrop={async (e) => {
                  const from = Number(e.dataTransfer.getData("text/plain"));
                  const copy = [...items];
                  const [moved] = copy.splice(from, 1);
                  copy.splice(index, 0, moved);
                  const reordered = copy.map((x, i) => ({ ...x, order: i }));
                  setItems(reordered);
                  await Promise.all(reordered.map((x) => fetch("/api/content", {
                    method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(x)
                  })));
                }}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center">
                {item.mediaUrl ? (
                  item.mediaType?.startsWith("video") ?
                    <video src={item.mediaUrl} className="h-20 w-full rounded-xl object-cover sm:w-28" /> :
                    <img src={item.mediaUrl} alt="" className="h-20 w-full rounded-xl object-cover sm:w-28" />
                ) : <div className="h-20 w-full rounded-xl bg-white/5 sm:w-28" />}
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-widest text-orange-400">{item.category}</p>
                  <h3 className="truncate font-bold">{item.title}</h3>
                  <p className="text-sm text-white/40">{item.published ? "Published" : "Draft"} {item.featured ? "• Featured" : ""}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(item)} className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold">Edit</button>
                  <button onClick={async () => { if (confirm("Delete this item?")) { await fetch("/api/content", { method: "DELETE", headers: {"Content-Type":"application/json"}, body: JSON.stringify({id:item.id}) }); loadItems(); } }}
                    className="rounded-full border border-red-400/30 px-4 py-2 text-sm font-bold text-red-300">Delete</button>
                </div>
              </div>
            ))}
            {!items.length && <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-white/40">No content yet. Create your first post above.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}

function Editor({ item, onDone, busy, setBusy }: { item: Item | null; onDone: () => void; busy: boolean; setBusy: (v:boolean)=>void }) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [category, setCategory] = useState<Item["category"]>(item?.category ?? "Artwork");
  const [mediaUrl, setMediaUrl] = useState(item?.mediaUrl ?? "");
  const [mediaType, setMediaType] = useState(item?.mediaType ?? "");
  const [published, setPublished] = useState(item?.published ?? true);
  const [featured, setFeatured] = useState(item?.featured ?? false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setTitle(item?.title ?? ""); setDescription(item?.description ?? ""); setCategory(item?.category ?? "Artwork");
    setMediaUrl(item?.mediaUrl ?? ""); setMediaType(item?.mediaType ?? ""); setPublished(item?.published ?? true); setFeatured(item?.featured ?? false);
  }, [item]);

  async function chooseFile(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const result = await upload(`carltoons/${Date.now()}-${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      setMediaUrl(result.url);
      setMediaType(file.type);
    } catch (e) {
      alert("Upload failed. Check your Vercel Blob configuration.");
    } finally { setUploading(false); }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const payload = { id: item?.id, title, description, category, mediaUrl, mediaType, published, featured, order: item?.order ?? 999999 };
    const res = await fetch("/api/content", {
      method: item ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) return alert("Could not save.");
    onDone();
  }

  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">{item ? "Edit" : "Create"}</p>
          <h2 className="mt-2 text-2xl font-black">{item ? "Edit Content" : "New Content"}</h2>
        </div>
        {item && <button onClick={onDone} className="text-sm text-white/50">Cancel</button>}
      </div>

      <form onSubmit={save} className="mt-7 grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold">Photo / Video / File</label>
          <input type="file" accept="image/*,video/*,.pdf,.txt" onChange={(e) => chooseFile(e.target.files?.[0])}
            className="w-full rounded-xl border border-white/10 bg-black p-4 text-sm" />
          {uploading && <p className="mt-2 text-sm text-orange-400">Uploading…</p>}
          {mediaUrl && <p className="mt-2 truncate text-xs text-white/40">{mediaUrl}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold">Title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as Item["category"])} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3">
            {categories.map((x) => <option key={x}>{x}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold">Description</label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3" />
        </div>
        <label className="flex items-center gap-3 rounded-xl border border-white/10 p-4"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Published</label>
        <label className="flex items-center gap-3 rounded-xl border border-white/10 p-4"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> Featured on homepage</label>
        <div className="md:col-span-2">
          <button disabled={busy || uploading} className="rounded-full bg-orange-500 px-7 py-3 font-bold text-black disabled:opacity-50">
            {busy ? "Saving…" : item ? "Save Changes" : "Publish Content"}
          </button>
        </div>
      </form>
    </section>
  );
}
