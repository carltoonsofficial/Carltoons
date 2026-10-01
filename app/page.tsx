<<<<<<< HEAD
"use client";

import { useEffect, useMemo, useState } from "react";

type Item = {
  id: string;
  title: string;
  description: string;
  category: "Artwork" | "Videos" | "Stories" | "Projects" | "Files";
  mediaUrl?: string;
  mediaType?: string;
  featured: boolean;
  order: number;
};

const socialLinks = [
  ["Facebook", "@carltoonsofficial", "https://www.facebook.com/carltoonsofficial"],
  ["Instagram", "@carltoonsofficial", "https://www.instagram.com/carltoonsofficial"],
  ["YouTube", "@carltoonsofficial", "https://www.youtube.com/@carltoonsofficial"],
  ["TikTok", "@carltoonsofficial", "https://www.tiktok.com/@carltoonsofficial"],
];

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  const featured = useMemo(() => items.filter((x) => x.featured), [items]);
  const latest = items.filter((x) => !x.featured);

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="text-2xl font-black tracking-tight">CARLTOONS</a>
          <nav className="hidden gap-6 text-sm md:flex">
            <a href="#content" className="hover:text-orange-400">Content</a>
            <a href="#socials" className="hover:text-orange-400">Social Media</a>
            <a href="#about" className="hover:text-orange-400">About</a>
=======
const socialLinks = [
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

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-2xl font-black tracking-tight hover:text-orange-400"
          >
            CARLTOONS
          </a>

          <nav className="hidden gap-6 text-sm md:flex">
            <a href="#socials" className="hover:text-orange-400">
              Social Media
            </a>

            <a href="#about" className="hover:text-orange-400">
              About
            </a>

            <a href="#contact" className="hover:text-orange-400">
              Contact
            </a>
>>>>>>> origin/main
          </nav>
        </div>
      </header>

<<<<<<< HEAD
      <section className="mx-auto max-w-7xl px-5 py-20 text-center md:py-28">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-400">Creator • Artist • Entertainment</p>
        <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">Welcome to Carltoons</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/65">
          The official home of Carltoons — original artwork, funny videos, stories, characters and entertainment.
        </p>
        <a href="#content" className="mt-9 inline-flex rounded-full bg-orange-500 px-7 py-3 font-bold text-black hover:bg-orange-400">
          Explore Carltoons
        </a>
      </section>

      <section id="content" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-16">
        <p className="text-sm font-bold uppercase tracking-widest text-orange-400">Published</p>
        <h2 className="mt-2 text-4xl font-black">Latest Carltoons Content</h2>

        {featured.length > 0 && (
          <>
            <h3 className="mt-10 text-2xl font-bold">Featured</h3>
            <ContentGrid items={featured} />
          </>
        )}

        <h3 className="mt-12 text-2xl font-bold">Latest</h3>
        {latest.length ? (
          <ContentGrid items={latest} />
        ) : (
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center text-white/50">
            New Carltoons content will appear here after it is published.
          </div>
        )}
      </section>

      <section id="socials" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20">
        <p className="text-center text-sm font-bold uppercase tracking-widest text-orange-400">Connect</p>
        <h2 className="mt-2 text-center text-4xl font-black">Official Social Media</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {socialLinks.map(([name, handle, url]) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer"
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition hover:-translate-y-1 hover:border-orange-400/50">
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">Official</p>
              <h3 className="mt-2 text-2xl font-black">{name}</h3>
              <p className="mt-4 text-sm text-white/50">{handle}</p>
              <p className="mt-6 font-bold text-orange-400">Visit {name} →</p>
=======
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-orange-400">
          Creator • Artist • Entertainment
        </p>

        <h1 className="text-5xl font-black tracking-tight md:text-7xl">
          Welcome to Carltoons
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/65">
          Official Carltoons website featuring original artwork, funny
          videos, stories, entertainment and social media.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#socials"
            className="rounded-full bg-orange-500 px-7 py-3 font-bold text-black transition hover:scale-105 hover:bg-orange-400"
          >
            Follow Carltoons
          </a>

          <a
            href="#about"
            className="rounded-full border border-white/20 px-7 py-3 font-bold transition hover:bg-white/10"
          >
            Explore
          </a>
        </div>
      </section>

      {/* SOCIAL MEDIA */}
      <section
        id="socials"
        className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20"
      >
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
            Connect With Carltoons
          </p>

          <h2 className="mt-3 text-4xl font-black md:text-5xl">
            Official Social Media
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            Follow Carltoons across the official social-media platforms.
            Click any card to go directly to the account.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit Carltoons on ${social.name}`}
              className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition duration-300 hover:-translate-y-2 hover:border-orange-400/50 hover:bg-white/[0.08]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                    Official
                  </p>

                  <h3 className="mt-2 text-2xl font-black">
                    {social.name}
                  </h3>
                </div>

                <span className="text-3xl transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>

              <p className="mt-5 text-sm text-white/50">
                {social.handle}
              </p>

              <div className="mt-7 inline-flex rounded-full border border-orange-400/30 px-4 py-2 text-sm font-bold text-orange-400 transition group-hover:bg-orange-500 group-hover:text-black">
                Visit {social.name} →
              </div>
>>>>>>> origin/main
            </a>
          ))}
        </div>
      </section>

<<<<<<< HEAD
      <section id="about" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-12">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">About Carltoons</p>
          <h2 className="mt-3 text-4xl font-black">One home for everything Carltoons.</h2>
          <p className="mt-5 max-w-3xl leading-8 text-white/65">
            Carltoons is a creator and entertainment brand bringing together original artwork, funny content, videos, stories and creative projects.
=======
      {/* About */}
      <section
        id="about"
        className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20"
      >
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-12">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            About Carltoons
          </p>

          <h2 className="mt-3 text-4xl font-black">
            One home for Carltoons.
          </h2>

          <p className="mt-5 max-w-3xl leading-8 text-white/65">
            Carltoons is a creator and entertainment brand bringing together
            original artwork, funny content, videos, stories and social media
            in one place.
>>>>>>> origin/main
          </p>
        </div>
      </section>

<<<<<<< HEAD
      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-white/40">
=======
      {/* Contact */}
      <section
        id="contact"
        className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20"
      >
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-12">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            Contact
          </p>

          <h2 className="mt-3 text-4xl font-black">
            Work with Carltoons
          </h2>

          <p className="mt-4 max-w-2xl leading-8 text-white/60">
            For business, collaboration and creative inquiries, connect with
            Carltoons through the official social-media accounts.
          </p>

          <a
            href="#socials"
            className="mt-7 inline-block rounded-full bg-orange-500 px-6 py-3 font-bold text-black transition hover:bg-orange-400"
          >
            View Official Accounts →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
>>>>>>> origin/main
        © {new Date().getFullYear()} Carltoons. All rights reserved.
      </footer>
    </main>
  );
<<<<<<< HEAD
}

function ContentGrid({ items }: { items: Item[] }) {
  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article key={item.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
          {item.mediaUrl && item.mediaType?.startsWith("video") ? (
            <video src={item.mediaUrl} controls className="aspect-video w-full object-cover" />
          ) : item.mediaUrl ? (
            <img src={item.mediaUrl} alt={item.title} className="aspect-video w-full object-cover" />
          ) : null}
          <div className="p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-orange-400">{item.category}</p>
            <h3 className="mt-2 text-xl font-black">{item.title}</h3>
            {item.description && <p className="mt-3 text-sm leading-6 text-white/55">{item.description}</p>}
          </div>
        </article>
      ))}
    </div>
  );
}
=======
}
>>>>>>> origin/main
